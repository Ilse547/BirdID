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
});
