import CacheService from "./CacheService";
import Logger from "./Logger";
import PrimaryService from "./PrimaryService";
import SecondaryService from "./SecondaryService";
import Weather from "./Weather";
import WeatherService from "./WeatherService";

describe('WeatherService', () => {
    let w: WeatherService;
    let pmock: jest.SpyInstance<Promise<Weather>, [city: string]>;
    let smock: jest.SpyInstance<Promise<Weather>, [city: string]>;
    let cmock: jest.SpyInstance<Weather, [city: string]>;
    const model: Weather = {
        wind_speed: -1,
        temperature_degrees: -1
    }
    const city: string = 'Test';
    const log = new Logger('test', 60)
    beforeAll(() => {
        pmock = jest.spyOn(PrimaryService.prototype, 'getWeather');
        smock = jest.spyOn(SecondaryService.prototype, 'getWeather');
        cmock = jest.spyOn(CacheService.prototype, 'getWeather');
    });
    beforeEach(() => {
        let p: PrimaryService = new PrimaryService('http://primary.host', 'apiKey', log);
        let s: SecondaryService = new SecondaryService('http://secondary.host', 'apiKey', log);
        let c: CacheService = new CacheService(3000, log);
        w = new WeatherService(p, s, c, log);
        jest.clearAllMocks();
    });
    it('calls primary service and returns data when primary service responds', async () => {
        pmock.mockReturnValue(Promise.resolve(model));
        const retVal = await w.getWeather(city);
        expect(retVal).toStrictEqual(model);
        expect(pmock).toHaveBeenCalledTimes(1);
        expect(smock).toHaveBeenCalledTimes(0);
        expect(cmock).toHaveBeenCalledTimes(0);
    });
    it('calls secondary service and returns data when primary service throws errors', async () => {
        pmock.mockReturnValue(Promise.reject(new Error('')));
        smock.mockReturnValue(Promise.resolve(model));
        const retVal = await w.getWeather(city);
        expect(retVal).toStrictEqual(model);
        expect(pmock).toHaveBeenCalledTimes(1);
        expect(smock).toHaveBeenCalledTimes(1);
        expect(cmock).toHaveBeenCalledTimes(0);
    });
    it('calls cache service and returns data when primary and secondary service throw errors', async () => {
        pmock.mockReturnValue(Promise.reject(new Error('')));
        smock.mockReturnValue(Promise.reject(new Error('')));
        cmock.mockReturnValue(model);
        const retVal = await w.getWeather(city);
        expect(retVal).toStrictEqual(model);
        expect(pmock).toHaveBeenCalledTimes(1);
        expect(smock).toHaveBeenCalledTimes(1);
        expect(cmock).toHaveBeenCalledTimes(1);
    });
});