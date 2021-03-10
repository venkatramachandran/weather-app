import express, { Express, Request, Response} from "express";
import { injectable } from "tsyringe";
import Logger from "./Logger";
import WeatherService from "./WeatherService";

@injectable()
export default class Server {
    private app: Express;
    constructor(private weatherService: WeatherService, private log: Logger) {
        this.app = express();
        this.init();
    }
    private init() {
        this.app.get( "/v1/weather", async (req: Request, res: Response) => {
            const city = req.query["city"];
            if (!city || !(typeof city === 'string')) {
                res.status(400).json({
                    message: 'Missing required query param: city'
                });
            } else {
                const w = await this.weatherService.getWeather(city);
                this.log.trace(`got response from service as ${JSON.stringify(w)}`);
                res.status(200).json(w);
            }
        });
    }
    public start(port: number) {
        this.app.listen(port, () => {
            console.log(`started server on port ${port}`);
        });
    }
}
