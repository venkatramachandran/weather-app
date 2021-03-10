import Weather from './Weather';
import NoDataFound from './NoDataFound';
import "reflect-metadata";
import {inject, injectable} from "tsyringe";
import Logger from './Logger';

@injectable()
export default class CacheService {
    private cache: Map<string, {w: Weather, expiry: number}> = new Map<string, {w: Weather, expiry: number}>();
    constructor(@inject("cache_time_millis") private cacheTime: number, private log: Logger) {}

    public getWeather(city: string): Weather {
        this.log.trace(`trying to get value for key ${city}`);
        const now = Date.now();
        const data =  this.cache.get(city);
        if (data && data.expiry > now) {
            return data.w;
        }
        throw new NoDataFound(city);
    }
    public setWeather(city: string, w: Weather) {
        this.log.trace(`caching value for key ${city}`);
        const now = Date.now();
        this.cache.set(city, {w, expiry: now + this.cacheTime});
    }
}