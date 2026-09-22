import { useState } from "react";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState
} from "expo-audio";

export default function useBirdRecording() {
    const audioRecorder = useAudioRecorder( {...RecordingPresets.HIGH_QUALITY, directory: "document"});
    const recorderState = useAudioRecorderState(audioRecorder);
    const [error, setError] = useState(null);
    const startRecording = async () => {
        try {
            setError(null);
            const permission = await AudioModule.requestRecordingPermissionsAsync();
            if(!permission.granted) {
                setError("Microphone permission declined");
                return false;
            }
            await setAudioModeAsync({
                allowsRecording: true,
                playsInSilentMode: true
            });
            await audioRecorder.prepareToRecordAsync();
            audioRecorder.record();
            return true;
        } catch (recordingError) {
            console.error(recordingError);
            setError("Could not start recording");
            return false;
        }
    };
    const stopRecording = async () => {
        try {
            if(!recorderState.isRecording) {
                return null;
            }
            await audioRecorder.stop();
            return audioRecorder.uri;
        } catch (recordingError) {
            console.error(recordingError);
            setError("Could not stop recording");
            return null;
        }
    };
    return {
        isRecording: recorderState.isRecording,
        durationMillis: recorderState.durationMillis,
        recordingUri: audioRecorder.uri,
        error,
        startRecording,
        stopRecording
    };
}