import { S3Client } from "@aws-sdk/client-s3";
import { Theme } from "@emotion/react";

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

export interface Clouds {
  all: number;
}

export interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

export interface Sys {
  pod: string;
}

export interface ListItem {
  dt: number;
  main: Main;
  weather: Weather[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  sys: Sys;
  dt_txt: string;
}

export interface Coord {
  lat: number;
  lon: number;
}

export interface City {
  id: number;
  name: string;
  coord: Coord;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

export interface WeatherResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ListItem[];
  city: City;
}

export interface FileUploadS3Props {
  apiEndpoint: string;
  bucketName: string;
  userId: string;
  s3Client: S3Client;
  theme?: Theme;
}
