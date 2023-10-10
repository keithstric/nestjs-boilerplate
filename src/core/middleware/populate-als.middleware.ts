import { ICustomRequest } from "@/src/core";
import {ILocalStorage} from '@core/interfaces/async-local-storage.interface';
import {Injectable, NestMiddleware} from '@nestjs/common';
import {AsyncLocalStorage} from 'async_hooks';
import {NextFunction, Response} from 'express';

/**
 * This populates the async local storage with request information for each request
 */
@Injectable()
export class PopulateAlsMiddleware implements NestMiddleware {
	constructor(private readonly _als: AsyncLocalStorage<ILocalStorage>) {}

	use(req: ICustomRequest, res: Response, next: NextFunction) {
		const store: ILocalStorage = {
			request: req,
			requestId: req.id,
		};
		this._als.run(store, () => next());
	}
}
