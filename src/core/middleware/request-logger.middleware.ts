import { ICustomRequest, ICustomResponse } from "@core/interfaces/custom-request-response.interface";
import { ConfigService } from "@core/modules/config/config.service";
import {LoggerService} from '@core/services/logger/logger.service';
import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";

/**
 * This is the request logging middleware. Implement logging for each request here
 */
@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
	constructor(private readonly _config: ConfigService) {}

	use(req: ICustomRequest, res: ICustomResponse, next: NextFunction) {
		const reqMsg = `Received a [${req.method}] request with requestId ${req.id} for path ${req.path} which matches route ${req.route.path}`;
		LoggerService.info(reqMsg, 'RequestLoggerMiddleware');
		// applyResponseBody(res);
		res.on('finish', () => {
			const resBody = res.responseBody;
			const status = res.statusCode;

			if (status >= 200 && status < 300) {
				const msg = `Successfully processed a [${req.method}] request for request ${req.id} using url ${req.url} which matches route ${req.route.path}`;
				LoggerService.info(msg, 'RequestLoggerMiddleware')
			}
			LoggerService.info(`*********************END ${req.method} REQUEST to ${req.url} with id ${req.id}*********************`, 'RequestLoggerMiddleware');
		});
		next();
	}
}

/**
 * This will add a responseBody field to the response so that we can get the body sent back
 * to the requester
 * @param res
 */
const applyResponseBody = (res: ICustomResponse) => {
	const rawResponse = res.write;
	const rawResponseEnd = res.end;
	const chunkBuffers = [];

	res.write = (...chunks: any[]) => {
		const resArgs = [];
		for (let i = 0; i < chunks.length; i++) {
			resArgs[i] = chunks[i];
			if (!resArgs[i]) {
				res.once('drain', res.write);
				i--;
			}
		}
		if (resArgs[0]) {
			chunkBuffers.push(Buffer.from(resArgs[0]));
		}
		return rawResponse.apply(res, resArgs);
	};

	res.end = (...chunk: any[]) => {
		const resArgs = [];
		for (let i = 0; i < chunk.length; i++) {
			resArgs[i] = chunk[i];
		}
		if (resArgs[0]) {
			chunkBuffers.push(Buffer.from(resArgs[0]));
		}
		res.responseBody = Buffer.concat(chunkBuffers).toString('utf8');
		rawResponseEnd.apply(res, resArgs);
		return res;
	}
}
