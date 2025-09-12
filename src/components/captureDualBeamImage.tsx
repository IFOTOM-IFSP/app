import { DualBeamImages } from "@/store/analysisStore";
import { CameraView } from "expo-camera";

export default async function captureDualBeamImage(
  camera: CameraView
): Promise<DualBeamImages> {
  const sampleChannelUris: string[] = [];
  const referenceChannelUris: string[] = [];
  const CAPTURE_COUNT = 10;

  for (let i = 0; i < CAPTURE_COUNT; i++) {
    const photo1 = await camera.takePictureAsync({ quality: 0.5 });
    const photo2 = await camera.takePictureAsync({ quality: 0.5 });

    if (!photo1 || !photo2) {
      throw new Error("Falha na captura da imagem de duplo feixe.");
    }
    sampleChannelUris.push(photo1.uri);
    referenceChannelUris.push(photo2.uri);
  }
  return { sampleChannelUris, referenceChannelUris };
}
