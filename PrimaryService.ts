import Weather from "./Weather";
import fetch from 'node-fetch';
import ApiError from './ApiError';
import "reflect-metadata";
import {inject, injectable} from "tsyringe";

@injectable()
export default class PrimaryService {
    constructor(@inject("primary_api_url") private url: string, @inject("primary_api_key") private apiKey: string) {}

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