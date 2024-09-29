// WeatherComponent.js
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

const getWeatherIcon = (weatherCondition) => {
  return weatherIcons[weatherCondition] || "/assets/icons/default.svg"; // Fallback icon
};

const WeatherComponent = ({ entry }) => {
  const weatherCondition = entry.weather[0].main.toLowerCase(); // e.g., "clouds"
  const iconSrc = getWeatherIcon(weatherCondition);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { weekday: "long" };
    return new Intl.DateTimeFormat("en-GB", options).format(date);
  };

  return (
    <div className="flex items-center justify-between gap-3 py-5 px-2 border-b border-gray-300 text-sm w-full">
  {/* Date Section */}
  <div className="flex-shrink-0 w-1/3">
    {formatDate(entry.dt)}
  </div>

  {/* Weather Icon and Condition */}
  <div className="flex items-center gap-2 w-1/3">
    <img src={iconSrc} alt={entry.weather[0].main} className="w-5 h-5" />
    <span>{entry.weather[0].main}</span>
  </div>

  {/* Temperature Section */}
  <div className="flex-shrink-0 w-1/3 text-right">
    {Math.round(entry.main.temp)}°C
  </div>
</div>


  );
};

export default WeatherComponent;
