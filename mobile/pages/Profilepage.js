import { useState } from "react";
import { Pressable, Text, View} from "react-native";
import styles from "../styles";

export default function ProfilePage({ username, recordings, onBack }) {
  const [selectedRecording, setSelectedRecording] = useState(null);
  return (
    <View style={styles.recordingScreen}>
      <Text style={styles.screenTitle}>{username} Profile</Text>
      <Text>obersation</Text>
      {recordings.length === 0 ? (
        <Text>you dont have any</Text>
      ) : (
        recordings.map((recording) => (
          <Pressable key={recording.id} onPress={() => setSelectedRecording(recording)} >
            <Text>
              Recording{" "}
              {new Date(recording.created_at).toLocaleDateString("de-DE")}
            </Text>
            <Text>{recording.location}</Text>
          </Pressable>
        ))
      )}
      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
    </View>
  );
}