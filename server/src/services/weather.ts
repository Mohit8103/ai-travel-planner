/**
 * Weather Service using Open-Meteo (100% Free, No API Key Required)
 * 
 * 1. Geocoding: Converts city name to latitude & longitude
 * 2. Weather: Fetches current temperature and conditions
 */

export interface WeatherInfo {
  destination: string;
  latitude: number;
  longitude: number;
  temperatureCelsius: number;
  temperatureFahrenheit: number;
  condition: string;
  windSpeedKmh: number;
}

// Maps WMO standard weather interpretation codes to human-readable descriptions
function getWeatherDescription(code: number): string {
  switch (code) {
    case 0:
      return "Clear sky";
    case 1:
    case 2:
    case 3:
      return "Mainly clear, partly cloudy";
    case 45:
    case 48:
      return "Foggy";
    case 51:
    case 53:
    case 55:
      return "Light drizzle";
    case 61:
    case 63:
    case 65:
      return "Rain";
    case 71:
    case 73:
    case 75:
      return "Snowfall";
    case 80:
    case 81:
    case 82:
      return "Rain showers";
    case 95:
    case 96:
    case 99:
      return "Thunderstorm";
    default:
      return "Pleasant weather";
  }
}

export async function fetchDestinationWeather(
  destination: string
): Promise<WeatherInfo | null> {
  try {
    // Step 1: Geocode the destination name to coordinates
    const geoUrl = new URL("https://geocoding-api.open-meteo.com/v1/search");
    geoUrl.searchParams.set("name", destination.trim());
    geoUrl.searchParams.set("count", "1");
    geoUrl.searchParams.set("language", "en");
    geoUrl.searchParams.set("format", "json");

    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok) return null;

    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) {
      return null;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // Step 2: Fetch current weather for the coordinates
    const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
    weatherUrl.searchParams.set("latitude", latitude.toString());
    weatherUrl.searchParams.set("longitude", longitude.toString());
    weatherUrl.searchParams.set(
      "current",
      "temperature_2m,weather_code,wind_speed_10m"
    );

    const weatherRes = await fetch(weatherUrl);
    if (!weatherRes.ok) return null;

    const weatherData = await weatherRes.json();
    const current = weatherData.current;

    const tempC = Math.round(current.temperature_2m);
    const tempF = Math.round((tempC * 9) / 5 + 32);

    return {
      destination: `${name}${country ? `, ${country}` : ""}`,
      latitude,
      longitude,
      temperatureCelsius: tempC,
      temperatureFahrenheit: tempF,
      condition: getWeatherDescription(current.weather_code),
      windSpeedKmh: Math.round(current.wind_speed_10m),
    };
  } catch (error) {
    console.warn(`Could not fetch weather for ${destination}:`, error);
    return null;
  }
}
