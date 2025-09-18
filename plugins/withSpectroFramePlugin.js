// plugins/withSpectroFramePlugin.js
const {
  AndroidConfig,
  IOSConfig,
  withDangerousMod,
  withXcodeProject,
} = require('@expo/config-plugins');
const fs = require('fs/promises');
const fscore = require('fs');
const path = require('path');

const SPECTRO_PLUGIN_ROOT = 'plugins/spectro';

const ANDROID_SNIPPET_PATH = path.join(
  SPECTRO_PLUGIN_ROOT,
  'android',
  'src',
  'main',
  'AndroidManifest.xml'
);
const ANDROID_SOURCE_ROOT = path.join(SPECTRO_PLUGIN_ROOT, 'android', 'src', 'main', 'java');

const IOS_SOURCE_ROOT = path.join(SPECTRO_PLUGIN_ROOT, 'ios');
const IOS_SOURCE_FILES = ['SpectroFramePlugin.swift', 'SpectroFramePlugin.m'];

const toPosixPath = (...segments) => segments.filter(Boolean).join('/');

const resolveIosProjectName = (projectRoot, providedName) => {
  if (providedName) return providedName;
  try {
    return IOSConfig.XcodeUtils.getProjectName(projectRoot);
  } catch {
    return null;
  }
};

async function copyDirectoryRecursive(source, target) {
  let entries;
  try {
    entries = await fs.readdir(source, { withFileTypes: true });
  } catch (error) {
    if (error && error.code === 'ENOENT') return;
    throw error;
  }

  await fs.mkdir(target, { recursive: true });

  await Promise.all(
    entries.map(async (entry) => {
      const sourcePath = path.join(source, entry.name);
      const targetPath = path.join(target, entry.name);
      if (entry.isDirectory()) {
        await copyDirectoryRecursive(sourcePath, targetPath);
        return;
      }
      if (entry.isFile()) {
        await fs.mkdir(path.dirname(targetPath), { recursive: true });
        await fs.copyFile(sourcePath, targetPath);
      }
    })
  );
}

/** ANDROID: copia os fontes do Frame Processor para o projeto gerado no prebuild */
const withAndroidSpectroSources = (config) =>
  withDangerousMod(config, [
    'android',
    async (modConfig) => {
      const projectRoot = modConfig.modRequest.projectRoot;
      const platformProjectRoot = modConfig.modRequest.platformProjectRoot;
      const sourceRoot = path.join(projectRoot, ANDROID_SOURCE_ROOT);
      const destinationRoot = path.join(platformProjectRoot, 'app', 'src', 'main', 'java');
      await copyDirectoryRecursive(sourceRoot, destinationRoot);
      return modConfig;
    },
  ]);

