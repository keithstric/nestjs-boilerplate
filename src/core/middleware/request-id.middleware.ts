import {ICustomRequest} from '@core/interfaces/custom-request-response.interface';
import {LoggerService} from '@core/services/logger/logger.service';
import {Injectable, Logger, NestMiddleware} from '@nestjs/common';
import {NextFunction, Response} from 'express';
import {v4 as uuid} from 'uuid';

/**
 * This is the request id middleware. Will add a uuid to every request for
 * debugging and logging purposes
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
	use(req: ICustomRequest, res: Response, next: NextFunction) {
		req.id = uuid();
		LoggerService.info(`*********************START ${req.method} REQUEST to to ${req.url} with id ${req.id}*********************`, 'RequestIdMiddleware');
		next();
	}
}
