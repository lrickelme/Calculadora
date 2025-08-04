import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
} from "@/components/ui/form-control";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { ContextApiApp } from "@/hooks/contexAPI";
import { getPosition } from "@/utils/utils";
import * as DocumentPicker from "expo-document-picker";
import * as Haptics from "expo-haptics";
import { useNavigation } from "expo-router";
import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Platform,
  Alert,
} from "react-native";

const API_URL = "http://10.12.130.72:1337";

const position = {
  coords: {
    latitude: -22.9068,
    longitude: -43.1729,
    accuracy: 10,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
  },
  timestamp: Date.now(),
};

console.log("Usando posição fixa (modo teste):", position);

export default function Page() {
  const navigate = useNavigation();
  const [tipo, setTipo] = useState<string>("");
  const [descricao, setDescricao] = useState("");
  const [urgencia, setUrgencia] = useState<string>("");
  const [arquivo, setArquivo] =
    useState<DocumentPicker.DocumentPickerResult | null>(null);
  const { width, height } = useWindowDimensions();
  const [isTextValid, setIsTextValid] = useState(true);
  const [isSelectValidTipo, setIsSelectValidTipo] = useState(true);
  const [isSelectValidUrgencia, setIsSelectValidUrgencia] = useState(true);
  const context = useContext(ContextApiApp);

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      console.log("Arquivo selecionado:", result);
      if (result.assets && result.assets.length > 0) {
        setArquivo(result);
        await Haptics.selectionAsync();
      }
    } catch (error) {
      console.error("Erro ao selecionar arquivo:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      console.log("Iniciando envio do formulário...");

      if (!tipo || !descricao || !urgencia) {
        setIsSelectValidTipo(!!tipo);
        setIsSelectValidUrgencia(!!urgencia);
        setIsTextValid(!!descricao);
        Alert.alert("Erro", "Preencha todos os campos obrigatórios");
        return;
      }

      // para o strapi
      const reportData = {
        type: tipo,
        description: descricao,
        urgency: urgencia,
        position: position.coords
          ? {
              type: "Point",
              coordinates: [
                position.coords.longitude,
                position.coords.latitude,
              ],
            }
          : null,
        report_time: new Date().toISOString(),
        denunciation_status: "Aguardando Resposta",
      };

      const formData = JSON.stringify({
        data: {
          type: reportData.type,
          description: reportData.description,
          urgency: reportData.urgency,
        },
      });

      console.log(formData);

      console.log("Enviando dados para o servidor...");
      const response = await fetch(`${API_URL}/api/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: formData,
      });

      const data = await response.json();
      console.log("Resposta do servidor:", data);

      if (response.ok) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Sucesso", "Denúncia enviada com sucesso!");
        navigate.goBack();
      } else {
        console.error("Erro na resposta:", data);
        Alert.alert("Erro", data.error?.message || "Falha ao enviar denúncia");
      }
    } catch (error) {
      console.error("Erro no envio:", error);
      Alert.alert(
        "Erro",
        error.message || "Ocorreu um erro ao enviar a denúncia"
      );
    }
  };

  return (
    <View style={[styles.container, { width, height }]}>
      <Text style={styles.title}>Reportar Abuso</Text>

      <FormControl
        isDisabled={false}
        isReadOnly={false}
        isRequired={false}
        isInvalid={!isSelectValidTipo}
        style={styles.formControl}
      >
        <FormControlLabel>
          <Text style={styles.label}>Tipo de abuso</Text>
        </FormControlLabel>
        <Select isRequired selectedValue={tipo} onValueChange={setTipo}>
          <SelectTrigger variant="underlined" size="md">
            <SelectInput placeholder="Selecione" style={{ color: "#fff" }} />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent style={styles.select}>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              <SelectItem label="Violência física" value="fisica" />
              <SelectItem label="Assédio moral" value="assedio-moral" />
              <SelectItem label="Assédio sexual" value="assedio-sexual" />
              <SelectItem label="Negligência" value="negligencia" />
              <SelectItem label="Outro" value="outro" />
            </SelectContent>
          </SelectPortal>
        </Select>
        <FormControlError>
          <FormControlErrorIcon />
          <FormControlErrorText>Este campo é requerido</FormControlErrorText>
        </FormControlError>
      </FormControl>

      <FormControl
        isRequired
        style={styles.formControl}
        isInvalid={!isTextValid}
      >
        <FormControlLabel>
          <Text style={styles.label}>Descrição</Text>
        </FormControlLabel>
        <Textarea
          size="md"
          isReadOnly={false}
          isInvalid={false}
          isDisabled={false}
          style={[styles.textArea]}
          isRequired
        >
          <TextareaInput
            style={styles.input}
            placeholder="Your text goes here..."
            value={descricao}
            onChangeText={(el) => {
              setDescricao(el);
              setIsTextValid(true);
            }}
          />
        </Textarea>
        <FormControlError>
          <FormControlErrorIcon />
          <FormControlErrorText>Este campo é requerido</FormControlErrorText>
        </FormControlError>
      </FormControl>

      <FormControl
        isRequired
        style={styles.formControl}
        isInvalid={!isSelectValidUrgencia}
      >
        <FormControlLabel>
          <Text style={styles.label}>Nível de urgência</Text>
        </FormControlLabel>
        <Select
          selectedValue={urgencia}
          onValueChange={(el) => {
            setUrgencia(el);
            setIsSelectValidUrgencia(true);
          }}
        >
          <SelectTrigger variant="underlined" size="md">
            <SelectInput placeholder="Selecione" style={{ color: "#fff" }} />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent style={styles.select}>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              <SelectItem label="Baixa" value="baixa" />
              <SelectItem label="Média" value="media" />
              <SelectItem label="Alta" value="alta" />
              <SelectItem label="Crítica" value="critica" />
            </SelectContent>
          </SelectPortal>
        </Select>
        <FormControlError>
          <FormControlErrorIcon />
          <FormControlErrorText>Este campo é requerido</FormControlErrorText>
        </FormControlError>
      </FormControl>

      <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
        <Text style={styles.uploadButtonText}>
          {arquivo?.assets?.[0]?.name || "Anexar arquivos (opcional)"}
        </Text>
      </TouchableOpacity>

      <View style={[styles.footer, { width: width, height: height * 0.08 }]}>
        <View style={styles.box}>
          <TouchableOpacity
            style={[
              styles.buttonFooter,
              styles.neutralButton,
              { width: width / 2 - 16 },
            ]}
            onPress={() => navigate.goBack()}
          >
            <Text style={styles.neutralButtonText}>
              Voltar para calculadora
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.box}>
          <TouchableOpacity
            style={[
              styles.buttonFooter,
              styles.emergencyButton,
              { width: width / 2 - 16 },
            ]}
            onPress={handleSubmit}
          >
            <Text style={styles.emergencyButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 24,
  },
  formControl: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "400",
    color: "#D4D4D2",
    marginBottom: 8,
  },
  select: {
    backgroundColor: "#000000",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#D4D4D2",
    fontSize: 16,
  },
  input: {
    backgroundColor: "#000000",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 12,
    color: "#ffff",
  },
  textArea: {
    minHeight: 50,
    textAlignVertical: "top",
  },
  uploadButton: {
    width: "100%",
    backgroundColor: "#505050",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 16,
  },
  uploadButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  primaryButton: {
    width: "100%",
    backgroundColor: "#FF9500",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  footer: {
    marginTop: 100,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  buttonFooter: {
    flex: 1,
    marginHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 0,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  neutralButton: {
    backgroundColor: "#505050",
  },
  neutralButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  emergencyButton: {
    backgroundColor: "#FF9500",
  },
  emergencyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
