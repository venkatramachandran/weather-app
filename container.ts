import "reflect-metadata";
import dotenv from 'dotenv';
import {container} from 'tsyringe';

const config = dotenv.config();

Object.keys(config.parsed!).forEach((k: string) => {
    container.register(k, {useValue: config.parsed![k]});
});
