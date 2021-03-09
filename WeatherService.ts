import CacheService from "./CacheService";
import PrimaryService from "./PrimaryService";
import SecondaryService from "./SecondaryService";
import Weather from "./Weather";

export default class WeatherService {
    constructor(private p: PrimaryService, private s: SecondaryService, private c: CacheService) {}
    public async getWeather(city: string): Promise<Weather> {
        let w: Weather;
        try {
            w = await this.p.getWeather(city);
            this.c.setWeather(city, w);
            return w;
        } catch (perr) {
            try {
                w = await this.s.getWeather(city);
                this.c.setWeather(city, w);
                return w;
            } catch (serr) {
                w = this.c.getWeather(city);
                return w;
            }
        }
    }
}