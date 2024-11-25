import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import Icon from "react-native-vector-icons/FontAwesome";
// import { ProgressBar } from "react-native-paper"; // Make sure you install 'react-native-paper' for the progress bar
import { Audio } from "expo-av"; // For sound notifications

const MainScreen = () => {
	const [reminderEnabled, setReminderEnabled] = useState(true);
	const [customTime, setCustomTime] = useState(new Date());
	const [showPicker, setShowPicker] = useState(false);
	const [reminderDays, setReminderDays] = useState([
		false,
		false,
		true,
		false,
		false,
		false,
		false,
	]); // Default to Wednesday
	const [sound, setSound] = useState();

	useEffect(() => {
		// Play sound when reminder is triggered
		return () => {
			if (sound) {
				sound.unloadAsync(); // Unload sound on component unmount
			}
		};
	}, [sound]);

	// Schedule a notification with custom settings
	const scheduleReminder = async () => {
		await Notifications.cancelAllScheduledNotificationsAsync();

		if (reminderEnabled) {
			// Convert days array to an array of weekdays to schedule
			const selectedWeekdays = reminderDays
				.map((day, index) => (day ? index : -1))
				.filter((day) => day !== -1);

			selectedWeekdays.forEach((weekday) => {
				const trigger = {
					weekday: weekday + 1, // Notifications use 1-based weekdays (1 = Sunday)
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
			});
		}
	};

	const handleToggleReminder = (value) => {
		setReminderEnabled(value);
		if (value) {
			scheduleReminder();
		}
	};

	const handleDayToggle = (index) => {
		const updatedDays = [...reminderDays];
		updatedDays[index] = !updatedDays[index];
		setReminderDays(updatedDays);
		scheduleReminder();
	};

	const handleTimeChange = (event, selectedTime) => {
		setShowPicker(false);
		if (selectedTime) {
			setCustomTime(selectedTime);
			scheduleReminder();
		}
	};

	// Progress bar calculation for next reminder time
	const calculateTimeLeft = () => {
		const currentTime = new Date();
		const nextReminder = new Date(customTime);
		nextReminder.setHours(customTime.getHours(), customTime.getMinutes(), 0, 0);
		if (nextReminder < currentTime) {
			nextReminder.setDate(nextReminder.getDate() + 1); // Set for the next day if the time has passed
		}
		const timeLeft = nextReminder - currentTime; // Time left in milliseconds
		return timeLeft;
	};

	const timeLeft = calculateTimeLeft();
	const progress = timeLeft / (1000 * 60 * 60 * 24); // Normalize progress for 24 hours

	// Play sound function
	const playReminderSound = async () => {
		const { sound } = await Audio.Sound.createAsync(
			require("../assets/reminder-sound.mp3") // Make sure to add a sound file in the assets folder
		);
		setSound(sound);
		await sound.playAsync();
	};

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Trash Reminder App</Text>

			<View style={styles.card}>
				<Icon
					name={reminderEnabled ? "check-circle" : "times-circle"}
					size={40}
					color={reminderEnabled ? "green" : "red"}
					style={styles.icon}
				/>
				<Text style={styles.dateText}>
					Current Reminder Time:{" "}
					{customTime.toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					})}
				</Text>

				{/* Day Selection */}
				<View style={styles.daysContainer}>
					{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
						(day, index) => (
							<View
								key={index}
								style={styles.dayOption}
							>
								<Text style={styles.dayText}>{day}</Text>
								<Switch
									value={reminderDays[index]}
									onValueChange={() => handleDayToggle(index)}
									thumbColor={reminderDays[index] ? "#007bff" : "#ccc"}
									trackColor={{ false: "#d3d3d3", true: "#90cdf4" }}
								/>
							</View>
						)
					)}
				</View>

				{/* Time Picker */}
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
				
				{/* Reminder Switch */}
				<View style={styles.toggleContainer}>
					<Text style={styles.toggleLabel}>Enable Reminder</Text>
					<Switch
						value={reminderEnabled}
						onValueChange={handleToggleReminder}
						thumbColor={reminderEnabled ? "#007bff" : "#ccc"}
						trackColor={{ false: "#d3d3d3", true: "#90cdf4" }}
					/>
				</View>

				{/* Progress Bar */}
				{/* <ProgressBar
					progress={progress}
					color="#007bff"
					style={styles.progressBar}
				/> */}

				{/* Play Sound on Reminder */}
				<TouchableOpacity
					style={styles.button}
					onPress={playReminderSound}
				>
					<Text style={styles.buttonText}>Play Reminder Sound</Text>
				</TouchableOpacity>
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
		borderRadius: 15,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.15,
		shadowRadius: 10,
		elevation: 5,
	},
	icon: {
		marginBottom: 20,
		alignSelf: "center",
	},
	daysContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-evenly",
		marginVertical: 15,
	},
	dayOption: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
	},
	dayText: {
		fontSize: 16,
		color: "#333",
		marginRight: 10,
	},
	progressBar: {
		marginTop: 20,
		height: 8,
		borderRadius: 5,
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
