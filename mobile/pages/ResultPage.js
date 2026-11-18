import { Pressable, Text, View, Share } from "react-native";
import styles from "../styles";
import { API_URL } from "../config";

export default function ResultsPage({ results, onBack, recordingId }) {
  const confidentResults = results.filter(
    (result) => Number(result[6]) >= 0.5
  );

  const notConfidentResults = results.filter(
    (result) => Number(result[6]) < 0.5
  );
  const handleShare = async () => {
    const lines = results.map((result) => `${result[3]} (${(Number(result[6]) * 100).toFixed(1)}%)`);
    const link = recordingId ? `\n\nListen to the recording: ${API_URL}/observation/${recordingId}` : "";
    const message = `I identified these bird\n${lines.join("\n")}${link}`;
    await Share.share({ message });
  };
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
      <Pressable style={styles.Secondarybutton} onPress={onBack}>
        <Text style={styles.SecondarybuttonText}>Back</Text>
      </Pressable>
      <Pressable style={styles.Primarybutton} onPress={handleShare}>
        <Text style={styles.PrimarybuttonText}>Share observation</Text>
      </Pressable>
    </View>
  );
}