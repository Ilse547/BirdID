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
import FollowerPage from "./pages/Followerpage";
import ObservationsPage from "./pages/Observationspage";

import { NavigationBar } from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import { API_URL } from "./config";

const TOKEN_KEY = "birdid_token";
const USERNAME_KEY = "birdid_username";

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
      await AsyncStorage.setItem(USERNAME_KEY, data.user.username);
      setToken(data.token);
      setProfileUsername(data.user.username);
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
    if ((screen !== "profile" && screen !== "observations") || !token) {
      return;
    }
    fetch(`${API_URL}/recording/me`, {
      headers: { Authorization: `Bearer ${token}`}
    })
    .then(async (response) => {
      if (response.status === 403){
        await handleSessionExpired();
        return null;
      }
      return response.json();
    })
    .then((data) => {
      if (data) {
        setProfileRecordings(data.recordings || []);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }, [screen, token]);

  useEffect(() => {
    const restoreLogin = async () => {
      try {
        const savedToken = await AsyncStorage.getItem(TOKEN_KEY);
        const savedUsername = await AsyncStorage.getItem(USERNAME_KEY);
        if (savedToken) {
          setToken(savedToken);
          setProfileUsername(savedUsername || "Profile");
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

  const handleSessionExpired = async () => {
    await AsyncStorage.multiRemove([
      TOKEN_KEY,
      USERNAME_KEY
    ]);
    setToken(null);
    setProfileUsername("Profile");
    setScreen("home");
    setActiveTab(null);
    setAuthMessage("your session expired, please log in");
    setAuthScreen("login");
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove([TOKEN_KEY, USERNAME_KEY]);
    setToken(null);
    setProfileUsername("Profile");
    setProfileRecordings([]);
    setScreen("home");
    setActiveTab(null);
    setAuthMessage("");
    setAuthScreen("login");
  };

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

        <Pressable onPress={() => {setActiveTab(null); setScreen("observations");}} style={({ pressed }) => [ styles.Secondarybutton,pressed && styles.SecondarybuttonPressed]}>
        <Text style={styles.SecondarybuttonText}>
          Observations
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
            ) : screen === "followers" ? (
              <FollowerPage token={token} onSessionExpired={handleSessionExpired}/>
            ) : screen === "observations" ? (
              <ObservationsPage recordings={profileRecordings} onBack={() => setScreen("home")} />
            ) : screen === "profile" ? (
              <ProfilePage username={profileUsername} recordings={profileRecordings} onBack={() => setScreen("home")} onLogout={handleLogout}/>
            ) : screen === "results" ? (
              <ResultPage results={birdnetResults} onBack={() => setScreen("recording")} />
            ) : screen === "recording" ? (
              <RecordingPage
                token={token}
                autoStart={autoStartRecording}
                onSessionExpired={handleSessionExpired}
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
              <Text>
                Welcome to BirdID
              </Text>
            )}
          </View>
        </View>
      <View style={styles.bottomBar}>
        <Pressable onPress={() => {setActiveTab(null); setScreen("home");}} style={[ styles.BottomBarbutton, { left: 75 }]}>
          <Text style={styles.BottomBarbuttonText}>
            🏠
          </Text>
        </Pressable>
        <Pressable onPress={() => {setActiveTab("help"); setScreen("home"); }} style={[styles.BottomBarbutton, { left: 20 }]}>
          <Text style={styles.BottomBarbuttonText}>
            ❓
          </Text>
        </Pressable>
        <Pressable onPress={() => {setActiveTab(null); setScreen("followers");}} style={[styles.BottomBarbutton, { right: 80 }]}>
          <Text style={styles.BottomBarbuttonText}>
            👥
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {setActiveTab(null); setAutoStartRecording(true); setScreen("recording"); }}
          style={({ pressed }) => [styles.bottomButton, pressed && styles.bottomButtonPressed]}>
          <Text style={styles.bottomButtonIcon}>🎙</Text>
        </Pressable>
        <Pressable onPress={() => {setActiveTab(null); setScreen("profile");}} style={[styles.BottomBarbutton, { right: 20 }]}>
          <Text style={styles.BottomBarbuttonText}>👤</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
