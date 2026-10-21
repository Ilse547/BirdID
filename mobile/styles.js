import { StyleSheet } from "react-native";
export default StyleSheet.create({

	container: {
		flex: 1,
		backgroundColor: "#f5f7f2",
		width: "100%",
	},
	title: {
		color: "#000000",
		fontSize: 36,
		fontWeight: "800",
		marginBottom: 24
	},
	title2: {
		color: "#000000",
		fontSize: 24,
		fontWeight: "800",
		marginBottom: 12
	},
	messageOk: {
		color: "#4caf50",
		fontSize: 16,
		textAlign: "center"
	},
	messageError: {
		color: "#ff8a80",
		fontSize: 16,
		textAlign: "center"
	},
	bottomBar: {
		width: "100%",
		height: 80,
		backgroundColor: "#E8F5E9",
		alignSelf: "stretch",
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		position: "relative",
	},
	content: {
		flex: 1,
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 24
	},

	//BUTTONS
	bottomButton: {
		width: 120,
		height: 120 ,
		backgroundColor: "#E63946",
		borderRadius: 60,
		alignItems: "center",
		justifyContent: "center"
	},
	bottomButtonPressed: {
		backgroundColor: "#C42D39"
	},
	bottomButtonIcon: {
		fontSize: 50,
		textAlign: "center",
		includeFontPadding: false
	},
	Primarybutton: {
		width: 200,
		minHeight: 50,
		backgroundColor: "#8BC34A",
		padding: 14,
		borderRadius: 8,
		marginTop: 12,
		alignItems: "center",
		marginBottom: 20,
	},
	PrimarybuttonText: {
		color: "#000000",
		fontWeight: "bold",
		fontSize: 16,
	},
	Secondarybutton: {
		backgroundColor: "#8BC34A",
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 999,
		alignItems: "center"
	},
	SecondarybuttonText: {
		color: "#000000",
		fontSize: 15,
		fontWeight: "700",
	},
	SecondarybuttonPressed: {
		opacity: 0.6
	},

	BottomBarbutton: {
		position: "absolute",
		width: 45,
		height: 45,
		borderRadius: 30,
		backgroundColor: "#8BC34A",
		alignItems: "center",
		justifyContent: "center",
	},
	BottomBarbuttonText: {
		fontSize: 18,
		fontWeight: "bold"
	},

	
	observationTitle: {
		color: "#000000",
		fontSize: 20,
		lineHeight: 26,
		fontWeight: "700",
		textAlign: "center",
		flexShrink: 1,
	},
	observationLocation: {
		color: "#fff",
		fontSize: 16,
		lineHeight: 22,
		marginTop: 8,
		textAlign: "center",
		flexShrink: 1,
		maxWidth: "100%",
	},

	header: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingTop: 20,
		paddingBottom: 20
	},
	headerLeft: {
		flexDirection: "row",
		alignItems: "center"
	},
	appIcon: {
		width: 48,
		height: 48,
		borderRadius: 12,
		marginRight: 12
	},

	headerTitle: {
		color: "#000000",
		fontSize: 28,
		fontWeight: "800"
	},

	mainContent: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	},
	helpScreen: {
		flex: 1,
		width: "100%",
		justifyContent: "center",
		alignItems: "center"
	},
	profileScroll: {
		width: "100%",
		flex: 1,
		marginBottom: 85,
	},
	profileScrollContent: {
		alignItems: "center",
		paddingTop: 20,
		paddingBottom: 50,
	},
	helpText: {
		fontSize: 12,
		lineHeight: 25,
		textAlign: "center",
		marginBottom: 18
	},

	recordingScreen: {
		flex: 1,
		width: "100%",
		alignItems: "center",
		paddingTop: 24
	},
	screenTitle: {
		color: "#ffffff",
		fontSize: 28,
		fontWeight: "800",
		marginBottom: 24
	},
	recordingError: {
		color: "#ff8a80",
		fontSize: 15,
		textAlign: "center",
		marginBottom: 16
	},
	confident : {
		color: "#17b348",
		fontSize: 25
	},
	nconfident : {
		color: "#ed4f2f",
		fontSize: 25
	},
	authContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
	},
	authTitle: {
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 20,
	},
	inputBox: {
		width: 200,
		height: 50,
		borderWidth: 1,
		borderColor: "#999",
		borderRadius: 8,
		padding: 12,
		marginVertical: 6,
		backgroundColor: "#fff",
		color: "#050505"
	},


	birdLink: {
		color: "#0062ff",
		fontSize: 18,
		textDecorationLine: "underline",
	},
	birdResultRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		alignItems: "center",
		justifyContent: "center",
		marginVertical: 6,
	},
	helpScroll: {
		flex: 1,
		width: "100%"
	},
	helpContent: {
		alignItems: "center",
		paddingHorizontal: 24,
		paddingTop: 30,
		paddingBottom: 120
	},
	divider: {
		width: 350,
		height: 1,
		backgroundColor: "#000000",
		marginVertical: 20,
	},
});
