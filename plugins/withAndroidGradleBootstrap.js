// plugins/withAndroidGradleBootstrap.js
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const https = require('https');
const path = require('path');

const EXPO_REMOTE_REPO_LINE = 'maven { url = uri("https://packages.expo.dev") }';
const EXPO_LOCAL_REPO_LINE = 'maven { url = uri("$rootDir/../node_modules/expo/modules/android/maven") }';
const RN_REPO_LINE = 'maven { url = uri("$rootDir/../node_modules/react-native/android") }';

const TLS_ERROR_CODES = new Set([
  'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
  'CERTIFICATE_VERIFY_FAILED',
  'SELF_SIGNED_CERT_IN_CHAIN',
  'DEPTH_ZERO_SELF_SIGNED_CERT',
  'UNABLE_TO_GET_ISSUER_CERT',
  'UNABLE_TO_GET_ISSUER_CERT_LOCALLY',
  'CERT_HAS_EXPIRED',
]);

const withIndentation = (lines, indent = '    ') => lines.map((line) => `${indent}${line}`);

const pluginManagementRepositories = (includeRemote) =>
  withIndentation([
    'gradlePluginPortal()',
    'google()',
    'mavenCentral()',
    EXPO_LOCAL_REPO_LINE,
    RN_REPO_LINE,
    ...(includeRemote ? [EXPO_REMOTE_REPO_LINE] : []),
  ]);

const buildPluginManagementBlock = (includeRemote) =>
  [
    'pluginManagement {',
    '  repositories {',
    ...pluginManagementRepositories(includeRemote),
    '  }',
    '  includeBuild("../node_modules/@react-native/gradle-plugin")',
    '}',
  ].join('\n');

const dependencyRepositories = (includeRemote) =>
  withIndentation([
    'google()',
    'mavenCentral()',
    EXPO_LOCAL_REPO_LINE,
    RN_REPO_LINE,
    ...(includeRemote ? [EXPO_REMOTE_REPO_LINE] : []),
  ]);

const buildDependencyResolutionBlock = (includeRemote) =>
  [
    'dependencyResolutionManagement {',
    '  repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)',
    '  repositories {',
    ...dependencyRepositories(includeRemote),
    '  }',
    '}',
  ].join('\n');

const SETTINGS_PLUGIN_BLOCK = [
  'plugins {',
  '  id("com.facebook.react.settings")',
  '}',
  '',
  '// Ativa autolink a partir do comando (RN 0.76+)',
  'extensions.configure(com.facebook.react.ReactSettingsExtension) { ex ->',
  '  ex.autolinkLibrariesFromCommand()',
  '}',
].join('\n');

function upsertBlock(contents, headerRegex, blockString) {
  // se já existe algo que comece com o header, mantém; senão, adiciona ao final
  const rx = new RegExp(headerRegex, 'm');
  if (rx.test(contents)) return contents;
  return `${contents.trim()}\n\n${blockString}\n`;
}

function removeRepositoryLine(block, line) {
  const target = line.trim();
  return block
    .split('\n')
    .filter((entry) => entry.trim() !== target)
    .join('\n');
}

function ensureInsidePluginManagement(contents, line) {
  // injeta uma linha dentro do bloco pluginManagement { ... } se não existir
  const pmStart = contents.indexOf('pluginManagement {');
  if (pmStart === -1) return contents;
  const pmEnd = findMatchingBrace(contents, pmStart + 'pluginManagement'.length);
  if (pmEnd === -1) return contents;

  const block = contents.slice(pmStart, pmEnd);
  if (block.includes(line)) return contents;

  const insertPos = pmStart + block.indexOf('}');
  const before = contents.slice(0, insertPos);
  const after = contents.slice(insertPos);
  const injected = before.replace(/}\s*$/, `  ${line}\n}\n`);
  return injected + after;
}

