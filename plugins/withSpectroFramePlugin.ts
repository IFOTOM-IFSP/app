import {
  AndroidConfig,
  ConfigPlugin,
  IOSConfig,
  withAndroidManifest,
  withDangerousMod,
  withIosXcodeProject,
} from '@expo/config-plugins';
import type { AndroidManifest } from '@expo/config-plugins/build/android/Manifest';
import { Dirent, promises as fs } from 'node:fs';
import path from 'node:path';

const SPECTRO_PLUGIN_ROOT = 'plugins/spectro';
const ANDROID_SNIPPET_PATH = path.join(
  SPECTRO_PLUGIN_ROOT,
  'android',
  'src',
  'main',
  'AndroidManifest.xml',
);
const ANDROID_SOURCE_ROOT = path.join(SPECTRO_PLUGIN_ROOT, 'android', 'src', 'main', 'java');
const IOS_SOURCE_ROOT = path.join(SPECTRO_PLUGIN_ROOT, 'ios');
const IOS_SOURCE_FILES = ['SpectroFramePlugin.swift', 'SpectroFramePlugin.m'];

const toPosixPath = (...segments: string[]) => segments.filter(Boolean).join('/');

const resolveIosProjectName = (projectRoot: string, providedName?: string | null) => {
  if (providedName) {
    return providedName;
  }

  try {
    return IOSConfig.XcodeUtils.getProjectName(projectRoot);
  } catch {
    return null;
  }
};

async function copyDirectoryRecursive(source: string, target: string) {
  let entries: Dirent[];
  try {
    entries = await fs.readdir(source, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return;
    }
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
    }),
  );
}

const withAndroidSpectroSources: ConfigPlugin = (config) =>
  withDangerousMod(config, ['android', async (modConfig) => {
    const projectRoot = modConfig.modRequest.projectRoot;
    const platformProjectRoot = modConfig.modRequest.platformProjectRoot;
    const sourceRoot = path.join(projectRoot, ANDROID_SOURCE_ROOT);
    const destinationRoot = path.join(platformProjectRoot, 'app', 'src', 'main', 'java');

    await copyDirectoryRecursive(sourceRoot, destinationRoot);

    return modConfig;
  }]);

const withAndroidSpectroManifest: ConfigPlugin = (config) =>
  withAndroidManifest(config, async (modConfig) => {
    const projectRoot = modConfig.modRequest.projectRoot;
    const snippetPath = path.join(projectRoot, ANDROID_SNIPPET_PATH);
    let snippetManifest: AndroidManifest;

    try {
      snippetManifest = await AndroidConfig.Manifest.readAndroidManifestAsync(snippetPath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return modConfig;
      }
      throw error;
    }

    const snippetApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(snippetManifest);
    const snippetProviders = snippetApplication.provider ?? [];

    if (snippetProviders.length === 0) {
      return modConfig;
    }

    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(modConfig.modResults);
    mainApplication.provider = mainApplication.provider ?? [];

    for (const provider of snippetProviders) {
      const providerName = provider.$?.['android:name'];
      if (!providerName) {
        continue;
      }

      const existingIndex = mainApplication.provider.findIndex(
        (existingProvider) => existingProvider.$?.['android:name'] === providerName,
      );

      if (existingIndex >= 0) {
        mainApplication.provider[existingIndex] = provider;
      } else {
        mainApplication.provider.push(provider);
      }
    }

    return modConfig;
  });

const withIosSpectroSources: ConfigPlugin = (config) =>
  withDangerousMod(config, ['ios', async (modConfig) => {
    const projectRoot = modConfig.modRequest.projectRoot;
    const platformProjectRoot = modConfig.modRequest.platformProjectRoot;
    const projectName = resolveIosProjectName(projectRoot, modConfig.modRequest.projectName);

    if (!projectName) {
      return modConfig;
    }

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
          if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
            throw error;
          }
        }
      }),
    );

    return modConfig;
  }]);

const withIosSpectroProjectLinks: ConfigPlugin = (config) =>
  withIosXcodeProject(config, (modConfig) => {
    const project = modConfig.modResults;
    const projectRoot = modConfig.modRequest.projectRoot;
    const projectName = resolveIosProjectName(projectRoot, modConfig.modRequest.projectName);

    if (!projectName) {
      return modConfig;
    }

    IOSConfig.XcodeUtils.ensureGroupRecursively(project, projectName);

    for (const fileName of IOS_SOURCE_FILES) {
      const filePath = toPosixPath(projectName, fileName);
      IOSConfig.XcodeUtils.addFileToGroupAndLink({
        filepath: filePath,
        groupName: projectName,
        project,
      });
    }

    return modConfig;
  });

const withSpectroFramePlugin: ConfigPlugin = (config) => {
  let updatedConfig = config;
  updatedConfig = withAndroidSpectroSources(updatedConfig);
  updatedConfig = withAndroidSpectroManifest(updatedConfig);
  updatedConfig = withIosSpectroSources(updatedConfig);
  updatedConfig = withIosSpectroProjectLinks(updatedConfig);
  return updatedConfig;
};

export default withSpectroFramePlugin;
