import * as Location from "expo-location";

export async function getPosition() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status === "granted") {
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
