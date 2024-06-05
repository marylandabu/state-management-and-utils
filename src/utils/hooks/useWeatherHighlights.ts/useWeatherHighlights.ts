import { useEffect, useState } from "react";
import { ListItem, WeatherResponse } from "../../types/weatherTypes";

export const useWeatherHighlights = (weather: WeatherResponse) => {
  const [snowDays, setSnowDays] = useState<ListItem[]>([]);
  const [windyDays, setWindyDays] = useState<ListItem[]>([]);
  const [coldestDay, setColdestDay] = useState<ListItem | undefined>();
  const [windiestDay, setWindiestDay] = useState<ListItem | undefined>();
  const [highestOddsDay, setHighestOddsDay] = useState<ListItem | undefined>();

  useEffect(() => {
    if (!weather || !weather.list) {
      console.error("Invalid weather data");
      return;
    }

    let coldestTemp = Infinity;
    let windiestSpeed = -Infinity;
    let highestOddContrast = -Infinity;
    let highestOddsDayTemp: ListItem | undefined;
    const snowTemp: ListItem[] = [];
    const windTemp: ListItem[] = [];

    for (const day of weather.list) {
      // Update snow days
      if (day.weather[0].main.includes("Snow")) {
        snowTemp.push(day);
      }

      // Update windy days
      if (day.wind.speed > 10) {
        windTemp.push(day);
      }

      // Update coldest day
      if (day.main.temp < coldestTemp) {
        coldestTemp = day.main.temp;
        setColdestDay(day);
      }

      // Update windiest day
      if (day.wind.speed > windiestSpeed) {
        windiestSpeed = day.wind.speed;
        setWindiestDay(day);
      }

      // Update highest odd day
      const contrast = Math.abs(day.main.temp - day.main.pressure);
      if (contrast % 2 !== 0 && contrast > highestOddContrast) {
        highestOddContrast = contrast;
        highestOddsDayTemp = day;
      }
    }

    // Set state once after all calculations
    setSnowDays(snowTemp);
    setWindyDays(windTemp);
    setHighestOddsDay(highestOddsDayTemp);
  }, [weather]);

  return { snowDays, windyDays, coldestDay, windiestDay, highestOddsDay };
};
