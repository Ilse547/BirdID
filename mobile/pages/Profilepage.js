import { useState } from "react";
import { Pressable, Text, View, ScrollView, Linking} from "react-native";
import styles from "../styles";

export default function ProfilePage({ username, recordings, onBack }) {
  const [selectedRecording, setSelectedRecording] = useState(null);
  return (
    <View style={styles.recordingScreen}>
      <Text style={[styles.title, {color:"#050505"}]}>Hello {username} !</Text>
    </View>
  );
}