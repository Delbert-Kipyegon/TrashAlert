import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const SplashScreen = ({ navigation }) => {
	useEffect(() => {
		// Simulate a delay of 5 seconds before navigating to the next screen
		const timer = setTimeout(() => {
			// Replace 'HomeScreen' with your main screen's name
			navigation.replace("MainScreen");
		}, 5000);

		return () => clearTimeout(timer); // Clear timeout on unmount
	}, [navigation]);

	return (
		<View style={styles.container}>
			<Icon
				name="trash"
				size={60}
				color="#fff"
				style={styles.icon}
			/>
			<Text style={styles.text}>Trash Reminder App</Text>
			<ActivityIndicator
				size="large"
				color="#fff"
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#007bff",
	},
	icon: {
		marginBottom: 20,
	},
	text: {
		fontSize: 32,
		fontWeight: "bold",
		color: "#fff",
		marginBottom: 20,
	},
});

export default SplashScreen;
