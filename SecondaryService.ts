import Weather from "./Weather";
import fetch from 'node-fetch';
import ApiError from './ApiError';
import "reflect-metadata";
import {inject, injectable} from "tsyringe";

@injectable()
export default class SecondaryService {
    constructor(@inject("secondary_api_url") private url: string, @inject("secondary_api_url") private apiKey: string) {}

    public async getWeather(city: string): Promise<Weather> {
        const apiUrl = `${this.url}?appid=${this.apiKey}&q=${city}&units=metric&language=en`;
        try {
            const response = await fetch(apiUrl);
            const responseBody = await response.json();
            return {
                temperature_degrees: responseBody.main.temp,
                wind_speed: responseBody.wind.speed * 3.6 //convert from m/s to km/h
            };
        } catch (err) {
            throw new ApiError(err.message);
        }
    }
}