function findMatchingBrace(source, openKeywordEndIndex) {
  // encontra o '}' que fecha o primeiro '{' após openKeywordEndIndex
  const openPos = source.indexOf('{', openKeywordEndIndex);
  if (openPos === -1) return -1;
  let depth = 0;
  for (let i = openPos; i < source.length; i++) {
    const ch = source[i];
    if (ch === '{') depth++;
    if (ch === '}') {
      depth--;
      if (depth === 0) return i + 1;
    }
  }
  return -1;
}

function ensureExpoRepositoryInPluginManagement(contents, includeRemote) {
  const remoteLine = `    ${EXPO_REMOTE_REPO_LINE}`;
  const localLine = `    ${EXPO_LOCAL_REPO_LINE}`;
  const pmStart = contents.indexOf('pluginManagement {');
  if (pmStart === -1) return contents;

  const pmEnd = findMatchingBrace(contents, pmStart);
  if (pmEnd === -1) return contents;

  const block = contents.slice(pmStart, pmEnd);
  if (!block.includes('repositories {')) return contents;

  if (!includeRemote) {
    if (!block.includes(remoteLine)) return contents;
    const cleaned = removeRepositoryLine(block, remoteLine);
    return `${contents.slice(0, pmStart)}${cleaned}${contents.slice(pmEnd)}`;
  }

  if (block.includes(remoteLine)) return contents;

  let updatedBlock;
  if (block.includes(localLine)) {
    updatedBlock = block.replace(localLine, `${localLine}\n${remoteLine}`);
  } else if (block.includes('    mavenCentral()')) {
    updatedBlock = block.replace('    mavenCentral()', `    mavenCentral()\n${remoteLine}`);
  } else {
    const repoIdx = block.indexOf('repositories {');
    if (repoIdx === -1) return contents;
    const insertPos = block.indexOf('\n', repoIdx);
    const before = block.slice(0, insertPos + 1);
    const after = block.slice(insertPos + 1);
    updatedBlock = `${before}${remoteLine}\n${after}`;
  }

  return `${contents.slice(0, pmStart)}${updatedBlock}${contents.slice(pmEnd)}`;
}

function ensureExpoRepositoryInDependencyBlock(contents, includeRemote) {
  const remoteLine = `    ${EXPO_REMOTE_REPO_LINE}`;
  const localLine = `    ${EXPO_LOCAL_REPO_LINE}`;
  const blockStart = contents.indexOf('dependencyResolutionManagement {');
  if (blockStart === -1) return contents;

  const blockEnd = findMatchingBrace(contents, blockStart);
  if (blockEnd === -1) return contents;

  const block = contents.slice(blockStart, blockEnd);
  if (!includeRemote) {
    if (!block.includes(remoteLine)) return contents;
    const cleaned = removeRepositoryLine(block, remoteLine);
    return `${contents.slice(0, blockStart)}${cleaned}${contents.slice(blockEnd)}`;
  }

  if (block.includes(remoteLine)) return contents;

  let updatedBlock;
  if (block.includes(localLine)) {
    updatedBlock = block.replace(localLine, `${localLine}\n${remoteLine}`);
  } else if (block.includes('    mavenCentral()')) {
    updatedBlock = block.replace('    mavenCentral()', `    mavenCentral()\n${remoteLine}`);
  } else {
    const repoIdx = block.indexOf('repositories {');
    if (repoIdx === -1) return contents;
    const insertPos = block.indexOf('\n', repoIdx);
    const before = block.slice(0, insertPos + 1);
    const after = block.slice(insertPos + 1);
    updatedBlock = `${before}${remoteLine}\n${after}`;
  }

  return `${contents.slice(0, blockStart)}${updatedBlock}${contents.slice(blockEnd)}`;
}

function sanitizeBlankLines(source) {
  return source.replace(/\n{3,}/g, '\n\n');
}

