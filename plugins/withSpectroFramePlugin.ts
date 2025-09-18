import { ConfigPlugin, withDangerousMod } from '@expo/config-plugins';

/**
 * Minimal config plugin so Expo is aware of the native Spectro frame processor.
 */
const withSpectroFramePlugin: ConfigPlugin = (config) => {
  return withDangerousMod(config, ['ios', async (cfg) => cfg]);
};

export default withSpectroFramePlugin;
