import { useState } from "react";
import { Pressable, Text, View, ScrollView, Linking } from "react-native";
import styles from "../styles";

export default function ExplorePage({ recordings, onBack }) {
  const [selectedRecording, setSelectedRecording] = useState(null);
  const birdCounts = {};
    recordings.forEach((recording) => {
    recording.results.forEach((result) => {
        birdCounts[result.common_name] = (birdCounts[result.common_name] || 0) + 1;
    });
    });
    const topBirds = Object.entries(birdCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <View style={styles.recordingScreen}>
      <Text style={[styles.title, { color: "#050505" }]}>Explore</Text>
      <View style={{ alignItems: "center", marginBottom: 12 }}>
        <Text>Top 5 birds (newest {recordings.length} observations):</Text>
        {topBirds.map(([name, count]) => (
            <Text key={name}>{name} ({count}x)</Text>
        ))}
    </View>
      <ScrollView style={styles.profileScroll} contentContainerStyle={styles.profileScrollContent} showsVerticalScrollIndicator={true}>
        {selectedRecording ? (
          <>
            <Text>
              {selectedRecording.username}{" "}
              {new Date(selectedRecording.created_at).toLocaleDateString("de-DE")}
            </Text>
            <Text>{selectedRecording.location}</Text>
            {selectedRecording.results.map((result, index) => (
              <View key={index} style={styles.birdResultRow}>
                <Pressable onPress={() => Linking.openURL(`https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(result.common_name)}`)}>
                  <Text style={styles.birdLink}>
                    {result.common_name}
                  </Text>
                </Pressable>
                <Text style={styles.birdConfidence}>
                  {" "} {(Number(result.confidence) * 100).toFixed(1)}%
                </Text>
              </View>
            ))}
            <Pressable style={styles.Secondarybutton} onPress={() => setSelectedRecording(null)}>
              <Text style={styles.SecondarybuttonText}>
                Back
              </Text>
            </Pressable>
          </>
        ) : recordings.length === 0 ? (
          <Text>no observations yet</Text>
        ) : (
          recordings.map((recording) => (
            <Pressable key={recording.id} style={[styles.Primarybutton, { minWidth: 300 }]} onPress={() => setSelectedRecording(recording)}>
              <Text style={styles.observationTitle}>
                {recording.username}{" "}
                {new Date(recording.created_at).toLocaleDateString("de-DE")}
              </Text>
              <Text style={styles.observationLocation}>
                📍{recording.location}
              </Text>
            </Pressable>
          ))
        )}
      </ScrollView>
      {!selectedRecording && (
        <Pressable style={styles.Secondarybutton} onPress={onBack}>
          <Text style={styles.SecondarybuttonText}>Back Home</Text>
        </Pressable>
      )}
    </View>
  );
}