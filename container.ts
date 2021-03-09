import "reflect-metadata";
import dotenv from 'dotenv';
import {container} from 'tsyringe';

const config = dotenv.config();

const configKeys = ['primary_api_url', 'primary_api_key', 'secondary_api_url', 'secondary_api_key', 'cache_time_millis'];
configKeys.forEach((k: string) => {
    container.register(k, {useValue: config.parsed![k]});
});
