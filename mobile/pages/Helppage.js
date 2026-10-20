import { Text, View } from "react-native";
import styles from "../styles";

export default function Helppage() {
	return(
		<View style={styles.helpScreen}>
			<Text style={styles.screenTitle}>Help Page</Text>
			<Text style={styles.helpText}>
				Press the microphone to record you sourroundings.
			</Text>
			<Text style={styles.helpText}>
				We will analyse the sound and tell you what the birds youre hearing are.
			</Text>
			<Text style={styles.helpText}>Results:</Text>
			<Text style={styles.helpText}>
				Results are seperated into 2 categories, depending on the confidence(number next to bird id)
			</Text>
		</View>
	);
}
