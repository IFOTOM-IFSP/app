import type { DeviceProfile, ROI } from '@/types/types';

export interface LegacySpectrometerProfile {
  id: string;
  name: string;
  calibrationDate: string;
  pixelToWavelengthMapping: {
    type: 'polynomial';
    coefficients: number[]; // [a0, a1, a2?]
  };
}

export function legacyToDeviceProfile(
  legacy: LegacySpectrometerProfile,
  opts?: {
    roi?: ROI; // { x,y,w,h } do app
    rmse_nm?: number;
    camera_meta?: DeviceProfile['camera_meta'];
  }
): DeviceProfile {
  const [a0 = 0, a1 = 1, a2] = legacy.pixelToWavelengthMapping?.coefficients ?? [];
  return {
    device_hash: legacy.id,
    pixel_to_nm: { a0, a1, a2 },
    rmse_nm: opts?.rmse_nm,
    roi: opts?.roi ?? { x: 0, y: 0, w: 2048, h: 1 }, 
    camera_meta: opts?.camera_meta,
  };
}

