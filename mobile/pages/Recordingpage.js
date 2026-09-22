import { Pressable, Text, View } from "react-native";
import styles from "../styles";
import useBirdRecording from "../hooks/useBirdRecording";

export default function Recordingpage({ onBack }) {
  const {
    isRecording,
    durationMillis,
    recordingUri,
    error,
    startRecording,
    stopRecording
  } = useBirdRecording();
  const totalSeconds = Math.floor((durationMillis || 0) / 1000);
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  const handleBack = async () => {
    if (isRecording) {
      await stopRecording();
    }
    onBack;
  };

  return (
    <View style={styles.recordingScreen}>
      <Text style={styles.screenTitle}>Recording</Text>
        <Text style={styles.recordingStatus}>
          {isRecording
            ? "Recording..."
            : recordingUri
              ? "Recording saved"
              : "Ready to record"}
        </Text>
        <Text style={styles.recordingTimer}>
          {minutes}:{seconds}
        </Text>

        {isRecording ? (
        <Pressable style={styles.stopButton} onPress={stopRecording} >
          <Text style={styles.stopButtonText}>
            Stop recording
          </Text>
        </Pressable>
      ) : (
        <Pressable style={styles.recordButton} onPress={startRecording} >
          <Text style={styles.recordButtonText}>
            Start recording
          </Text>
        </Pressable>
      )}
      {error && (
        <Text style={styles.recordingError}>
          {error}
        </Text>
      )}
      {recordingUri && !isRecording && (
        <Text numberOfLines={3}>
          {recordingUri}
        </Text>
      )}
      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
    </View>
  );
}