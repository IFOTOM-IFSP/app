import * as FileSystem from 'expo-file-system';
export default async function uriToBase64(uri: string): Promise<string> {
    try {
        return await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });
    } catch (e) {
        console.error("Erro ao converter imagem para Base64:", e);
        throw e;
    }
}