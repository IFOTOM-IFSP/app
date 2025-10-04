export default ({ config }) => ({
...config,
extra: {
...config.extra,
IFOTOM_SIM: process.env.EXPO_PUBLIC_IFOTOM_SIM ?? '0',
IFOTOM_SIM_PRESET: process.env.EXPO_PUBLIC_IFOTOM_SIM_PRESET ?? 'happy',
IFOTOM_SIM_SEED: process.env.EXPO_PUBLIC_IFOTOM_SIM_SEED ?? '42',
},
});