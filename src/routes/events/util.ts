import { env } from "@/env";

export async function fetchWeather(city_name: string, date: Date) {
  const parsedDate = date.toISOString().split("T")[0];
  const result = await fetch(
    `${env.WEATHER_API_URL}&city=${city_name}&date=${parsedDate}`,
  );
  return result.json() as Promise<{ weather: string }>;
}

export async function fetchDistance(
  lat1: number,
  long1: number,
  lat2: number,
  long2: number,
) {
  const result = await fetch(
    `${env.DISTANCE_API_URL}&latitude1=${lat1}&longitude1=${long1}&latitude2=${lat2}&longitude2=${long2}`,
  );
  return result.json() as Promise<{ distance: number }>;
}
