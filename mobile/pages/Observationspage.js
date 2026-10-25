import { useState } from "react";
import { Pressable, Text, View, ScrollView, Linking,Share } from "react-native";
import styles from "../styles";

export default function ObservationsPage({ recordings, onBack }) {
  const [selectedRecording, setSelectedRecording] = useState(null);

  const handleShare = async () => {
    if (!selectedRecording) { return;}
    const lines = selectedRecording.results.map((result) => `${result.common_name} (${(Number(result.confidence) * 100).toFixed(1)}%)`);
    const date = new Date(selectedRecording.created_at).toLocaleDateString("de-DE");
    const message = `I identified these bird on ${date} in ${selectedRecording.location}:\n${lines.join("\n")}`;
    await Share.share({ message });
  };

  return (
    <View style={styles.recordingScreen}>
      <Text style={[styles.title, { color: "#050505" }]}>Observations</Text>
      <ScrollView style={styles.profileScroll} contentContainerStyle={styles.profileScrollContent} showsVerticalScrollIndicator={true}>
        {selectedRecording ? (
          <>
            <Text>
              Recording{" "}
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
                Back To Observations
              </Text>
            </Pressable>
            <Pressable style={styles.Primarybutton} onPress={handleShare}>
              <Text style={styles.PrimarybuttonText}>Share observation</Text>
            </Pressable>
          </>
        ) : recordings.length === 0 ? (
          <Text>no observations</Text>
        ) : (
          recordings.map((recording) => (
            <Pressable key={recording.id} style={[styles.Primarybutton, { minWidth: 300 }]} onPress={() => setSelectedRecording(recording)}>
              <Text style={styles.observationTitle}>
                Recording{" "}
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