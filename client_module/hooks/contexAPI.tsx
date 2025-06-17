import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import { EncodingType, StorageAccessFramework } from "expo-file-system";
import React, { createContext, useEffect, useMemo, useState } from "react";

interface IPosition {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface IReport {
  type: string;
  description: string;
  urgencies: string;
  position: IPosition;
  file: DocumentPicker.DocumentPickerResult | null;
}

interface ContextApiProps {
  addReport: (report: IReport) => void;
}

export const ContextApiApp = createContext<ContextApiProps | undefined>(
  undefined,
);

export const ContexProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [reports, setReports] = useState<IReport[]>([]);
  const [directoryUri, setDirectoryUri] = useState<string | null>(null);
  const fileName = "reports.json";

  const requestDirectoryPermissions = async () => {
    const permissions =
      await StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (permissions.granted) {
      setDirectoryUri(permissions.directoryUri);
      await AsyncStorage.setItem("directoryUri", permissions.directoryUri);
      return permissions.directoryUri;
    } else {
      console.warn("Permissão de diretório negada.");
      return null;
    }
  };

  const getDirectoryUri = async () => {
    if (directoryUri) return directoryUri;
    const uri = await AsyncStorage.getItem("directoryUri");
    if (uri) {
      setDirectoryUri(uri);
      return uri;
    }
    return await requestDirectoryPermissions();
  };

  const saveState = async () => {
    try {
      const uri = await getDirectoryUri();
      if (!uri) return;

      const files = await StorageAccessFramework.readDirectoryAsync(uri);
      const existingFileUri = files.find((file) => file.endsWith(fileName));

      let fileUri = existingFileUri;

      if (!fileUri) {
        fileUri = await StorageAccessFramework.createFileAsync(
          uri,
          fileName,
          "application/json",
        );
      }

      await StorageAccessFramework.writeAsStringAsync(
        fileUri,
        JSON.stringify(reports),
        {
          encoding: EncodingType.UTF8,
        },
      );

      console.log("Arquivo salvo em:", fileUri);
    } catch (error) {
      console.error("Erro ao salvar arquivo:", error);
    }
  };

  const loadState = async () => {
    try {
      const uri = await getDirectoryUri();
      if (!uri) return;

      const files = await StorageAccessFramework.readDirectoryAsync(uri);
      const fileUri = files.find((file) => file.endsWith(fileName));

      if (fileUri) {
        const content = await StorageAccessFramework.readAsStringAsync(fileUri);

        const parsed = JSON.parse(content);

        setReports(parsed);
        console.log("Dados carregados:", parsed);
      } else {
        console.log("Nenhum arquivo encontrado, iniciando vazio.");
      }
    } catch (error) {
      console.error("Erro ao carregar arquivo:", error);
    }
  };

  useEffect(() => {
    loadState();
  }, []);

  useEffect(() => {
    if (reports.length > 0) {
      saveState();
    }
  }, [reports]);

  const addReport = (report: IReport) => {
    setReports((prevReports) => [...prevReports, report]);
  };

  const value = useMemo(
    () => ({
      addReport,
    }),
    [],
  );

  return (
    <ContextApiApp.Provider value={value}>{children}</ContextApiApp.Provider>
  );
};
