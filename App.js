import React, { useState, useEffect } from "react";
import SplashScreen from "./components/SplashScreen";
import MainScreen from "./components/MainScreen";

const App = () => {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => setIsLoading(false), 5000);
		return () => clearTimeout(timer);
	}, []);

	return isLoading ? <SplashScreen /> : <MainScreen />;
};

export default App;
