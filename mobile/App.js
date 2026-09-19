import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  View,
  Pressable,
  Image
} from "react-native";

import styles from "./styles";

import { NavigationBar } from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";

const API_URL = "http://192.168.178.66:3000";

export default function App() {
  const [message, setMessage] = useState("Hello World");
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    NavigationBar.setHidden(true);
    
    fetch(`${API_URL}/`)
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
        setConnected(true);
      })
      .catch(() => {
        setMessage("Hello World (backend not reachable)");
        setConnected(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden/>

    <View style={styles.content}>
      <View style={styles.header}>

        <View style={styles.headerLeft}>
          <Image source={require("./assets/icon.png")} style={styles.appIcon}/>
          <Text style={styles.headerTitle}>Bird ID</Text>
        </View>

        <Pressable
          onPress={() =>
          setActiveTab(activeTab === "help" ? "home" : "help")
        }
        style={({ pressed }) => [ styles.helpButton,pressed && styles.helpButtonPressed]}>
        <Text style={styles.helpButtonText}>
          {activeTab === "help" ? "Back" : "Help"}
        </Text>
      </Pressable>
      
      </View>
      <View style={styles.mainContent}>
        <Text style={styles.test}>Test</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#f4b942" />
        ) : (
          <Text style={connected ? styles.messageOk : styles.messageError}>
            {message}
          </Text>
        )}
      </View>
    </View>

      <View style={styles.bottomBar}>
        <Pressable
          onPress={() => setActiveTab("home")}
          style={({ pressed }) => [
            styles.bottomButton,
            pressed && styles.bottomButtonPressed
          ]}
        >
          <Text style={styles.bottomButtonIcon}>🎙</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
