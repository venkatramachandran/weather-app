import fetch from 'node-fetch';
import { mocked } from 'ts-jest/utils';
import Logger from './Logger';
import SecondaryService from './SecondaryService';

jest.mock('node-fetch', () => {
    return jest.fn();
});

describe('SecondaryService', () => {
    let s: SecondaryService;
    beforeEach(() => {
        s = new SecondaryService('http://secondary.host', 'apiKey', new Logger('test', 60));
        mocked(fetch).mockClear();
    })
    it('returns data when api invocation is successful', async () => {
        mocked(fetch).mockImplementation((): Promise<any> => {
            return Promise.resolve({
              json() {
                return Promise.resolve({
                    main: {
                        temp: -1
                    },
                    wind: {
                        speed: -1
                    }
                });
              }
            });
          });
        const w = await s.getWeather('Test');
        expect(mocked(fetch).mock.calls[0]?.[0]).toBe('http://secondary.host?appid=apiKey&q=Test&units=metric');
        expect(w).toStrictEqual({
            temperature_degrees: -1,
            wind_speed: -3.6
        })
    });
    it('throws when api invocation is unsuccessful', async () => {
        mocked(fetch).mockImplementation((): Promise<any> => {
            return Promise.reject(new Error('Simple'));
        });

        expect(() => s.getWeather('Test')).rejects.toThrowError('Simple');
        expect(mocked(fetch).mock.calls[0]?.[0]).toBe('http://secondary.host?appid=apiKey&q=Test&units=metric');
    });
});
