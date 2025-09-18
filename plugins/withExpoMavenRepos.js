const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const EXPO_REPO_LINE = 'maven { url = uri("$rootDir/../node_modules/expo/modules/android/maven") }';
const RN_REPO_LINE = 'maven { url = uri("$rootDir/../node_modules/react-native/android") }';

const PLUGIN_REPO_BLOCK = [
  '  repositories {',
  '    gradlePluginPortal()',
  '    google()',
  '    mavenCentral()',
  `    ${EXPO_REPO_LINE}`,
  `    ${RN_REPO_LINE}`,
  '  }',
].join('\n');

const DEP_REPO_BLOCK = [
  '  repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)',
  '  repositories {',
  '    google()',
  '    mavenCentral()',
  `    ${EXPO_REPO_LINE}`,
  `    ${RN_REPO_LINE}`,
  '  }',
].join('\n');

function findBlockRange(source, blockHeader) {
  const header = `${blockHeader} {`;
  const start = source.indexOf(header);
  if (start === -1) {
    return null;
  }

  const openBraceIndex = start + header.length - 1;
  let depth = 0;
  for (let i = openBraceIndex; i < source.length; i += 1) {
    const char = source[i];
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        return { start, openBraceIndex, end: i + 1 };
      }
    }
  }
  return null;
}

function rebuildBlock(contents, range, header, body) {
  const before = contents.slice(0, range.start);
  const after = contents.slice(range.end);
  return `${before}${header} {\n${body}\n}${after}`;
}

function stripRepositorySections(lines) {
  const result = [];
  let skipDepth = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length === 0 && result.length === 0) {
      continue;
    }
    if (skipDepth > 0) {
      skipDepth += (line.match(/\{/g) || []).length;
      skipDepth -= (line.match(/\}/g) || []).length;
      if (skipDepth <= 0) {
        skipDepth = 0;
      }
      continue;
    }
    if (trimmed.startsWith('repositoriesMode.set')) {
      continue;
    }
    if (trimmed.startsWith('repositories {')) {
      skipDepth = 1;
      skipDepth += (line.match(/\{/g) || []).length - 1;
      skipDepth -= (line.match(/\}/g) || []).length;
      if (skipDepth < 0) skipDepth = 0;
      continue;
    }
    result.push(line);
  }
  while (result.length && result[result.length - 1].trim().length === 0) {
    result.pop();
  }
  return result;
}

function formatRemainder(lines) {
  if (lines.length === 0) {
    return '';
  }
  const formatted = lines
    .map((line) => {
      if (line.trim().length === 0) {
        return '';
      }
      return line.startsWith('  ') ? line : `  ${line.trimStart()}`;
    })
    .filter((line, index, arr) => !(line.length === 0 && (index === 0 || arr[index - 1].length === 0)));

  return formatted.length ? `\n${formatted.join('\n')}` : '';
}

function ensureBlock(contents, blockName, repoBlock) {
  const range = findBlockRange(contents, blockName);
  if (!range) {
    if (blockName === 'dependencyResolutionManagement') {
      const block = ['dependencyResolutionManagement {', repoBlock, '}'].join('\n');
      return `${contents.trim()}\n\n${block}\n`;
    }
    return contents;
  }

  const block = contents.slice(range.start, range.end);
  const innerLines = block.slice(range.openBraceIndex - range.start + 1, -1).split('\n');
  const remainderLines = stripRepositorySections(innerLines);
  const remainder = formatRemainder(remainderLines);
  const newBody = `${repoBlock}${remainder}`;
  return rebuildBlock(contents, range, blockName, newBody);
}

module.exports = (config) => {
  return withDangerousMod(config, ['android', async (config) => {
    const settingsPath = path.join(config.modRequest.platformProjectRoot, 'settings.gradle');
    let contents = await fs.promises.readFile(settingsPath, 'utf8');

    const original = contents;

    contents = ensureBlock(contents, 'pluginManagement', PLUGIN_REPO_BLOCK);
    contents = ensureBlock(contents, 'dependencyResolutionManagement', DEP_REPO_BLOCK);

    if (contents !== original) {
      await fs.promises.writeFile(settingsPath, `${contents.trim()}\n`);
    }

    return config;
  }]);
};
