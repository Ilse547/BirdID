import { Text, ScrollView, View, Pressable} from "react-native";
import { useRef, useState } from "react";
import styles from "../styles";

export default function Helppage() {
	const scrollViewRef = useRef(null);
	const [sectionPositions, setSectionPositions] = useState({});
const saveSectionPosition = (sectionName) => (event) => {
  const y = event.nativeEvent?.layout?.y ?? 0;

  setSectionPositions((currentPositions) => ({
    ...currentPositions,
    [sectionName]: y
  }));
};
	const scrollToSection = (sectionName) => {
	const position = sectionPositions[sectionName];
	if (position !== undefined) {
		scrollViewRef.current?.scrollTo({y: position, animated: true});
	}

	};
	return(
		<ScrollView style={styles.helpScroll} ref={scrollViewRef} contentContainerStyle={styles.helpContent} showsVerticalScrollIndicator={true}>
			<Text style={styles.title}>Help Page</Text>
			<Text style={styles.title2}>Content:</Text>
			<Pressable style={[styles.Secondarybutton, {width: 120,marginBottom:5}]} onPress={() => scrollToSection("navigation")}>
				<Text style={styles.SecondarybuttonText}>Navigation</Text>
			</Pressable>
			<Pressable style={[styles.Secondarybutton, {width: 120, marginBottom:5}]} onPress={() => scrollToSection("results")}>
				<Text style={styles.SecondarybuttonText}>Results</Text>
			</Pressable>
			<Pressable style={[styles.Secondarybutton, {width: 120,marginBottom:5}]} onPress={() => scrollToSection("recording")}>
				<Text style={styles.SecondarybuttonText}>Recording</Text>
			</Pressable>

			<View style={styles.divider}/>
			<View onLayout={saveSectionPosition("navigation")}>
				<Text style={[styles.title2, {textAlign:"left"}]}>Navigation</Text>
				<Text>
					On the bottom navigation bar there are different icons that redirect to different pages:
					{"\n\n"}
					🏠 : Home button
					{"\n\n"}
					❓ : Help button
					{"\n\n"}
					👥 : Follower button
					{"\n\n"}
					👤 : Profile button
				</Text>
			</View>

			<View style={styles.divider}/>


			<View onLayout={saveSectionPosition("recording")}>
				<Text style={[styles.title2, {textAlign:"left"}]}>Recording</Text>
				<Text>
					To record, Press on the Big red button
					{"\n\n"}
					If it asks for permission, you must grant at least the microphone permission
					{"\n\n"}
					Once you're done recording press on the STOP RECORDING button.
					{"\n\n"}
					The recording must exceed 15 sec.
				</Text>
			</View>

			<View style={styles.divider}/>

			<View onLayout={saveSectionPosition("results")}>
				<Text style={[styles.title2, {textAlign:"left"}]}>Resuts</Text>
				<Text>
					reults are seperated into 2 categories depending on how confident the model is:
					{"\n\n"}
					- High confidence
					{"\n\n"}
					- Little confidence
					{"\n\n"}
				</Text>
			</View>
		</ScrollView>
	);
}
