import { useState } from "react";
import { Pressable, Text, View} from "react-native";
import styles from "../styles";

export default function ProfilePage({ username, recordings, onBack }) {
  const [selectedRecording, setSelectedRecording] = useState(null);
  return (
    <View style={styles.recordingScreen}>
      <Text style={styles.screenTitle}>{username} Profile</Text>

      {selectedRecording ? (
        <>
          <Text>
            Recording{" "}
            {new Date(selectedRecording.created_at).toLocaleDateString("de-DE")}
          </Text>
          <Text>{selectedRecording.location}</Text>
          {selectedRecording.results.map((result, index) => (
            <Text key={index}>
              {result.common_name} —{" "}
              {(Number(result.confidence) * 100).toFixed(1)}%
            </Text>
          ))}
          <Pressable style={styles.backButton} onPress={() => setSelectedRecording(null)}>
            <Text style={styles.backButtonText}>
              observations
            </Text>
          </Pressable>
        </>
      ) : recordings.length === 0 ? (
        <Text>no observations</Text>
      ) : (
        recordings.map((recording) => (
          <Pressable key={recording.id} style={styles.authButton} onPress={() => setSelectedRecording(recording)}>
            <Text style={styles.authButtonText}>
              Recording{" "}
              {new Date(recording.created_at).toLocaleDateString("de-DE")}
            </Text>
            <Text style={styles.authButtonText}>
              {recording.location}
            </Text>
          </Pressable>
        ))
      )}
      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
    </View>
  );
}