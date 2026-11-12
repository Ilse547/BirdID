import { useState } from "react";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState
} from "expo-audio";
import * as Location from "expo-location";

export default function useBirdRecording() {
    const audioRecorder = useAudioRecorder( {...RecordingPresets.HIGH_QUALITY, directory: "document"});
    const recorderState = useAudioRecorderState(audioRecorder);
    const [error, setError] = useState(null);
    const [recordingUri, setRecordingUri] = useState(null);
    const [location, setLocation] = useState(null);
    const [micBlocked, setMicBlocked] = useState(false);
    const [locationBlocked, setLocationBlocked] = useState(false);
    const startRecording = async () => {
        try {
            setError(null);
            setRecordingUri(null);
            setMicBlocked(false);
            setLocationBlocked(false);
            const permission = await AudioModule.requestRecordingPermissionsAsync();
            if(!permission.granted) {
                setError("Microphone permission declined");
                setMicBlocked(!permission.canAskAgain);
                return false;
            }
            try{
                const locationPermission = await Location.requestForegroundPermissionsAsync();
                if (locationPermission.granted) {
                    const currentLocation = await Location.getCurrentPositionAsync({
                        accuracy: Location.Accuracy.Balanced
                    });
                    const latitude = currentLocation.coords.latitude;
                    const longitude = currentLocation.coords.longitude;
                    const addresses = await Location.reverseGeocodeAsync({latitude, longitude});
                    const address = addresses[0];
                    setLocation({ latitude, longitude, region: address?.region || address?.subregion || null});
                } else {
                setLocationBlocked(!locationPermission.canAskAgain);
                setLocation(null);
                }
            } catch (locationError) {
                console.error(locationError);
                setLocation(null);
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
            const uri = audioRecorder.uri;
            setRecordingUri(uri);
            return uri;
        } catch (recordingError) {
            console.error(recordingError);
            setError("Could not stop recording");
            return null;
        }
    };
    return {
        isRecording: recorderState.isRecording,
        durationMillis: recorderState.durationMillis,
        recordingUri,
        error,
        startRecording,
        stopRecording,
        location,
        micBlocked,
        locationBlocked,
    };
}