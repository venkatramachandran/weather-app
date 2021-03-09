import fetch from 'node-fetch';
import { mocked } from 'ts-jest/utils';
import PrimaryService from './PrimaryService';

jest.mock('node-fetch', () => {
    return jest.fn();
});

describe('PrimaryService', () => {
    let p: PrimaryService;
    beforeEach(() => {
        p = new PrimaryService('http://primary.host', 'apiKey');
        mocked(fetch).mockClear();
    })
    it('returns data when api invocation is successful', async () => {
        mocked(fetch).mockImplementation((): Promise<any> => {
            return Promise.resolve({
              json() {
                return Promise.resolve({
                    success: true,
                    current: {
                        temperature: -1,
                        wind_speed: -1
                    }
                });
              }
            });
          });
        const w = await p.getWeather('Test');
        expect(mocked(fetch).mock.calls[0]?.[0]).toBe('http://primary.host?access_key=apiKey&query=Test&units=m&language=en');
        expect(w).toStrictEqual({
            temperature_degrees: -1,
            wind_speed: -1
        })
    });
    it('throws when api invocation is unsuccessful', async () => {
        mocked(fetch).mockImplementation((): Promise<any> => {
            return Promise.reject(new Error('Simple'));
        });

        expect(() => p.getWeather('Test')).rejects.toThrowError('Simple');
        expect(mocked(fetch).mock.calls[0]?.[0]).toBe('http://primary.host?access_key=apiKey&query=Test&units=m&language=en');
    });
    it('throws when api invocation is successful, but the server returns error status', async () => {
        mocked(fetch).mockImplementation((): Promise<any> => {
            return Promise.resolve({
              json() {
                return Promise.resolve({
                    success: false,
                    error: {
                        info: 'Wrong Api Key'
                    }
                });
              }
            });
          });
        expect(() => p.getWeather('Test')).rejects.toThrowError('Wrong Api Key');
        expect(mocked(fetch).mock.calls[0]?.[0]).toBe('http://primary.host?access_key=apiKey&query=Test&units=m&language=en');
    });
});

