// plugins/withAndroidGradleBootstrap.js
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const EXPO_REPO_LINE = 'maven { url = uri("$rootDir/../node_modules/expo/modules/android/maven") }';
const RN_REPO_LINE = 'maven { url = uri("$rootDir/../node_modules/react-native/android") }';

const PLUGIN_MGMT_BLOCK = [
  'pluginManagement {',
  '  repositories {',
  '    gradlePluginPortal()',
  '    google()',
  '    mavenCentral()',
  `    ${EXPO_REPO_LINE}`,
  `    ${RN_REPO_LINE}`,
  '  }',
  '  includeBuild("../node_modules/@react-native/gradle-plugin")',
  '}',
].join('\n');

const DEP_RESOLUTION_BLOCK = [
  'dependencyResolutionManagement {',
  '  repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)',
  '  repositories {',
  '    google()',
  '    mavenCentral()',
  `    ${EXPO_REPO_LINE}`,
  `    ${RN_REPO_LINE}`,
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

module.exports = (config) =>
  withDangerousMod(config, [
    'android',
    async (modConfig) => {
      const settingsPath = path.join(modConfig.modRequest.platformProjectRoot, 'settings.gradle');
      let contents = await fs.promises.readFile(settingsPath, 'utf8');
      const original = contents;

      // 1) Garante pluginManagement (com repos + includeBuild RNGP)
      contents = upsertBlock(contents, '^\\s*pluginManagement\\s*\\{', PLUGIN_MGMT_BLOCK);
      // redundância defensiva: se já existe pluginManagement mas faltou o includeBuild, injeta dentro
      contents = ensureInsidePluginManagement(contents, 'includeBuild("../node_modules/@react-native/gradle-plugin")');

      // 2) Garante dependencyResolutionManagement (repos)
      contents = upsertBlock(contents, '^\\s*dependencyResolutionManagement\\s*\\{', DEP_RESOLUTION_BLOCK);

      // 3) Garante plugins { id("com.facebook.react.settings") } + extensions.configure(...)
      contents = upsertBlock(contents, '^\\s*plugins\\s*\\{[\\s\\S]*?\\}', SETTINGS_PLUGIN_BLOCK);

      // 4) Garante rootProject.name e include(":app") (caso template esteja vazio)
      if (!/^\s*rootProject\.name\s*=/.test(contents)) {
        contents = `${contents.trim()}\n\nrootProject.name = "app"\n`;
      }
      if (!/^\s*include\(":app"\)/m.test(contents)) {
        contents = `${contents.trim()}\ninclude(":app")\n`;
      }

      if (contents !== original) {
        await fs.promises.writeFile(settingsPath, `${contents.trim()}\n`, 'utf8');
      }
      return modConfig;
    },
  ]);
