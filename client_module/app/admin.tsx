import React, { useEffect, useRef, useState } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  files: DocumentPicker.DocumentPickerResult;
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
  const STORAGE_KEY = "@app/reports";

  const [incidentData, setIncidentData] = useState<Incident[]>([]);
  const [filterLevel, setFilterLevel] = useState<Level>(Level.ALL);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selected, setSelected] = useState<(typeof incidentData)[0] | null>(
    null,
  );
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    const loadState = async () => {
      try {
        const storaged = await AsyncStorage.getItem(STORAGE_KEY);
        if (storaged) {
          const parsed: {
            type: string;
            description: string;
            urgencies: string;
            position: {
              latitude: number;
              longitude: number;
              timestamp: string;
            };
            file: DocumentPicker.DocumentPickerResult;
          }[] = JSON.parse(storaged);
          const converted = parsed.map<Incident>((prev, index) => ({
            id: `${index}`,
            level: nameToLevel(prev.urgencies),
            status: Status.PENDING,
            type: nameToType(prev.type),
            timestamp: new Date(prev.position.timestamp),
            description: prev.description,
            position: {
              latitude: prev.position.latitude,
              longitude: prev.position.longitude,
            },
            files: prev.file,
          }));

          setIncidentData(converted);
        }
      } catch (error) {
        console.error("Erro ao carregar estado:", error);
      }
    };
    loadState();
  }, []);

  const filtered = incidentData.filter(
    (inc) => filterLevel === Level.ALL || inc.level === filterLevel,
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
                  (ic) => level === Level.ALL || ic.level === level,
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
                      ) : null,
                    )}
                  </>
                )}
              </DrawerBody>
              <DrawerFooter>
                <HStack space="sm">
                  {/* <Pressable className="flex-1 px-4 py-2 bg-blue-600 rounded-lg"> */}
                  {/*   <Text className="text-white text-center font-semibold"> */}
                  {/*     Chat */}
                  {/*   </Text> */}
                  {/* </Pressable> */}
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
