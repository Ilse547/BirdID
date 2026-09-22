import { Pressable, Text, View } from "react-native";
import styles from "../styles";

export default function Recordingpage({ onBack }) {
  return (
    <View style={styles.recordingScreen}>
      <Text style={styles.screenTitle}>Recording</Text>

      <Text>
        Ready to record
      </Text>

      <Pressable
        style={styles.backButton}
        onPress={onBack}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
    </View>
  );
}