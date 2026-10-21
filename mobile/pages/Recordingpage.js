import { Pressable, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus} from "expo-audio";
import { fetch as expoFetch } from "expo/fetch";
import { File } from "expo-file-system";
import { API_URL } from "../config";
import styles from "../styles";
import useBirdRecording from "../hooks/useBirdRecording";
export default function Recordingpage({ onBack, onResults, autoStart, token,onSessionExpired}) {
  const {
    isRecording,
    durationMillis,
    recordingUri,
    error,
    startRecording,
    stopRecording,
    location
  } = useBirdRecording();
  const totalSeconds = Math.floor((durationMillis || 0) / 1000);
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  const player = useAudioPlayer();
  const playerStatus = useAudioPlayerStatus(player);
  const [uploadMessage, setUploadMessage] = useState("");
  const [birdnetResults, setBirdnetResults] = useState([]);

  useEffect(() => {
    if(recordingUri) {
      player.replace({ uri : recordingUri});
    }
  }, [recordingUri, player]);
  useEffect(() => {
  if (autoStart) {
    startRecording();
  }
}, [autoStart]);

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
    setUploadMessage("uploading");
    const file = new File(recordingUri);
    const formData = new FormData();
    formData.append("audio", file);
    if (location) {
      console.log("Location being uploaded:", location);
      formData.append("latitude", String(location.latitude));
      formData.append("longitude", String(location.longitude));
      if (location.region) {
        formData.append("region", location.region);
      }
    }
    const response = await expoFetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`},
      body: formData
    });
    if (response.status === 403) {
      await onSessionExpired();
      return;
    }
    const data = await response.json();
    if(!response.ok) {
      throw new Error(data.error || "upload failed");
    }
    console.log(data);
    setBirdnetResults(data.results);
    onResults(data.results);
    setUploadMessage("Upload successfuk");
  } catch(uploadError) {
    console.error(uploadError);
    setUploadMessage("Upload failed");
  }
};
  return (
    <View style={styles.recordingScreen}>
      <Text style={styles.title}>Recording</Text>
        <Text style={styles.title2}>
          {isRecording
            ? "Recording..."
            : recordingUri
              ? "Recording Saved"
              : "Ready To Record"}
        </Text>
        <Text style={[styles.title2, {fontSize: 20}]}>
          {minutes}:{seconds}
        </Text>
        {isRecording && (
        <Pressable style={[styles.Primarybutton, {width: 250}]} onPress={stopRecording}>
          <Text style={styles.PrimarybuttonText}>
            Stop recording
          </Text>
        </Pressable>
      )}
      {error && (
        <Text style={styles.recordingError}>
          {error}
        </Text>
      )}
      {recordingUri && !isRecording && (
        <>
          <Pressable style={[styles.Primarybutton, {width: 250}]} onPress={handlePlayPause} >
            <Text style={styles.PrimarybuttonText}>
              {playerStatus.playing
                ? "Pause recording"
                : "Play recording"}
            </Text>
          </Pressable>

          <Pressable style={[styles.Primarybutton, {width: 250}]} onPress={handleReplay}>
            <Text style={styles.PrimarybuttonText}> Replay from beginning</Text>
          </Pressable>

          <Pressable style={[styles.Primarybutton, {width: 250}]} onPress={handleUpload}>
            <Text style={styles.PrimarybuttonText}> Upload recording </Text>
          </Pressable>
          {uploadMessage !== "" && (
            <Text >{uploadMessage}</Text>
          )}
          {birdnetResults.length > 0 && (
            <View style={styles.birdnetResults}>
              {birdnetResults.map((result, index) => (
                <Text key={index}>
                  {result[3]} — {(Number(result[6]) * 100).toFixed(1)}%
                </Text>
              ))}
            </View>
          )}
        </>
      )}
      <Pressable style={styles.Secondarybutton} onPress={onBack}>
        <Text style={styles.SecondarybuttonText}>Back</Text>
      </Pressable>
    </View>
  );
}