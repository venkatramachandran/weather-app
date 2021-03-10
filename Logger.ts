import "reflect-metadata";
import bunyan from 'bunyan';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class Logger {
    private logger: bunyan;
    constructor(@inject('app_name') name: string, @inject('log_level') level: number) {
        this.logger = bunyan.createLogger({name, level: +level});
    }

    public info(message: string) {
        this.logger.info(message);
    }
    public trace(message: string) {
        this.logger.trace(message);
    }
    public warn(message: string) {
        this.logger.warn(message);
    }
    public fatal(message: string) {
        this.logger.fatal(message);
    }
}