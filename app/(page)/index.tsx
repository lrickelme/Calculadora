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
} from "react-native";

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
    const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (result.assets && result.assets.length > 0) setArquivo(result);
    await Haptics.selectionAsync();
  };

  const handleSubmit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (tipo && descricao && urgencia) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      context?.addReport({
        tipo,
        descricao,
        urgencia,
        arquivo,
      });
      navigate.goBack();
    }
    if (!tipo) {
      setIsSelectValidTipo(false);
    }
    if (!urgencia) {
      setIsSelectValidUrgencia(false);
    }
    if (!descricao) {
      setIsTextValid(false);
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
    flex: 1, // ocupa toda a tela
    backgroundColor: "#000000", // Fundo preto :contentReference[oaicite:2]{index=2}
    alignItems: "center", // centraliza horizontalmente
    justifyContent: "center", // centraliza verticalmente
    padding: 16,
  },
  title: {
    fontSize: 36, // entre 32–40px
    fontWeight: "700", // Bold para ênfase
    color: "#FFFFFF", // Texto Claro
    marginBottom: 24,
  },
  formControl: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 16, // Corpo do texto
    fontWeight: "400",
    color: "#D4D4D2", // Texto neutro secundário
    marginBottom: 8,
  },
  select: {
    backgroundColor: "#000000", // Secundária
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#D4D4D2", // Texto neutro secundário
    fontSize: 16,
  },
  input: {
    backgroundColor: "#000000", // Secundária
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 12,
    color: "#ffff", // Texto Escuro
  },
  textArea: {
    minHeight: 50,
    textAlignVertical: "top",
  },
  uploadButton: {
    width: "100%",
    backgroundColor: "#505050", // Cinza Escuro
    borderRadius: 24, // Borda arredondada
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 16,
  },
  uploadButtonText: {
    fontSize: 16,
    color: "#FFFFFF", // Texto Claro
  },
  primaryButton: {
    width: "100%",
    backgroundColor: "#FF9500", // Primária
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    // sombra opcional
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Android
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
    paddingVertical: 0, // altura controlada pelo footer
    paddingHorizontal: 20,
    borderRadius: 24,
  },

  neutralButton: {
    backgroundColor: "#505050", // Cinza Escuro
  },
  neutralButtonText: {
    color: "#FFFFFF", // Texto Claro
    fontSize: 16,
    fontWeight: "600",
  },

  emergencyButton: {
    backgroundColor: "#FF9500", // Primária
  },
  emergencyButtonText: {
    color: "#FFFFFF", // Texto Claro
    fontSize: 16,
    fontWeight: "600",
  },
});
