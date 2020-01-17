import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import {
  requestPermissionsAsync,
  getCurrentPositionAsync
} from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import api from "../services/api";

export default function Main({ navigation }) {
  const [devs, setDevs] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(null);
  useEffect(() => {
    const loadPosition = async () => {
      const { granted } = await requestPermissionsAsync();
      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true
        });
        const { latitude, longitude } = coords;
        console.log(latitude, longitude);
        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04
        });
      }
    };
    loadPosition();
  }, []);
  const loadDevs = async () => {
    const { latitude, longitude } = currentRegion;
    const response = await api.get("/search", {
      params: {
        latitude,
        longitude,
        techs: "ReactJS"
      }
    });
    setDevs(response.data.devs);
  };
  if (!currentRegion) return null;
  return (
    <>
      <MapView style={styles.map} initialRegion={currentRegion}>
        <Marker coordinate={{ longitude: -51.1850782, latitude: -23.3328124 }}>
          <Image
            style={styles.avatar}
            source={{
              uri: "https://avatars3.githubusercontent.com/u/8019111?v=4"
            }}
          />
          <Callout
            onPress={() => {
              navigation.navigate("Profile", { github_username: "diogocezar" });
            }}
          >
            <View style={styles.callout}>
              <Text style={styles.devName}>Diogo Cezar Teixeira Batista</Text>
              <Text style={styles.devBio}>
                Just a guy that knows that knows nothing. Full Stack Web
                Developer, Teacher and Web Dinosaur.
              </Text>
              <Text style={styles.devTechs}>Node.js, ReactJS</Text>
            </View>
          </Callout>
        </Marker>
      </MapView>
      <View style={styles.searchForm}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar devs por techs..."
          placeholderTextColor="#999"
          autoCapitalize="words"
          autoCorrect={false}
        />
        <TouchableOpacity onPress={() => {}} style={styles.loadButton}>
          <MaterialIcons name="my-location" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 4,
    borderWidth: 4,
    borderColor: "#7D40E7"
  },
  callout: {
    width: 260
  },
  devName: {
    fontWeight: "bold",
    fontSize: 16
  },
  devBio: {
    color: "#666",
    marginTop: 5
  },
  devTechs: {
    marginTop: 5
  },
  searchForm: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    zIndex: 5,
    flexDirection: "row"
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: "#fff",
    color: "#333",
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 4, height: 4 },
    elevation: 2
  },
  loadButton: {
    width: 50,
    height: 50,
    backgroundColor: "#8E4DFF",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15
  }
});
