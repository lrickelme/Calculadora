import { ContextApiApp } from "@/hooks/contexAPI";
import {
  createAudioDocumentResult,
  getPosition,
  requestPermissions,
} from "@/utils/utils";
import { RecordingPresets, useAudioRecorder } from "expo-audio";
import { DocumentPickerResult } from "expo-document-picker";
import { useContext, useEffect, useState } from "react";
import { Pressable, useWindowDimensions, Vibration } from "react-native";

export function PanicButton() {
  const dimensions = useWindowDimensions();
  const { width, height } = dimensions;
  const context = useContext(ContextApiApp);
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  useEffect(() => {
    (async () => {
      const status = await requestPermissions();
      if (
        status.audioStatus === "granted" &&
        status.localizationStatus === "granted"
      ) {
        setHasPermission(true);
      }
    })();
  }, []);

  const startRecording = async (): Promise<void> => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  };

  const stopRecording = async (): Promise<DocumentPickerResult | null> => {
    await audioRecorder.stop();

    return createAudioDocumentResult(audioRecorder.uri ?? "");
  };

  const handlePress = async () => {
    Vibration.vibrate([100, 100, 100, 100]);

    await startRecording();

    const positionPromise = getPosition();
    setTimeout(async () => {
      try {
        const audio = await stopRecording();
        const position = await positionPromise;
        context?.addReport({
          type: "Panic",
          description: "Urgente! Acionou o botão de pânico",
          urgencies: "Alta",
          position: position,
          file: audio,
        });
      } catch (stopError) {
        console.error("Erro ao finalizar gravação:", stopError);

        const position = await positionPromise;
        context?.addReport({
          type: "Panic",
          description: "Urgente! Acionou o botão de pânico (erro no áudio)",
          urgencies: "Alta",
          position: position,
          file: null,
        });
      } finally {
        Vibration.vibrate([100, 100, 100, 100]);
      }
    }, 30000);
  };

  // Fallback se não tiver permissão
  const handlePressWithoutAudio = async () => {
    Vibration.vibrate([100, 100, 100, 100]);
    try {
      const position = await getPosition();
      context?.addReport({
        type: "Panic",
        description: "Urgente! Acionou o botão de pânico",
        urgencies: "Alta",
        position: position,
        file: null,
      });
      console.log("Relatório de pânico enviado sem áudio");
    } catch (error) {
      console.error("Erro ao obter localização:", error);
    }
  };

  if (hasPermission === false) {
    return (
      <Pressable
        style={{
          width: width,
          height: height * 0.3,
        }}
        onLongPress={handlePressWithoutAudio}
        delayLongPress={3000}
      />
    );
  } else {
    return (
      <Pressable
        style={{
          width: width,
          height: height * 0.3,
        }}
        onLongPress={handlePress}
        delayLongPress={3000}
      />
    );
  }
}
