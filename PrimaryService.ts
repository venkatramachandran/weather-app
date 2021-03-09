import Weather from "./Weather";
import fetch from 'node-fetch';
import ApiError from './ApiError';

export default class PrimaryService {
    constructor(private url: string, private apiKey: string) {}

    public async getWeather(city: string): Promise<Weather> {
        const apiUrl = `${this.url}?access_key=${this.apiKey}&query=${city}&units=m&language=en`;
        try {
            const response = await fetch(apiUrl);
            const responseBody = await response.json();
            if (responseBody.success) {
                return {
                    temperature_degrees: responseBody.current.temperature,
                    wind_speed: responseBody.current.wind_speed
                };
            } else {
                throw new ApiError(responseBody.error.info);
            }
        } catch (err) {
            throw new ApiError(err.message);
        }
    }
}