import {ICustomRequest} from '@core/interfaces/custom-request.interface';
import {ConfigService} from '@core/modules/config/config.service';
import {Injectable, Logger, NestMiddleware} from '@nestjs/common';
import {NextFunction, Response} from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
	constructor(private readonly _config: ConfigService) {}

	use(req: ICustomRequest, res: Response, next: NextFunction) {
		res.on('finish', () => {
			const status = res.statusCode;
			if (status >= 200 && status < 300) {
				const msg = `Successfully processed a [${req.method}] request for request ${req.id} using url ${req.url} which matches route ${req.route.path}`;
				if (this._config.get('NODE_ENV') === 'local' || this._config.get('NODE_ENV') === 'test') {
					Logger.log(msg, 'RequestLoggerMiddleware');
				} else {
					// Add your custom logging here
					Logger.log(msg, 'RequestLoggerMiddleware')
				}
			}
			Logger.log(`*********************END REQUEST ${req.traceId}*********************`);
		});

		const reqMsg = `Received a [${req.method}] request with traceId ${req.traceId} for path ${req.path} which matches route ${req.route.path}`;
		Logger.log(reqMsg, 'RequestLoggerMiddleware');
		next();
	}
}