function probeExpoRemoteRepository(timeoutMs = 2500) {
  return new Promise((resolve) => {
    const request = https.request(
      'https://packages.expo.dev/',
      { method: 'HEAD', timeout: timeoutMs },
      (response) => {
        response.resume();
        resolve(true);
      }
    );

    let resolved = false;

    const finish = (result) => {
      if (!resolved) {
        resolved = true;
        resolve(result);
      }
    };

    request.on('error', (error) => {
      const code = error.code || 'UNKNOWN';
      if (TLS_ERROR_CODES.has(code)) {
        console.warn(
          `[withAndroidGradleBootstrap] TLS error when contacting https://packages.expo.dev (${code}). Remote Expo Maven repository will be skipped.\n` +
            'Install the required certificate authority or set EXPO_FORCE_EXPO_PACKAGES_MAVEN=1 to override.'
        );
      } else if (code !== 'ECONNRESET') {
        console.warn(
          `[withAndroidGradleBootstrap] Unable to reach https://packages.expo.dev (${code}). Remote Expo Maven repository will be skipped.`
        );
      }
      finish(false);
    });

    request.on('timeout', () => {
      console.warn('[withAndroidGradleBootstrap] Timeout while checking https://packages.expo.dev. Skipping remote Expo Maven repository.');
      request.destroy(new Error('ETIMEDOUT'));
      finish(false);
    });

    request.end();
  });
}

async function shouldIncludeExpoRemoteRepository() {
  if (process.env.EXPO_DISABLE_EXPO_PACKAGES_MAVEN === '1') {
    console.warn('[withAndroidGradleBootstrap] EXPO_DISABLE_EXPO_PACKAGES_MAVEN=1 detected. Remote Expo Maven repository will not be added.');
    return false;
  }
  if (process.env.EXPO_FORCE_EXPO_PACKAGES_MAVEN === '1') {
    return true;
  }

  return probeExpoRemoteRepository();
}

module.exports = (config) =>
  withDangerousMod(config, [
    'android',
    async (modConfig) => {
      const settingsPath = path.join(modConfig.modRequest.platformProjectRoot, 'settings.gradle');
      let contents = await fs.promises.readFile(settingsPath, 'utf8');
      const original = contents;

      const includeRemoteRepository = await shouldIncludeExpoRemoteRepository();
      const pluginBlock = buildPluginManagementBlock(includeRemoteRepository);
      const dependencyBlock = buildDependencyResolutionBlock(includeRemoteRepository);

      // 1) Garante pluginManagement (com repos + includeBuild RNGP)
      contents = upsertBlock(contents, '^\\s*pluginManagement\\s*\\{', pluginBlock);
      // redundância defensiva: se já existe pluginManagement mas faltou o includeBuild, injeta dentro
      contents = ensureInsidePluginManagement(contents, 'includeBuild("../node_modules/@react-native/gradle-plugin")');
      contents = ensureExpoRepositoryInPluginManagement(contents, includeRemoteRepository);

      // 2) Garante dependencyResolutionManagement (repos)
      contents = upsertBlock(contents, '^\\s*dependencyResolutionManagement\\s*\\{', dependencyBlock);
      contents = ensureExpoRepositoryInDependencyBlock(contents, includeRemoteRepository);

      // 3) Garante plugins { id("com.facebook.react.settings") } + extensions.configure(...)
      contents = upsertBlock(contents, '^\\s*plugins\\s*\\{[\\s\\S]*?\\}', SETTINGS_PLUGIN_BLOCK);

      // 4) Garante rootProject.name e include(":app") (caso template esteja vazio)
      if (!/^\s*rootProject\.name\s*=/.test(contents)) {
        contents = `${contents.trim()}\n\nrootProject.name = "app"\n`;
      }
      if (!/^\s*include\(":app"\)/m.test(contents)) {
        contents = `${contents.trim()}\ninclude(":app")\n`;
      }

      contents = sanitizeBlankLines(contents);

      if (contents !== original) {
        await fs.promises.writeFile(settingsPath, `${contents.trim()}\n`, 'utf8');
      }
      return modConfig;
    },
  ]);
