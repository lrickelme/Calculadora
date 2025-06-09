import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import React, { createContext, useEffect, useMemo } from "react";

interface IReport {
  tipo: string;
  descricao: string;
  urgencia: string;
  arquivo: DocumentPicker.DocumentPickerResult | null;
}

interface ContextApiProps {
  addReport: (report: IReport) => void;
}

export const ContextApiApp = createContext<ContextApiProps | undefined>(
  undefined
);

export const ContexProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [reports, setReports] = React.useState<IReport[]>([]);
  const STORAGE_KEY = "@app/reports";

  useEffect(() => {
    const loadState = async () => {
      try {
        const estadoSalvo = await AsyncStorage.getItem(STORAGE_KEY);
        if (estadoSalvo) {
          const parsed = JSON.parse(estadoSalvo);
          setReports(parsed);
        }
      } catch (error) {
        console.error("Erro ao carregar estado:", error);
      }
    };
    loadState();
  }, []);

  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
        const estadoSalvo = await AsyncStorage.getItem(STORAGE_KEY);
        console.log(estadoSalvo);
      } catch (error) {
        console.error("Erro ao salvar estado:", error);
      }
    };

    saveState();
  }, [reports]);

  const addReport = (report: IReport) => {
    setReports((prevReports) => [...prevReports, report]);
  };

  const value = useMemo(
    () => ({
      addReport,
    }),
    []
  );

  return (
    <ContextApiApp.Provider value={value}>{children}</ContextApiApp.Provider>
  );
};
