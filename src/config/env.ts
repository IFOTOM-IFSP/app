export const ENV = {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL
} as const;

import Constants from 'expo-constants';

export const SIM_MODE = (Constants?.expoConfig?.extra?.IFOTOM_SIM ?? '0') === '1';
export const SIM_PRESET = (Constants?.expoConfig?.extra?.IFOTOM_SIM_PRESET ?? 'happy') as
| 'happy'
| 'lowR2'
| 'saturation'
| 'drift'
| 'noisy';
export const SIM_SEED = Number(Constants?.expoConfig?.extra?.IFOTOM_SIM_SEED ?? 42);