/** ANDROID: mescla <provider> do snippet no AndroidManifest.xml – tolerante à primeira passada do prebuild */
const withAndroidSpectroManifest = (config) =>
  withDangerousMod(config, [
    'android',
    async (modConfig) => {
      const projectRoot = modConfig.modRequest.projectRoot;
      const platformProjectRoot = modConfig.modRequest.platformProjectRoot;

      const mainManifestPath = path.join(
        platformProjectRoot,
        'app',
        'src',
        'main',
        'AndroidManifest.xml'
      );

      // 1) Se o Manifest principal ainda não existe, pule (o prebuild ainda está montando o projeto)
      if (!fscore.existsSync(mainManifestPath)) {
        console.warn('[Spectro] AndroidManifest ainda não existe; pulando merge do <provider> nesta passada.');
        return modConfig;
      }

      // 2) Carrega o snippet opcional
      let snippetManifest;
      try {
        const snippetPath = path.join(projectRoot, ANDROID_SNIPPET_PATH);
        snippetManifest = await AndroidConfig.Manifest.readAndroidManifestAsync(snippetPath);
      } catch (e) {
        if (!(e && e.code === 'ENOENT')) throw e;
      }
      if (!snippetManifest) {
        return modConfig; // nada a mesclar
      }

      // 3) Lê o manifest principal
      const mainManifest = await AndroidConfig.Manifest.readAndroidManifestAsync(mainManifestPath);

      // Garante estrutura mínima (se application estiver ausente, ainda é cedo na pipeline)
      const apps = mainManifest?.manifest?.application;
      if (!Array.isArray(apps) || apps.length === 0) {
        console.warn('[Spectro] AndroidManifest sem <application> ainda; pulando merge do <provider> nesta passada.');
        return modConfig;
      }

      const mainApp = apps[0];

      // 4) Providers do snippet
      const snippetApp = AndroidConfig.Manifest.getMainApplicationOrThrow(snippetManifest);
      const snippetProviders = snippetApp.provider ?? [];
      if (!snippetProviders.length) return modConfig;

      // 5) Garante array de providers no main
      mainApp.provider = mainApp.provider ?? [];

      // 6) Mescla (replace se mesmo android:name)
      for (const provider of snippetProviders) {
        const name = provider?.$?.['android:name'];
        if (!name) continue;
        const idx = mainApp.provider.findIndex((p) => p?.$?.['android:name'] === name);
        if (idx >= 0) mainApp.provider[idx] = provider;
        else mainApp.provider.push(provider);
      }

      // 7) Escreve de volta
      await AndroidConfig.Manifest.writeAndroidManifestAsync(mainManifestPath, mainManifest);

      return modConfig;
    },
  ]);

/** iOS: copia fontes Swift/ObjC para o projeto iOS gerado no prebuild */
const withIosSpectroSources = (config) =>
  withDangerousMod(config, [
    'ios',
    async (modConfig) => {
      const projectRoot = modConfig.modRequest.projectRoot;
      const platformProjectRoot = modConfig.modRequest.platformProjectRoot;
      const projectName = resolveIosProjectName(projectRoot, modConfig.modRequest.projectName);
      if (!projectName) return modConfig;

      const sourceRoot = path.join(projectRoot, IOS_SOURCE_ROOT);
      const destinationRoot = path.join(platformProjectRoot, projectName);
      await fs.mkdir(destinationRoot, { recursive: true });

      await Promise.all(
        IOS_SOURCE_FILES.map(async (fileName) => {
          const sourcePath = path.join(sourceRoot, fileName);
          const destinationPath = path.join(destinationRoot, fileName);
          try {
            await fs.copyFile(sourcePath, destinationPath);
          } catch (error) {
            if (!(error && error.code === 'ENOENT')) throw error;
          }
        })
      );
      return modConfig;
    },
  ]);

/** iOS: adiciona/linka os arquivos no target da app no Xcode */
const withIosSpectroProjectLinks = (config) =>
  withXcodeProject(config, (modConfig) => {
    const project = modConfig.modResults;
    const projectRoot = modConfig.modRequest.projectRoot;
    const projectName = resolveIosProjectName(projectRoot, modConfig.modRequest.projectName);
    if (!projectName) return modConfig;

    IOSConfig.XcodeUtils.ensureGroupRecursively(project, projectName);

    const appTarget = IOSConfig.XcodeUtils.getApplicationNativeTarget({
      project,
      projectName,
    });

    for (const fileName of IOS_SOURCE_FILES) {
      const filePath = toPosixPath(projectName, fileName);
      (IOSConfig.XcodeUtils).addFileToGroupAndLink({
        filepath: filePath,
        groupName: projectName,
        project,
        addFileToProject: (IOSConfig.XcodeUtils).addFileToProject,
        targetUuid: appTarget && appTarget.uuid,
        verbose: false,
      });
    }

    return modConfig;
  });

function withSpectroFramePlugin(config) {
  let updated = config;
  updated = withAndroidSpectroSources(updated);
  updated = withAndroidSpectroManifest(updated);
  updated = withIosSpectroSources(updated);
  updated = withIosSpectroProjectLinks(updated);
  return updated;
}

module.exports = withSpectroFramePlugin;
module.exports.default = withSpectroFramePlugin;
