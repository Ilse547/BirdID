import { StyleSheet } from "react-native";
export default StyleSheet.create({

	container: {
		flex: 1,
		backgroundColor: "#ebfaeb",
		width: "100%",
	},
	title: {
		color: "#ffffff",
		fontSize: 36,
		fontWeight: "800",
		marginBottom: 24
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
	test: {
		color: "#ffffff",
		fontSize: 20,
		textAlign: "center"
	},
	bottomBar: {
		width: "100%",
		height: 80,
		backgroundColor: "#ccffcc",
		alignSelf: "stretch",
		alignItems: "center",
		justifyContent: "center"
	},
	content: {
		flex: 1,
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 24
	},
	bottomButton: {
		width: 120,
		height: 120 ,
		backgroundColor: "#ff3300",
		borderRadius: 60,
		alignItems: "center",
		justifyContent: "center"
	},
	bottomButtonPressed: {
		backgroundColor: "#ff8566"
	},
	bottomButtonIcon: {
		fontSize: 50,
		textAlign: "center",
		includeFontPadding: false
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
	helpButton: {
		backgroundColor: "#f4b942",
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 999
	},

	helpButtonPressed: {
		opacity: 0.6
	},

	helpButtonText: {
		color: "#111116",
		fontSize: 15,
		fontWeight: "700"
	},

	helpScreen: {
		flex: 1,
		width: "100%",
		justifyContent: "center",
		alignItems: "center"
	},
	helpText: {
		fontSize: 20,
		lineHeight: 25,
		textAlign: "center",
		marginBottom: 18
	},
	backButton: {
		backgroundColor: "#f4b942",
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 999
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
	recordingStatus: {
		color: "#ffffff",
		fontSize: 18,
		marginBottom: 16
	},
	recordingTimer: {
		color: "#f4b942",
		fontSize: 40,
		fontWeight: "700",
		marginBottom: 32
	},
	recordButton: {
		backgroundColor: "#f4b942",
		paddingVertical: 16,
		paddingHorizontal: 28,
		borderRadius: 10,
		marginBottom: 20
	},
	recordButtonText: {
		color: "#111116",
		fontSize: 16,
		fontWeight: "700"
	},
	stopButton: {
		backgroundColor: "#d9534f",
		paddingVertical: 16,
		paddingHorizontal: 28,
		borderRadius: 10,
		marginBottom: 20
	},
	stopButtonText: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "700"
	},
	recordingError: {
		color: "#ff8a80",
		fontSize: 15,
		textAlign: "center",
		marginBottom: 16
	},
	backButtonText: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "600"
	},
	playButton: {
		backgroundColor: "#4caf50",
		paddingVertical: 14,
		paddingHorizontal: 24,
		borderRadius: 8,
		marginBottom: 12
	},
	playButtonText: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "700"
	},
	replayButton: {
		backgroundColor: "#555555",
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
		marginBottom: 20
	},
	replayButtonText: {
		color: "#ffffff",
		fontSize: 15,
		fontWeight: "600"
	},
	recordingUri: {
		color: "#333333",
		fontSize: 12,
		textAlign: "center",
		marginHorizontal: 20,
		marginBottom: 20
	}
});
