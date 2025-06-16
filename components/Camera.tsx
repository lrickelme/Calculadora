import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export function CameraArea() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [hasAudioPermission, setHasAudioPermission] = useState(false);
  const cameraRef = useRef<CameraType>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  if (!cameraPermission?.granted) {
    return (
      <View style={styles.centered}>
        <Text>Precisamos de permissão para usar a câmera</Text>
        <Button onPress={requestCameraPermission} title="Conceder permissão" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.invisible}
        onCameraReady={() => setCameraReady(true)}
      />
      <View style={styles.controls}>
        <Button
          title={isRecording ? "Gravando…" : "Iniciar gravação 2min"}
          onPress={() => {}}
          disabled={!cameraReady || isRecording}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  invisible: { width: 0, height: 0 },
  controls: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
