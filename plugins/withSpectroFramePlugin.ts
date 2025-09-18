import path from 'node:path';
import fs from 'node:fs/promises';
import {
  AndroidConfig,
  ConfigPlugin,
  IOSConfig,
  withAndroidManifest,
  withDangerousMod,
  withXcodeProject,
} from '@expo/config-plugins';

const ANDROID_PKG = 'com.lucasbiazon.ifotom';
const ANDROID_KT_FILENAME = 'SpectroFramePlugin.kt';
const ANDROID_SNIPPET = 'AndroidManifest.snippet.xml';

const IOS_SWIFT_FILENAME = 'SpectroFramePlugin.swift';

const SRC_ROOT = 'plugins/spectro';

type AndroidManifestAttributes = Record<string, string>;

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

async function copyFileAsync(src: string, dst: string) {
  await ensureDir(path.dirname(dst));
  await fs.copyFile(src, dst);
}

async function readProviderAttributes(projectRoot: string): Promise<AndroidManifestAttributes> {
  const manifestPath = path.join(projectRoot, SRC_ROOT, 'android', ANDROID_SNIPPET);
  const manifest = await AndroidConfig.Manifest.readAndroidManifestAsync(manifestPath);
  const provider = manifest.manifest.application?.[0]?.provider?.[0]?.$;

  if (!provider) {
    throw new Error('O manifesto do plugin Spectro não contém um <provider> para registrar.');
  }

  return provider;
}

const withSpectroAndroidManifest: ConfigPlugin = (config) =>
  withAndroidManifest(config, async (cfg) => {
    const androidManifest = cfg.modResults;
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(androidManifest);
    const providerAttributes = await readProviderAttributes(cfg.modRequest.projectRoot);
    const providerName = providerAttributes['android:name'];

    if (!providerName) {
      throw new Error('O manifesto do plugin Spectro precisa definir android:name para o provider.');
    }

    const providerEntry = { $: providerAttributes };

    if (!mainApplication.provider) {
      mainApplication.provider = [providerEntry];
    } else {
      const existingIndex = mainApplication.provider.findIndex(
        (item) => item.$['android:name'] === providerName,
      );

      if (existingIndex === -1) {
        mainApplication.provider.push(providerEntry);
      } else {
        mainApplication.provider[existingIndex].$ = {
          ...mainApplication.provider[existingIndex].$,
          ...providerAttributes,
        };
      }
    }

    return cfg;
  });

const withSpectroAndroidSources: ConfigPlugin = (config) =>
  withDangerousMod(config, ['android', async (cfg) => {
    if (cfg.modRequest.introspect) {
      return cfg;
    }

    const { projectRoot, platformProjectRoot } = cfg.modRequest;
    const sourceFile = path.join(projectRoot, SRC_ROOT, 'android', ANDROID_KT_FILENAME);
    const pkgPath = ANDROID_PKG.split('.').join(path.sep);
    const targetFile = path.join(
      platformProjectRoot,
      'app',
      'src',
      'main',
      'java',
      pkgPath,
      ANDROID_KT_FILENAME,
    );

    await copyFileAsync(sourceFile, targetFile);

    return cfg;
  }]);

const withSpectroIosCopy: ConfigPlugin = (config) =>
  withDangerousMod(config, ['ios', async (cfg) => {
    if (cfg.modRequest.introspect) {
      return cfg;
    }

    const { projectRoot, platformProjectRoot } = cfg.modRequest;
    const sourceFile = path.join(projectRoot, SRC_ROOT, 'ios', IOS_SWIFT_FILENAME);
    const projectName =
      cfg.modRequest.projectName ?? IOSConfig.XcodeUtils.getProjectName(projectRoot);

    if (!projectName) {
      throw new Error('Não foi possível determinar o nome do projeto iOS para copiar o SpectroFramePlugin.');
    }

    const targetFile = path.join(platformProjectRoot, projectName, IOS_SWIFT_FILENAME);
    await copyFileAsync(sourceFile, targetFile);

    return cfg;
  }]);

const withSpectroIosLink: ConfigPlugin = (config) =>
  withXcodeProject(config, (cfg) => {
    const project = cfg.modResults;
    const { modRequest } = cfg;
    const projectName =
      modRequest.projectName ?? IOSConfig.XcodeUtils.getProjectName(modRequest.projectRoot);

    if (!projectName) {
      throw new Error(
        'Não foi possível determinar o nome do projeto iOS para vincular o SpectroFramePlugin.',
      );
    }

    const relFilePath = path.join(projectName, IOS_SWIFT_FILENAME);

    const fileAlreadyLinked =
      Boolean((project as any).hasFile?.(relFilePath)) ||
      Object.values(project.pbxFileReferenceSection() ?? {}).some(
        (file: any) => file?.path === relFilePath,
      );

    if (!fileAlreadyLinked) {
      const firstTarget = project.getFirstTarget().uuid;
      project.addSourceFile(relFilePath, { target: firstTarget });
    }

    return cfg;
  });

const withSpectroFramePlugin: ConfigPlugin = (config) => {
  config = withSpectroAndroidManifest(config);
  config = withSpectroAndroidSources(config);
  config = withSpectroIosCopy(config);
  config = withSpectroIosLink(config);

  return config;
};

export default withSpectroFramePlugin;
