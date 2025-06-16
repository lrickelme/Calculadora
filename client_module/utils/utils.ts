import * as Audio from "expo-audio";
import { DocumentPickerResult } from "expo-document-picker";
import * as Location from "expo-location";

export async function requestPermissions() {
  const localizationStatus = await Location.requestForegroundPermissionsAsync();
  const audioStatus = await Audio.requestRecordingPermissionsAsync();
  if (localizationStatus.status !== "granted") {
    throw new Error("Permissão de localização negada");
  }
  if (audioStatus.status !== "granted") {
    throw new Error("Permissão de gravação de áudio negada");
  }
  return {
    localizationStatus: localizationStatus.status,
    audioStatus: audioStatus.status,
  };
}

export async function getPosition() {
  const { localizationStatus } = await requestPermissions();
  if (localizationStatus === "granted") {
    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });
    return {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      timestamp: pos.timestamp,
    };
  } else {
    throw new Error("Permissão de localização negada");
  }
}

export const createAudioDocumentResult = (
  audioUri: string
): DocumentPickerResult => {
  const fileName = `panic_audio_${Date.now()}.m4a`;

  return {
    canceled: false,
    assets: [
      {
        uri: audioUri,
        name: fileName,
        size: undefined,
        mimeType: "audio/m4a",
      },
    ],
  };
};
