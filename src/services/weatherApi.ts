import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = "e46cd65e17c856ca33b968a0e957cef0";

export interface WeatherList {
  data: { [key: string]: WeatherItem[] };
}

export interface WeatherItem {
  time: string;
  temperature: string;
  feelsLike: string;
  humidity: string;
  weather: Weather;
  description: Description;
  windSpeed: string;
  iconUrl: string;
  visibility: string;
}

export enum Description {
  BrokenClouds = "broken clouds",
  ClearSky = "clear sky",
  FewClouds = "few clouds",
  LightSnow = "light snow",
  OvercastClouds = "overcast clouds",
  ScatteredClouds = "scattered clouds",
  Snow = "snow",
}

export enum Weather {
  Clear = "Clear",
  Clouds = "Clouds",
  Snow = "Snow",
}

interface WeatherForecastResponse {
  data: WeatherList[];
}

export const getWeatherForecast = async (lat: number, lon: number): Promise<WeatherForecastResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      // throw new Error(errorData.message || "Failed to fetch weather forecast");
    }

    const data: WeatherForecastResponse = await response.json();
    return data;
  } catch (error: any) {
    // throw new Error(error.message || "An error occurred while fetching data");
  }
};

export const getWeather = async (lat: number, lon: number): Promise<{ data: WeatherItem }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`, {
      method: "GET",
    });

    if (!response.ok) {
      const errorData = await response.json();
      // throw new Error(errorData.message || "Failed to fetch current weather");
    }

    const data: { data: WeatherItem } = await response.json();
    return data;
  } catch (error: any) {
    // throw new Error(error.message || "An error occurred while fetching data");
  }
};
