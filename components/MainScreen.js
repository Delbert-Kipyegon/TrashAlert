import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";

const MainScreen = () => {
	const [reminderEnabled, setReminderEnabled] = useState(true);
	const [customTime, setCustomTime] = useState(new Date());
	const [showPicker, setShowPicker] = useState(false);

	// Schedule a notification with custom settings
	const scheduleReminder = async () => {
		await Notifications.cancelAllScheduledNotificationsAsync();

		if (reminderEnabled) {
			const trigger = {
				weekday: 3, // Default to Wednesday
				hour: customTime.getHours(),
				minute: customTime.getMinutes(),
				repeats: true,
			};

			Notifications.scheduleNotificationAsync({
				content: {
					title: "Trash Reminder",
					body: `Don’t forget to take out the trash!`,
				},
				trigger,
			});
		}
	};

	const handleToggleReminder = (value) => {
		setReminderEnabled(value);
		if (value) {
			scheduleReminder();
		}
	};

	const handleTimeChange = (event, selectedTime) => {
		setShowPicker(false);
		if (selectedTime) {
			setCustomTime(selectedTime);
			scheduleReminder();
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Trash Reminder App</Text>

			<View style={styles.card}>
				<Text style={styles.dateText}>
					Current Reminder Time:{" "}
					{customTime.toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					})}
				</Text>
				<TouchableOpacity
					style={styles.button}
					onPress={() => setShowPicker(true)}
				>
					<Text style={styles.buttonText}>Set Reminder Time</Text>
				</TouchableOpacity>

				{showPicker && (
					<DateTimePicker
						value={customTime}
						mode="time"
						onChange={handleTimeChange}
					/>
				)}

				<View style={styles.toggleContainer}>
					<Text style={styles.toggleLabel}>Enable Reminder</Text>
					<Switch
						value={reminderEnabled}
						onValueChange={handleToggleReminder}
						thumbColor={reminderEnabled ? "#007bff" : "#ccc"}
						trackColor={{ false: "#d3d3d3", true: "#90cdf4" }}
					/>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#f8f9fa",
	},
	header: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#007bff",
		textAlign: "center",
		marginBottom: 20,
	},
	card: {
		backgroundColor: "#fff",
		padding: 20,
		borderRadius: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 3,
	},
	dateText: {
		fontSize: 18,
		color: "#333",
		marginBottom: 10,
		textAlign: "center",
	},
	button: {
		backgroundColor: "#007bff",
		padding: 15,
		borderRadius: 10,
		alignItems: "center",
		marginBottom: 20,
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	toggleContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginTop: 20,
	},
	toggleLabel: {
		fontSize: 16,
		color: "#333",
	},
});

export default MainScreen;
