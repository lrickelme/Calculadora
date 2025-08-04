import React, { useContext, useEffect, useRef, useState } from "react";
import MapView, { Marker, Region } from "react-native-maps";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { FlatList } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@/components/ui/drawer";
import { Image } from "@/components/ui/image";
import { Heading } from "@/components/ui/heading";
import { ContextApiApp } from "@/hooks/contexAPI";

const API_URL = "http://10.12.130.72:1337";

enum Level {
  ALL = "Todos",
  CRITICAL = "Crítica",
  HIGH = "Alta",
  MEDIUM = "Média",
  LOW = "Baixa",
}

enum Status {
  PENDING = "Aguardando Resposta",
  SENT = "Instruções Enviadas",
}

type Incident = {
  id: string;
  level: Level;
  status: Status;
  type: string;
  timestamp: Date;
  description: string;
  position: {
    latitude: number;
    longitude: number;
  };
  files: {
    assets: Array<{
      uri: string;
      name?: string;
      mimeType?: string;
    }>;
    canceled: boolean;
  };
};

function nameToType(name: string) {
  switch (name.trim().toLowerCase()) {
    case "fisica":
      return "Violência física";
    case "assedio-moral":
      return "Assédio moral";
    case "assedio-sexual":
      return "Assédio sexual";
    case "negligencia":
      return "Negligência";
    default:
      return "Outro";
  }
}

function nameToLevel(name: string) {
  switch (name.trim().toLowerCase()) {
    case "critica":
      return Level.CRITICAL;
    case "alta":
      return Level.HIGH;
    case "media":
      return Level.MEDIUM;
    case "baixa":
      return Level.LOW;
    default:
      throw new Error("Level não existe");
  }
}

export default function AdminDashboard() {
  const context = useContext(ContextApiApp);
  const [incidentData, setIncidentData] = useState<Incident[]>([]);
  const [filterLevel, setFilterLevel] = useState<Level>(Level.ALL);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selected, setSelected] = useState<(typeof incidentData)[0] | null>(
    null
  );
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    const loadReports = async () => {
      if (context) {
        await context.fetchReports();
      }
    };
    loadReports();
  }, [context]);

  useEffect(() => {
    if (context?.reports) {
      const converted = context.reports.map<Incident>((report, index) => ({
        id: report.id || `${index}`,
        level: nameToLevel(report.attributes.urgency),
        status: report.attributes.denunciation_status as Status,
        type: report.attributes.type,
        timestamp: new Date(report.attributes.report_time),
        description: report.attributes.description,
        position: {
          latitude: report.attributes.position?.coordinates[1] || 0,
          longitude: report.attributes.position?.coordinates[0] || 0,
        },
        files: {
          assets:
            report.attributes.files?.data?.map((file) => ({
              uri: `${API_URL}${file.attributes.url}`,
              name: file.attributes.name,
              mimeType: file.attributes.mime,
            })) || [],
          canceled: false,
        },
      }));
      setIncidentData(converted);
    }
  }, [context?.reports]);

  const filtered = incidentData.filter(
    (inc) => filterLevel === Level.ALL || inc.level === filterLevel
  );

  const focusOn = (lat: number, lon: number) => {
    const region: Region = {
      latitude: lat,
      longitude: lon,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    mapRef.current?.animateToRegion(region);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Text className="text-3xl font-bold ml-4 mb-2">Denúncias</Text>

      <Box className="mx-4 h-52 rounded-2xl overflow-hidden">
        {incidentData.length > 0 && (
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: incidentData[0].position.latitude,
              longitude: incidentData[0].position.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            ref={mapRef}
          >
            {incidentData.map((inc) => (
              <Marker
                key={inc.id}
                coordinate={{
                  latitude: inc.position.latitude,
                  longitude: inc.position.longitude,
                }}
                pinColor={"red"}
                onPress={() => {
                  setShowDrawer(true);
                  setSelected(inc);
                }}
              />
            ))}
          </MapView>
        )}
      </Box>

      <HStack space="sm" className="flex-row space-x-2 my-2 mx-4">
        {Object.values(Level).map((level) => (
          <Pressable
            key={level}
            className={`px-3 py-1 rounded-full border ${
              filterLevel === level
                ? "bg-black border-black"
                : "bg-transparent border-gray-300"
            }`}
            onPress={() => setFilterLevel(level)}
          >
            <Text
              className={`${
                filterLevel === level ? "text-white" : "text-black"
              } text-sm`}
            >
              {level} (
              {
                incidentData.filter(
                  (ic) => level === Level.ALL || ic.level === level
                ).length
              }
              )
            </Text>
          </Pressable>
        ))}
      </HStack>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              if (selected === item) {
                setShowDrawer(true);
              }
              setSelected(item);
              focusOn(item.position.latitude, item.position.longitude);
            }}
          >
            <HStack className="flex-row items-center p-3 mx-4 mb-2 bg-gray-100 rounded-xl">
              <Box
                className="w-3 h-3 mr-3 rounded-full"
                style={{ backgroundColor: "red" }}
              />
              <Box className="flex-1 bg-transparent p-0">
                <Text className="font-bold">{item.status}</Text>
                <Text>{item.description}</Text>
                <Text className="text-xs text-gray-600 mt-1">
                  {item.timestamp.toString()}
                </Text>
              </Box>
            </HStack>
          </Pressable>
        )}
      />
      <Drawer
        isOpen={showDrawer}
        size="lg"
        onClose={() => {
          setShowDrawer(false);
          setSelected(null);
        }}
        anchor="bottom"
      >
        <DrawerBackdrop />
        <DrawerContent>
          {selected && (
            <>
              <DrawerHeader>
                <Heading size="2xl">{selected.type}</Heading>
                <Text className="text-sm text-gray-500">
                  {selected.timestamp.toString()}
                </Text>
              </DrawerHeader>
              <DrawerBody>
                <Text className="mb-1 font-semibold">
                  Status: {selected.status}
                </Text>
                <Text className="font-semibold mr-2">
                  Nível de urgência: {selected.level}
                </Text>
                <Text className="mb-2">Descrição: {selected.description}</Text>
                {selected.files.assets && (
                  <>
                    <Text className="font-semibold mb-1">
                      Arquivos enviados:
                    </Text>

                    {selected.files.assets.map((file) =>
                      file ? (
                        <HStack key={file.name} className="items-center mb-2">
                          {file.uri && (
                            <Image
                              source={{ uri: file.uri }}
                              alt="Imagem não carregada."
                              style={{ width: 40, height: 40, borderRadius: 4 }}
                            />
                          )}
                          <Text className="ml-2">{file.name}</Text>
                        </HStack>
                      ) : null
                    )}
                  </>
                )}
              </DrawerBody>
              <DrawerFooter>
                <HStack space="sm">
                  <Pressable
                    className="flex-1 px-4 py-2 bg-gray-300 rounded-lg"
                    onPress={() => {
                      setShowDrawer(false);
                      setSelected(null);
                    }}
                  >
                    <Text className="text-center">Fechar</Text>
                  </Pressable>
                </HStack>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </SafeAreaView>
  );
}
