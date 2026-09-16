import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image
} from "react-native";

import { NavigationBar } from "expo-navigation-bar";

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
      <StatusBar barStyle="light-content" />

    <View style={styles.content}>
      <View style={styles.header}>
        <Image source={require("./assets/icon.png")} style={styles.appIcon}/>
        <Text style={styles.headerTitle}>Bird ID</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ebfaeb",
    width: "100%",
  },
  title: {
    color: "#ffffff",
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 24
  },
  messageOk: {
    color: "#4caf50",
    fontSize: 16,
    textAlign: "center"
  },
  messageError: {
    color: "#ff8a80",
    fontSize: 16,
    textAlign: "center"
  },
  test: {
    color: "#ffffff",
    fontSize: 20,
    textAlign: "center"
  },
  bottomBar: {
    width: "100%",
    height: 80,
    backgroundColor: "#ccffcc",
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center"
  },
  content: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24
  },
  bottomButton: {
    width: 120,
    height: 120 ,
    backgroundColor: "#ff3300",
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center"
  },
  bottomButtonPressed: {
    backgroundColor: "#ff8566"
  },
  bottomButtonIcon: {
    fontSize: 50,
    textAlign: "center",
    includeFontPadding: false
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 20,
    paddingBottom: 20
  },

  appIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 12
  },

  headerTitle: {
    color: "#000000",
    fontSize: 28,
    fontWeight: "800"
  },

  mainContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
