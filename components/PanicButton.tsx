import { ContextApiApp } from "@/hooks/contexAPI";
import { getPosition } from "@/utils/utils";
import { useContext } from "react";
import { Pressable, useWindowDimensions, Vibration } from "react-native";

export function PanicButton() {
  const dimensions = useWindowDimensions();
  const { width, height } = dimensions;
  const context = useContext(ContextApiApp);
  const handlePress = async () => {
    Vibration.vibrate([100, 100, 100, 100]);
    const position = await getPosition();
    context?.addReport({
      tipo: "Panic",
      descricao: "Urgente! Acionou o botão de pânico",
      urgencia: "Alta",
      posicao: position,
      arquivo: null,
    });
  };

  return (
    <Pressable
      style={{
        width: width,
        height: height * 0.3,
      }}
      onLongPress={handlePress}
      delayLongPress={3000}
    ></Pressable>
  );
}
