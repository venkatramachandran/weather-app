import Weather from "./Weather";
import fetch from 'node-fetch';
import ApiError from './ApiError';
import "reflect-metadata";
import {inject, injectable} from "tsyringe";
import Logger from "./Logger";

@injectable()
export default class PrimaryService {
    constructor(@inject("primary_api_url") private url: string, @inject("primary_api_key") private apiKey: string, private log: Logger) {}

    public async getWeather(city: string): Promise<Weather> {
        const apiUrl = `${this.url}?access_key=${this.apiKey}&query=${city}&units=m`;
        try {
            this.log.trace(`calling api`);
            const response = await fetch(apiUrl);
            this.log.trace(`got api response`);
            const responseBody = await response.json();
            if (responseBody.success === null || responseBody.success === undefined) {
                this.log.trace(`got current as ${responseBody.current.temperature}`);
                return {
                    temperature_degrees: responseBody.current.temperature,
                    wind_speed: responseBody.current.wind_speed
                };
            } else {
                this.log.warn(`caught error with message ${responseBody.error.info}`);
                throw new ApiError(responseBody.error.info);
            }
        } catch (err) {
            this.log.warn(`caught error with message ${err.message}`);
            throw new ApiError(err.message);
        }
    }
}