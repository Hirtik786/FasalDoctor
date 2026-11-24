import { mockWeatherData } from '../data/mockWeather';
import type { WeatherAdvisoryData } from '../types';
import { apiRequest } from './api';

const LOCATION_PRESETS: Record<string, Partial<WeatherAdvisoryData['current']>> = {
  'Multan, Punjab': {
    temperature: 26,
    feelsLike: 27,
    humidity: 76,
    rainfallMm: 3.4,
    windSpeedKmh: 11,
    condition: 'Partly Cloudy & Humid',
  },
  'Bahawalpur, Punjab': {
    temperature: 28,
    feelsLike: 29,
    humidity: 68,
    rainfallMm: 1.2,
    windSpeedKmh: 14,
    condition: 'Warm & Mild Breeze',
  },
  'Faisalabad, Punjab': {
    temperature: 24,
    feelsLike: 24,
    humidity: 81,
    rainfallMm: 5.8,
    windSpeedKmh: 9,
    condition: 'Humid & Overcast',
  },
  'Rahim Yar Khan, Punjab': {
    temperature: 30,
    feelsLike: 31,
    humidity: 54,
    rainfallMm: 0,
    windSpeedKmh: 12,
    condition: 'Clear & Dry',
  },
};

export const weatherService = {
  async getWeatherAdvisory(location = 'Multan, Punjab'): Promise<WeatherAdvisoryData> {
    try {
      return await apiRequest<WeatherAdvisoryData>(
        `/api/weather/advisory?location=${encodeURIComponent(location)}`,
        { method: 'GET' },
        1500
      );
    } catch {
      await new Promise((r) => setTimeout(r, 250));
      const preset = LOCATION_PRESETS[location];
      if (!preset) {
        return {
          ...mockWeatherData,
          location: `${location} (Demo Station)`,
        };
      }
      const riskLevel =
        (preset.humidity ?? 70) >= 75
          ? 'High'
          : (preset.humidity ?? 70) >= 62
          ? 'Moderate'
          : 'Low';

      return {
        ...mockWeatherData,
        location: `${location} (Demo Station)`,
        current: {
          ...mockWeatherData.current,
          ...preset,
        },
        advisory: {
          ...mockWeatherData.advisory,
          riskLevel,
        },
      };
    }
  },

  getAvailableLocations(): string[] {
    return Object.keys(LOCATION_PRESETS);
  },
};
