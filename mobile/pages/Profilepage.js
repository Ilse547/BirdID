import { Pressable, Text, View } from "react-native";
import styles from "../styles";

export default function ProfilePage({ username, recordings, onBack }) {
  return (
    <View style={styles.recordingScreen}>
      <Text style={styles.screenTitle}>{username} Profile</Text>
      <Text>obersation</Text>
      {recordings.length === 0 ? (
        <Text>you dont have any</Text>
      ) : (
        recordings.map((recording, index) => (
          <Text key={index}>
            {recording.common_name} —{" "}
            {(Number(recording.confidence) * 100).toFixed(1)}%
          </Text>
        ))
      )}
      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
    </View>
  );
}