import Weather from './Weather';
import NoDataFound from './NoDataFound';
import "reflect-metadata";
import {inject, injectable} from "tsyringe";

@injectable()
export default class CacheService {
    private cache: Map<string, {w: Weather, expiry: number}> = new Map<string, {w: Weather, expiry: number}>();
    constructor(@inject("cacheTime") private cacheTime: number) {}

    public getWeather(city: string): Weather {
        const now = Date.now();
        const data =  this.cache.get(city);
        if (data && data.expiry > now) {
            return data.w;
        }
        throw new NoDataFound(city);
    }
    public setWeather(city: string, w: Weather) {
        const now = Date.now();
        this.cache.set(city, {w, expiry: now + this.cacheTime});
    }
}