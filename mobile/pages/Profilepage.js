import { useState } from "react";
import { Pressable, Text, View, ScrollView, Linking} from "react-native";
import styles from "../styles";

export default function ProfilePage({ username, recordings, onBack, onLogout}) {
  const allResults = recordings.flatMap((recording) => recording.results);
  const totalObservations = recordings.length;
  const uniqueBirds = new Set(allResults.map((result) => result.common_name)).size;
  const birdCounts = {};
  allResults.forEach((result) => {
    birdCounts[result.common_name] = (birdCounts[result.common_name] || 0) + 1;
  });
  const topBirds = Object.entries(birdCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  return (
    <View style={styles.recordingScreen}>
      <Text style={[styles.title, {color:"#050505"}]}>Hello {username} !</Text>
      <View style={{ alignItems: "center", marginBottom: 12 }}>
      <Text>observations: {totalObservations}</Text>
      <Text>Bird species identifiied: {uniqueBirds}</Text>
      <Text>Top 3 most identified birds:</Text>
      {topBirds.map(([name, count]) => (
        <Text key={name}>{name} ({count}x)</Text>
      ))}
      <Pressable style={[styles.Secondarybutton, {backgroundColor:"red", marginTop:"20"}]} onPress={onLogout}>
        <Text style={styles.SecondarybuttonText}>logout</Text>
      </Pressable>
    </View>
    </View>
  );
}