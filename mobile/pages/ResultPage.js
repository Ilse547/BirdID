import { Pressable, Text, View } from "react-native";
import styles from "../styles";

export default function ResultsPage({ results, onBack }) {
  return (
    <View>
      <Text style={styles.screenTitle}>Bird Results</Text>
      {results.map((result, index) => (
        <Text key={index}>
          {result[3]} — {(Number(result[6]) * 100).toFixed(1)}%
        </Text>
      ))}
      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
    </View>
  );
}