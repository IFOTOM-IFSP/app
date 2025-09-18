// plugins/withSpectroFramePlugin.js
const { withDangerousMod } = require('@expo/config-plugins');

/** @type {import('@expo/config-plugins').ConfigPlugin} */
const withSpectroFramePlugin = (config) => {
  // mantenho o mesmo no-op do seu TS
  return withDangerousMod(config, ['ios', async (cfg) => cfg]);
};

module.exports = withSpectroFramePlugin;
