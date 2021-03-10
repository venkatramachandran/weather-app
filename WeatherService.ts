import CacheService from "./CacheService";
import PrimaryService from "./PrimaryService";
import SecondaryService from "./SecondaryService";
import Weather from "./Weather";
import "reflect-metadata";
import {injectable} from "tsyringe";
import Logger from "./Logger";

@injectable()
export default class WeatherService {
    constructor(private p: PrimaryService, private s: SecondaryService, private c: CacheService, private l: Logger) {}
    public async getWeather(city: string): Promise<Weather | null> {
        let w: Weather;
        try {
            w = await this.p.getWeather(city);
            this.c.setWeather(city, w);
            return w;
        } catch (perr) {
            this.l.warn(`primary service failed`);
        }
        try {
            w = await this.s.getWeather(city);
            this.c.setWeather(city, w);
            return w;
        } catch (serr) {
            this.l.warn(`secondary service failed`);
        }
        try {
            w = this.c.getWeather(city);
            return w;
        } catch (cerr) {
            this.l.warn(`cache service failed`);
            return null;
        }
    }
}