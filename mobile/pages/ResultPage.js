import { Pressable, Text, View } from "react-native";
import styles from "../styles";

export default function ResultsPage({ results, onBack }) {
  const confidentResults = results.filter(
    (result) => Number(result[6]) >= 0.5
  );

  const notConfidentResults = results.filter(
    (result) => Number(result[6]) < 0.5
  );
  return (
    <View>
      <Text style={[styles.screenTitle, { color: "#000000" }]}>Bird Results</Text>
        <Text style={styles.confident}>high confidence</Text>
        {confidentResults.map((result, index) => (
          <Text key={`confident-${index}`}>
            {result[3]} — {(Number(result[6]) * 100).toFixed(1)}%
          </Text>
        ))}

        <Text style={styles.nconfident}>little confidence</Text>
        {notConfidentResults.map((result, index) => (
          <Text key={`not-confident-${index}`}>
            {result[3]} — {(Number(result[6]) * 100).toFixed(1)}%
          </Text>
        ))}
      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
    </View>
  );
}