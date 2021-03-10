import "reflect-metadata";
import "./container";
import Server from './server';
import {container} from 'tsyringe';

const port = container.resolve<number>('port');
container.resolve(Server).start(port);
