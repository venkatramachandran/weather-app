export default class NoDataFound extends Error {
    constructor(city: string) {
        super(`No weather data found for ${city}`);
    }
}