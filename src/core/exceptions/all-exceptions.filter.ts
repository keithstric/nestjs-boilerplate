import {ICustomRequest, IRequestError} from '@/src/core';
import {ArgumentsHost, ExceptionFilter, HttpException, HttpStatus, InternalServerErrorException} from '@nestjs/common';
import {Response} from 'express';
import {ConfigService} from '@core/modules';

/**
 * Catch all exceptions and return a custom error object back to the requester. Once the response is finished
 * include your logging solution to log the error
 */
export class AllExceptionsFilter implements ExceptionFilter {
	constructor(private readonly _config: ConfigService) {}

	catch(exception: InternalServerErrorException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const req = ctx.getRequest<ICustomRequest>();
		const res = ctx.getResponse<Response>();

		const isHttpException = exception instanceof HttpException;
		const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
		const errorResponseBody: IRequestError = {
			message: exception.message,
			statusCode: res.statusCode,
			requestBody: req.body,
			requestId: req.id,
		};
		// send error back to requester
		res.status(status).json(errorResponseBody);

		res.on('finish', () => {
			// log the error here
		});
	}
}
