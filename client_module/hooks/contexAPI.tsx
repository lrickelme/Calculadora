import api from "@/services/api";
import * as DocumentPicker from "expo-document-picker";
import React, { createContext, useEffect, useMemo, useState } from "react";

interface IPosition {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface IFile {
  uri: string;
  name?: string;
  mimeType?: string;
}
interface IReportInput {
  type: string;
  description: string;
  urgency: string;
  position: {
    latitude: number;
    longitude: number;
    timestamp?: number;
  };
  file: DocumentPicker.DocumentPickerResult | null;
}
interface IReport {
  id?: string;
  attributes: {
    type: string;
    description: string;
    urgency: string;
    denunciation_status: string;
    report_time: string;
    position?: {
      coordinates: [number, number];
    };
    files?: {
      data?: Array<{
        id: number;
        attributes: {
          url: string;
          name: string;
          mime: string;
          size: number;
        };
      }>;
    };
  };
}

interface ContextApiProps {
  addReport: (report: IReportInput) => Promise<void>;
  fetchReports: () => Promise<void>;
  reports: IReport[];
}

export const ContextApiApp = createContext<ContextApiProps | undefined>(
  undefined
);

export const ContexProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [reports, setReports] = useState<IReport[]>([]);

  const addReport = async (report: IReportInput) => {
    try {
      const formData = new FormData();
      const reportData = {
        data: {
          type: report.type,
          description: report.description,
          urgency: report.urgency,
          position: {
            type: "Point",
            coordinates: [report.position.longitude, report.position.latitude],
          },
        },
      };

      formData.append("data", JSON.stringify(reportData.data));

      if (report.file && !report.file.canceled && report.file.assets) {
        report.file.assets.forEach((asset) => {
          formData.append("files.files", {
            uri: asset.uri,
            name: asset.name || "file",
            type: asset.mimeType || "application/octet-stream",
          } as any);
        });
      }

      console.log("Enviando dados:", {
        type: report.type,
        description: report.description,
        urgency: report.urgency,
        position: report.position,
      });
      console.log("Ta vindo aqui");

    } catch (error) {
      console.error("Erro detalhado:", {
        request: error.config?.data,
        response: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  };

  const fetchReports = async () => {
    try {
      const response = await api.get("/api/reports", {
        params: {
          populate: "*",
          sort: "report_time:desc",
        },
      });
      setReports(response.data.data);
    } catch (error) {
      console.error("Erro ao buscar relatórios:", error);
    }
  };

  const value = useMemo(
    () => ({
      addReport,
      fetchReports,
      reports,
    }),
    [reports]
  );

  return (
    <ContextApiApp.Provider value={value}>{children}</ContextApiApp.Provider>
  );
};
