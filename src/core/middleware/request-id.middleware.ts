import {ICustomRequest} from '@core/interfaces/custom-request.interface';
import {Injectable, Logger, NestMiddleware} from '@nestjs/common';
import {NextFunction, Response} from 'express';
import {v4 as uuid} from 'uuid';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
	use(req: ICustomRequest, res: Response, next: NextFunction) {
		Logger.log(`*********************START REQUEST ${req.traceId}*********************`);
		req.id = uuid();
		next();
	}
}
