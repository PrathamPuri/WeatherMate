import React from "react";
import { useState } from "react";
import { TypingEffect } from "./TypingEffect";
import WeatherComponent from "./components/WeatherComponent";
import WeatherIcon from "./components/WeatherIcon";
import WindIcon from "./assets/icons/wind.svg";
import RealIcon from "./assets/icons/tempFeel.svg";
import UvIndex from "./assets/icons/UvIndex.svg";
import RainChance from "./assets/icons/RainChance.svg";

const Weather1 = () => {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState({});

  const dateBuilder = (d) => {
    if (!d) d = new Date();
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
  };

  const api = {
    base: "https://api.openweathermap.org/data/2.5",
  };

  const fetchCurrentWeather = () => {
    fetch(`${api.base}/weather?q=${query}&units=metric&appid=${api.key}`)
      .then((res) => res.json())
      .then((result) => {
        console.log("Current Weather Data:", result);
        const { lat, lon } = result.coord;

        fetch(`${api.base}/uvi?lat=${lat}&lon=${lon}&appid=${api.key}`)
          .then((res) => res.json())
          .then((UvResult) => {
            console.log("UV Index Data:", UvResult.value); // Log UV data
            setWeather({
              ...result,
              uvIndex: Math.floor(UvResult.value), // Update state with UV index
            });
            setQuery(""); // Clear the input field
          })
          .catch((error) => {
            console.error("Error fetching UV index:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching current weather:", error);
      });
  };

  const fetchForecast = () => {
    fetch(`${api.base}/forecast?q=${query}&units=metric&appid=${api.key}`)
      .then((res) => res.json())
      .then((result) => {
        console.log("Forecast Data:", result);
        const chanceOfRain = Math.floor((result.list[0].pop || 0) * 100);
        console.log(chanceOfRain);
        setForecast(result);
        setQuery(""); // Clear the input field
      })
      .catch((error) => console.error("Error fetching forecast:", error));
  };

  const search = (e) => {
    if (e.key === "Enter") {
      fetchCurrentWeather(); // Fetch current weather data
      fetchForecast(); // Fetch forecast data
    }
  };

  const getDailyForecast = () => {
    if (!forecast || !forecast.list) return []; // Check if forecast data exists

    const daily = [];
    const days = {};

    forecast.list.forEach((entry) => {
      const date = new Date(entry.dt * 1000);
      const day = date.toLocaleDateString(); // Format date to ensure unique days

      // Keep only one forecast per day (closest to noon)
      if (
        !days[day] ||
        Math.abs(date.getHours() - 12) <
          Math.abs(new Date(days[day].dt * 1000).getHours() - 12)
      ) {
        days[day] = entry;
      }
    });

    // Convert days object to array
    for (let day in days) {
      daily.push(days[day]);
    }

    return daily;
  };

  const dailyForecast = getDailyForecast();

  const weatherCondition = weather?.weather?.[0]?.main?.toLowerCase() || "";
  return (
    <div className="flex flex-col md:px-56 md:flex-row md:gap-0 md:h-screen  justify-center bg-blue-500 px-10 pt-8 pb-20 gap-5">
      <main className=" md:w-full md:h-full flex flex-col ">
        <div className="first flex flex-col  md:w-8/9  ">
          <div className="searchBar flex flex-row text-center py-4 pl-0">
            <input
              type="text"
              className="border rounded p-2 md:p-4 w-full md:w-5/6 h-10"
              placeholder="search.."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={search}
            />
            <div className="hidden">{console.log(dailyForecast)}</div>
            <div className="hidden md:flex justify-center items-center p-3 space-x-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                color="#000000"
                fill="none"
              >
                <path
                  d="M17.5 17.5L22 22"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {typeof weather.main !== "undefined" ? (
            <div className="currentWeather flex flex-row  md:h-2/3 md:flex-row md:gap-10 gap-1 md:justify-start text-white w-full md:w-5/6 bg-blue-400 rounded-lg ">
              <div className=" cityName flex flex-col ">
                <div className="flex flex-col p-3 text-2xl md:text-3xl">
                  {weather.name && weather.sys && (
                    <div className="location text-2xl ">
                      {weather.name},{weather.sys.country}
                    </div>
                  )}
                  <div className="weather font-mono text-xl md:text-xl md:pt-4 md:pb-2 ">
                    {weather.weather[0].main}
                  </div>
                </div>
                <div className="weather-box  px-3 pb-5">
                  <div className="temp text-lg md:text-xl">
                    {Math.round(weather.main.temp)}°C
                  </div>
                </div>
              </div>
              <div className="p-5 flex justify-center md:justify-end w-full md:w-4/5 items-center">
                <div className="p-5 flex items-center">
                  <WeatherIcon weatherCondition={weatherCondition} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center text-3xl md:text-4xl text-white">
              <span>
                <TypingEffect />
              </span>
            </div>
          )}
        </div>
        {typeof weather.main !== "undefined" ? (
         <div className="md:w-8/9 w-full flex flex-1 "> 
         <div className="first md:py-5 md:w-5/6 py-5 w-full  ">
         <div className="  flex flex-row  bg-blue-400 rounded-lg text-white w-auto ">
           <div className=" first flex flex-row flex-1 p-4 ">
             <div className="reelFeel  flex flex-col gap-2 p-0 ">
               <div className="flex  justify-start item-center  ">
                 <img src={RealIcon} alt="Wind Icon" className=" h-7 " />
                 <div className=" text-lg flex pl-2 items-center">
                   Real Feel
                 </div>
               </div>
               <div>
                 <span className="p-1 px-9 flex justify-start">{weather.main.feels_like}°</span>
               </div>
               <div className="chanceOfRain  py-2 flex flex-col gap-2 ">
               <div className="flex items-center justify-center  ">
                 <img src={RainChance} alt="Wind Icon" className=" h-6 " />
              <div className="pl-2 text-lg flex items-center">Chance of rain</div>
               </div>
               <div>
                 <span className="p-1 px-8 flex justify-start">{forecast.list[0].pop}%</span>
               </div>
             </div>
             </div>
            
           </div>
           <div className="second flex   flex-col justify-start p-4 align-middle text-center max-w-full">
             <div className="uvINdex   flex flex-col gap-2  justify-start ">
               <div className="flex items-center justify-center  ">
                 <img src={UvIndex} alt="Wind Icon" className=" h-8 " />
                 <div className="pl-2 text-lg flex items-center">
                   UV Index
                 </div>
               </div>
               <div >
                 <span className="flex pb-3 px-10">{weather.uvIndex}</span>
               </div>
             </div>
             <div className="wind  py-2 flex flex-col gap-2 w-max">
               <div className="flex items-center justify-center  ">
                 <img src={WindIcon} alt="Wind Icon" className=" h-5 " />
                 <div className="pl-2 text-lg flex items-center">wind</div>
               </div>
               <div>
                 <span className="p-2 flex justify-evenly">{weather.wind.speed} km/h</span>
               </div>
             </div>
           </div>
         </div>
       </div></div>
        ) : (
          <div></div>
        )}
      </main>
      {typeof weather.main !== "undefined" ? (
        <div className="forecast w-full md:w-1/3 pt-10 pb-10 md:h-auto h-max ">
          <div className="forecastContainer  md:h-auto flex flex-col mt-4  text-white bg-blue-400 rounded-lg h-max">
            <h2 className="text-center text-lg md:text-xl mb-4">
              7-Day Forecast
            </h2>
            <div className="flex flex-col ">
              {dailyForecast.slice(0, 7).map((entry, index) => (
                <WeatherComponent key={index} entry={entry} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
export default Weather1;
