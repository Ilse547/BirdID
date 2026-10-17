import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  View,
  Pressable,
  Image
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import HelpScreen from "./pages/Helppage";
import RecordingPage from "./pages/Recordingpage";
import ResultPage from "./pages/ResultPage.js";
import styles from "./styles";
import LoginPage from "./pages/Loginpage";
import RegisterPage from "./pages/Registerpage";
import ProfilePage from "./pages/Profilepage";

import { NavigationBar } from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";

const API_URL = "http://192.168.178.66:3000";
const TOKEN_KEY = "birdid_token";

export default function App() {
  const [message, setMessage] = useState("Hello World");
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [screen, setScreen] = useState("home");
  const [birdnetResults, setBirdnetResults] = useState([]);
  const [autoStartRecording, setAutoStartRecording] = useState(false);

  const [authScreen, setAuthScreen] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [token, setToken] = useState(null);
  const [authMessage, setAuthMessage] = useState("");
  const [profileRecordings, setProfileRecordings] = useState([]);
  const [profileUsername, setProfileUsername] = useState("Profile");
  const [authReady, setAuthReady] = useState(false);

  const handleLogin = async () => {
    try{
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({email, password})
      });
      const data = await response.json();
      if(!response.ok) {
        throw new Error(data.error);
      }
      await AsyncStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setAuthScreen(null);
    } catch(error) {
      setAuthMessage(error.message);
    }
  };
  const handleRegister = async () => {
    if (!username || !email || !password) {
      setAuthMessage("all fields must be complete");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setAuthMessage("emial format is invalid");
      return;
    }
    if (password.length < 8) {
      setAuthMessage("password needs to be at least 8 characters long");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type" : "application/json"},
        body: JSON.stringify({username, email, password })
      });
      const data = await response.json();
      if(!response.ok) {
        throw new Error(data.error);
      }
      setAuthMessage("registration successful");
      setAuthScreen("login");
    } catch (error) {
      setAuthMessage(error.message);
    }
  };

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

  useEffect(() => {
    if (screen !== "profile" || !token) {
      return;
    }
    fetch(`${API_URL}/recording/me`, {
      headers: { Authorization: `Bearer ${token}`}
    })
    .then((response) => response.json())
    .then((data) => {
      setProfileRecordings(data.recordings || []);
    })
    .catch((error) => {
      console.error(error);
    });
  }, [screen, token]);

  useEffect(() => {
    const restoreLogin = async () => {
      try {
        const savedToken = await AsyncStorage.getItem(TOKEN_KEY);
        if (savedToken) {
          setToken(savedToken);
          setAuthScreen(null);
        }
      } catch (error) {
        console.error("not able to restore login", error);
      } finally {
        setAuthReady(true);
      }
    };
    restoreLogin();
  }, []);

  if (!authReady) {
  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator size="large" />
    </SafeAreaView>
  );
}

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
            {authScreen === "login" ? (
              <LoginPage message={authMessage} onLogin={{setEmail, setPassword, submit: handleLogin }} onRegister={() => setAuthScreen("register")}/>
            ) : authScreen === "register" ? (
              <RegisterPage message={authMessage} onRegister={{ setUsername, setEmail, setPassword, submit: handleRegister }} onBack={() => setAuthScreen("login")} />
            ) : activeTab === "help" ? (
              <HelpScreen/>
            ) : screen === "profile" ? (
              <ProfilePage username={profileUsername} recordings={profileRecordings} onBack={() => setScreen("home")}/>
            ) : screen === "results" ? (
              <ResultPage results={birdnetResults} onBack={() => setScreen("recording")} />
            ) : screen === "recording" ? (
              <RecordingPage
                token={token}
                autoStart={autoStartRecording}
                onResults={(results) => {
                  setAutoStartRecording(false);
                  setBirdnetResults(results);
                  setScreen("results");
                }}
                onBack={() => {
                  setAutoStartRecording(false);
                  setActiveTab(null);
                  setScreen("home");
                }}
              />
            ) : (
              <Text>Home Screen</Text>
            )}
          </View>
        </View>
      <View style={styles.bottomBar}>
        <Pressable
          onPress={() => {setAutoStartRecording(true); setScreen("recording"); }}
          style={({ pressed }) => [
            styles.bottomButton,
            pressed && styles.bottomButtonPressed
          ]}
        >
          <Text style={styles.bottomButtonIcon}>🎙</Text>
        </Pressable>
        <Pressable onPress={() => setScreen("profile")} style={styles.profileBottomButton} >
          <Text style={styles.profileBottomButtonText}>P</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
