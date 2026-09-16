import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";

const API_URL = "http://192.168.178.66:3000";

export default function App() {
  const [message, setMessage] = useState("Hello World");
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
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
      <Text style={styles.title}>Bird ID</Text>
      <Text style={styles.test}>Test</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#f4b942" />
      ) : (
        <Text style={connected ? styles.messageOk : styles.messageError}>
          {message}
        </Text>
      )}
      </View>
      <View style={styles.bottomBar} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111116"
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
    backgroundColor: "#ffffff",
    alignSelf: "stretch"
  },
  content: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24
  },
});
