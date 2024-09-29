// WeatherIcon.js
import React from "react";
import clearIcon from "../assets/icons/clear.svg";
import cloudsIcon from "../assets/icons/clouds.svg";
import rainIcon from "../assets/icons/rain.svg";
import snowIcon from "../assets/icons/snow.svg";
import TornadoIcon from "../assets/icons/tornado.svg";
import MistIcon from "../assets/icons/mist.svg";
import HazeIcon from "../assets/icons/haze.svg";

const weatherIcons = {
  clear: clearIcon,
  clouds: cloudsIcon,
  rain: rainIcon,
  snow: snowIcon,
  tornado: TornadoIcon,
  mist: MistIcon,
  haze: HazeIcon,
};

// Function to get the appropriate icon based on the weather condition
const getWeatherIcon = (weatherCondition) => {
  return weatherIcons[weatherCondition] || "/assets/icons/default.svg"; // Fallback icon
};

const WeatherIcon = ({ weatherCondition }) => {
  const iconSrc = getWeatherIcon(weatherCondition);

  return (
    <img
      src={iconSrc}
      alt={weatherCondition}
      className="w-30 h-20 " // Adjust size as needed
    />
  );
};

export default WeatherIcon;
