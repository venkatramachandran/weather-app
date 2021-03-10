import Weather from "./Weather";
import fetch from 'node-fetch';
import ApiError from './ApiError';
import "reflect-metadata";
import {inject, injectable} from "tsyringe";
import Logger from "./Logger";

@injectable()
export default class SecondaryService {
    constructor(@inject("secondary_api_url") private url: string, @inject("secondary_api_key") private apiKey: string, private log: Logger) {}

    public async getWeather(city: string): Promise<Weather> {
        const apiUrl = `${this.url}?appid=${this.apiKey}&q=${city}&units=metric`;
        try {
            this.log.trace(`calling api`);
            const response = await fetch(apiUrl);
            this.log.trace(`got api response`);
            const responseBody = await response.json();
            return {
                temperature_degrees: responseBody.main.temp,
                wind_speed: responseBody.wind.speed * 3.6 //convert from m/s to km/h
            };
        } catch (err) {
            this.log.warn(`caught error with message ${err.message}`);
            throw new ApiError(err.message);
        }
    }
}