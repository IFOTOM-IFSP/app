import { DeviceProfile } from '@/types/types';
import * as SecureStore from 'expo-secure-store';


const KEY_DEVICE_PROFILE = 'ifotom_device_profile_v1';


export async function saveDeviceProfile(profile: DeviceProfile) {
await SecureStore.setItemAsync(KEY_DEVICE_PROFILE, JSON.stringify(profile));
}


export async function loadDeviceProfile(): Promise<DeviceProfile | null> {
const raw = await SecureStore.getItemAsync(KEY_DEVICE_PROFILE);
if (!raw) return null;
try { return JSON.parse(raw) as DeviceProfile; } catch { return null; }
}


export async function clearDeviceProfile() {
await SecureStore.deleteItemAsync(KEY_DEVICE_PROFILE);
}