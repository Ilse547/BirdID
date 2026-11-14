import { useState } from "react";
import { Pressable, Text, View, ScrollView, Linking} from "react-native";
import styles from "../styles";

export default function ProfilePage({ username, recordings, onBack, onLogout, isOwnProfile = true, onViewObservations, stats}) {
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
    const shownStats = stats
    ? {
        total: stats.total_observations,
        unique: stats.unique_birds,
        top: stats.top_birds.map((bird) => [bird.common_name, bird.sightings])
      }
    : { total: totalObservations, unique: uniqueBirds, top: topBirds };
  return (
    <View style={styles.recordingScreen}>
      <Text style={[styles.title, {color:"#050505"}]}>{isOwnProfile ? `Hello ${username} !` : `${username}'s profile`}</Text>
      <View style={{ alignItems: "center", marginBottom: 12 }}>
      <Text>observations: {shownStats.total}</Text>
      <Text>Bird species identifiied: {shownStats.unique}</Text>
      <Text>Top 5 most identified birds:</Text>
      {shownStats.top.map(([name, count]) => (
        <Text key={name}>{name} ({count}x)</Text>
      ))}
      {!isOwnProfile && (<Pressable style={styles.Primarybutton} onPress={onViewObservations}>
        <Text style={styles.PrimarybuttonText}>view observations</Text>
      </Pressable>)}
      {isOwnProfile && (<Pressable style={[styles.Secondarybutton, {backgroundColor:"red", marginTop:"20"}]} onPress={onLogout}>
        <Text style={styles.SecondarybuttonText}>logout</Text>
      </Pressable>)}
    </View>
    </View>
  );
}