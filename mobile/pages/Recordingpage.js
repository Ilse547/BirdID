import { Pressable, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus} from "expo-audio";
import { fetch as expoFetch } from "expo/fetch";
import { File } from "expo-file-system";

import styles from "../styles";
import useBirdRecording from "../hooks/useBirdRecording";
const API_URL = "http://192.168.178.66:3000";

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
  const player = useAudioPlayer();
  const playerStatus = useAudioPlayerStatus(player);
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    if(recordingUri) {
      player.replace({ uri : recordingUri});
    }
  }, [recordingUri, player]);

  const handleBack = async () => {
    if (isRecording) {
      await stopRecording();
    }
    onBack;
  };


  const handlePlayPause = async () => {
  if (!recordingUri) {
    return;
  }

  await setAudioModeAsync({
    allowsRecording: false,
    playsInSilentMode: true
  });

  if (playerStatus.playing) {
    player.pause();
  } else {
    player.play();
  }
};

const handleReplay = () => {
  player.seekTo(0);
  player.play();
};
  

const handleUpload = async () => {
  if(!recordingUri) {
    return;
  }
  try {
    setUploadMessage("upllading");
    const file = new File(recordingUri);
    const formData = new FormData();
    formData.append("audio", file);
    const response = await expoFetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    if(!response.ok) {
      throw new Error(data.error || "upload failed");
    }
    console.log(data);
    setUploadMessage("Upload successfuk");
  } catch(uploadError) {
    console.error(uploadError);
    setUploadMessage("Upload failed");
  }
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
      {recordingUri && !isRecording && (
        <>
          <Pressable style={styles.playButton} onPress={handlePlayPause} >
            <Text style={styles.playButtonText}>
              {playerStatus.playing
                ? "Pause recording"
                : "Play recording"}
            </Text>
          </Pressable>

          <Pressable style={styles.replayButton} onPress={handleReplay}>
            <Text style={styles.replayButtonText}> Replay from beginning</Text>
          </Pressable>

          <Pressable style={styles.recordButton} onPress={handleUpload}>
            <Text style={styles.recordButtonText}> Uploaad recording </Text>
          </Pressable>
          {uploadMessage !== "" && (
            <Text >{uploadMessage}</Text>
          )}
        </>
      )}
      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
    </View>
  );
}