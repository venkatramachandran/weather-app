import CacheService from "./CacheService";
import Weather from './Weather';

describe('CacheService', () => {
    let c: CacheService;
    const w: Weather = {
        temperature_degrees: -1,
        wind_speed: -1
    };
    const city: string = 'TestCity';
    const cacheTime = 3000;

    beforeEach(() => {
        c = new CacheService(cacheTime);
    });
    it('can get and set data properly', async () => {
        c.setWeather(city, w);
        expect(c.getWeather(city)).toBe(w);
    });
    it('does not cache data beyond expiry', async () => {
        c.setWeather(city, w);
        await new Promise((r) => setTimeout(r, cacheTime+1000));
        expect(() => c.getWeather(city)).toThrowError(`No weather data found for ${city}`);
    });
    it('throws an error when data is not found', async () => {
        expect(() => c.getWeather(city)).toThrowError(`No weather data found for ${city}`);
    });
});