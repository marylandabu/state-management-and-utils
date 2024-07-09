import { useEffect, useState } from "react";
import { ListItem, WeatherResponse } from "../../types/weatherTypes";

export const useWeatherHighlights = (weather: WeatherResponse) => {
  const [snowDays, setSnowDays] = useState<ListItem[]>([]);
  const [windyDays, setWindyDays] = useState<ListItem[]>([]);
  const [coldestDay, setColdestDay] = useState<ListItem | undefined>();
  const [windiestDay, setWindiestDay] = useState<ListItem | undefined>();
  const [highestOddsDay, setHighestOddsDay] = useState<ListItem | undefined>();
  const [biggestTempDrops, setBiggestTempDrops] = useState<{
    [key: number]: { start: ListItem; end: ListItem; drop: number };
  }>({});
  const [biggest24hrTempChange, setBiggest24hrTempChange] = useState<
    | {
        start: ListItem;
        end: ListItem;
        change: number;
      }
    | undefined
  >();

  useEffect(() => {
    if (!weather || !weather.list) {
      console.error("Invalid weather data");
      return;
    }

    const periods = [3, 12, 24, 48]; // hours
    const maxDrops: {
      [key: number]: { start: ListItem; end: ListItem; drop: number };
    } = {};
    let max24hrChange = {
      start: weather.list[0],
      end: weather.list[0],
      change: 0,
    };

    let coldestTemp = Infinity;
    let windiestSpeed = -Infinity;
    let highestOddContrast = -Infinity;
    let highestOddsDayTemp: ListItem | undefined;
    const snowTemp: ListItem[] = [];
    const windTemp: ListItem[] = [];

    const weatherList = weather.list;

    for (let i = 0; i < weatherList.length; i++) {
      const start = weatherList[i];

      // Update snow days
      if (start.weather[0].main.includes("Snow")) {
        snowTemp.push(start);
      }

      // Update windy days
      if (start.wind.speed > 10) {
        windTemp.push(start);
      }

      // Update coldest day
      if (start.main.temp < coldestTemp) {
        coldestTemp = start.main.temp;
        setColdestDay(start);
      }

      // Update windiest day
      if (start.wind.speed > windiestSpeed) {
        windiestSpeed = start.wind.speed;
        setWindiestDay(start);
      }

      // Update highest odd day
      const contrast = Math.abs(start.main.temp - start.main.pressure);
      if (contrast % 2 !== 0 && contrast > highestOddContrast) {
        highestOddContrast = contrast;
        highestOddsDayTemp = start;
      }

      // Calculate temperature drops
      for (const period of periods) {
        const endIndex = i + period;
        if (endIndex < weatherList.length) {
          const end = weatherList[endIndex];
          const tempDrop = start.main.temp - end.main.temp;
          if (!maxDrops[period] || tempDrop > maxDrops[period].drop) {
            maxDrops[period] = { start, end, drop: tempDrop };
          }
        }
      }

      // Calculate 24-hour temperature changes (rise or drop)
      const end24hrIndex = i + 24;
      if (end24hrIndex < weatherList.length) {
        const end24hr = weatherList[end24hrIndex];
        const tempChange = Math.abs(start.main.temp - end24hr.main.temp);
        if (tempChange > max24hrChange.change) {
          max24hrChange = { start, end: end24hr, change: tempChange };
        }
      }
    }

    // Set state once after all calculations
    setSnowDays(snowTemp);
    setWindyDays(windTemp);
    setHighestOddsDay(highestOddsDayTemp);
    setBiggestTempDrops(maxDrops);
    setBiggest24hrTempChange(max24hrChange);
  }, [weather]);

  return {
    snowDays,
    windyDays,
    coldestDay,
    windiestDay,
    highestOddsDay,
    biggestTempDrops,
    biggest24hrTempChange,
  };
};
