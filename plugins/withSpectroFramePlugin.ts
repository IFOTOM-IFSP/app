import {
  AndroidConfig,
  ConfigPlugin,
  IOSConfig,
  withAndroidManifest,
  withDangerousMod,
} from '@expo/config-plugins';
import { promises as fs } from 'fs';
import path from 'path';

const ANDROID_JAVA_RELATIVE_PATH = ['plugins', 'spectro', 'android', 'java', 'com', 'lucasbiazon', 'ifotom'];
const ANDROID_MANIFEST_RELATIVE_PATH = ['plugins', 'spectro', 'android', 'src', 'main', 'AndroidManifest.xml'];
const ANDROID_FILES = ['SpectroFramePlugin.kt', 'SpectroInitProvider.kt'];
const IOS_PLUGIN_RELATIVE_PATH = ['plugins', 'spectro', 'ios', 'SpectroFramePlugin.swift'];

type AndroidManifestAttributes = Record<string, string>;

async function copyFileAsync(source: string, target: string) {
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.copyFile(source, target);
}

async function readProviderAttributes(projectRoot: string): Promise<AndroidManifestAttributes> {
  const manifestPath = path.join(projectRoot, ...ANDROID_MANIFEST_RELATIVE_PATH);
  const manifest = await AndroidConfig.Manifest.readAndroidManifestAsync(manifestPath);
  const provider = manifest.manifest.application?.[0]?.provider?.[0]?.$;

  if (!provider) {
    throw new Error('O manifesto do plugin Spectro não contém um <provider> para registrar.');
  }

  return provider;
}

const withSpectroFramePlugin: ConfigPlugin = (config) => {
  config = withDangerousMod(config, ['android', async (cfg) => {
    if (cfg.modRequest.introspect) {
      return cfg;
    }

    const { projectRoot, platformProjectRoot } = cfg.modRequest;
    const sourceDir = path.join(projectRoot, ...ANDROID_JAVA_RELATIVE_PATH);
    const targetDir = path.join(platformProjectRoot, 'app', 'src', 'main', 'java', 'com', 'lucasbiazon', 'ifotom');

    await fs.mkdir(targetDir, { recursive: true });
    await Promise.all(
      ANDROID_FILES.map((file) =>
        copyFileAsync(path.join(sourceDir, file), path.join(targetDir, file)),
      ),
    );

    return cfg;
  }]);

  config = withAndroidManifest(config, async (cfg) => {
    const androidManifest = cfg.modResults;
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(androidManifest);
    const providerFromSnippet = await readProviderAttributes(cfg.modRequest.projectRoot);
    const providerAttributes = { ...providerFromSnippet };
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

  config = withDangerousMod(config, ['ios', async (cfg) => {
    if (cfg.modRequest.introspect) {
      return cfg;
    }

    const { projectRoot, platformProjectRoot } = cfg.modRequest;
    const sourceFile = path.join(projectRoot, ...IOS_PLUGIN_RELATIVE_PATH);
    const projectName =
      cfg.modRequest.projectName ?? IOSConfig.XcodeUtils.getProjectName(projectRoot);

    if (!projectName) {
      throw new Error('Não foi possível determinar o nome do projeto iOS para copiar o SpectroFramePlugin.');
    }

    const targetFile = path.join(platformProjectRoot, projectName, 'SpectroFramePlugin.swift');
    await copyFileAsync(sourceFile, targetFile);

    return cfg;
  }]);

  return config;
};

export default withSpectroFramePlugin;
