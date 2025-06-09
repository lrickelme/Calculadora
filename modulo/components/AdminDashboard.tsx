import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

enum Level {
  ALL = "Todos",
  CRITICAL = "Críticos",
  HIGH = "Altos",
  MEDIUM = "Médios",
}

const incidentData = [
  {
    id: "1",
    level: Level.CRITICAL,
    status: "Aguardando Resposta",
    description: "Vítima",
    location: "João Pessoa",
    timestamp: "há 2 minutos",
    color: "red",
    latitude: -7.11532,
    longitude: -34.861,
  },
  {
    id: "2",
    level: Level.MEDIUM,
    status: "Instruções Enviadas",
    description: "Vítima",
    location: "Campina Grande",
    timestamp: "há 8 minutos",
    color: "orange",
    latitude: -7.2307,
    longitude: -35.8811,
  },
  {
    id: "3",
    level: Level.CRITICAL,
    status: "Aguardando Resposta",
    description: "Vítima",
    location: "Patos",
    timestamp: "há 5 minutos",
    color: "red",
    latitude: -7.0179,
    longitude: -37.2743,
  },
];

export default function AdminDashboard() {
  const [filterLevel, setFilterLevel] = useState<Level>(Level.ALL);
  const mapRef = useRef<MapView>(null);

  const filteredIncidents = incidentData.filter(
    (incident) => filterLevel === Level.ALL || incident.level === filterLevel,
  );

  const handleFocusOnMap = (latitude: number, longitude: number) => {
    mapRef.current?.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Denúncias</Text>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: incidentData[0].latitude,
          longitude: incidentData[0].longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        ref={mapRef}
      >
        {incidentData.map((incident) => (
          <Marker
            key={incident.id}
            coordinate={{
              latitude: incident.latitude,
              longitude: incident.longitude,
            }}
            pinColor={incident.color}
          />
        ))}
      </MapView>

      <View style={styles.filterContainer}>
        {Object.values(Level).map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.filterButton,
              filterLevel === level && styles.activeFilter,
            ]}
            onPress={() => setFilterLevel(level)}
          >
            <Text
              style={
                filterLevel === level
                  ? styles.activeFilterText
                  : styles.filterText
              }
            >
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredIncidents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleFocusOnMap(item.latitude, item.longitude)}
          >
            <View style={styles.incidentCard}>
              <View style={[styles.dot, { backgroundColor: item.color }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.incidentTitle}>{item.status}</Text>
                <Text>{item.description}</Text>
                <Text style={styles.incidentMeta}>
                  {item.location} • {item.timestamp}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginLeft: 16,
    marginBottom: 8,
  },
  map: {
    height: 200,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  filterContainer: {
    flexDirection: "row",
    marginVertical: 8,
    marginHorizontal: 16,
  },
  filterButton: {
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  activeFilter: {
    backgroundColor: "#000",
  },
  filterText: {
    color: "#000",
  },
  activeFilterText: { color: "#fff" },
  incidentCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  dot: {
    width: 12,
    height: 12,
    marginRight: 12,
    borderRadius: "50%",
  },
  incidentTitle: {
    fontWeight: "bold",
  },
  incidentMeta: {
    color: "#666",
    fontSize: 12,
    marginTop: 2,
  },
});
