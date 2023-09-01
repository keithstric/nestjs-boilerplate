import {ILocalStorage} from '@core/interfaces/async-local-storage.interface';
import {Injectable, NestMiddleware} from '@nestjs/common';
import {AsyncLocalStorage} from 'async_hooks';
import {NextFunction, Request, Response} from 'express';

@Injectable()
export class PopulateAlsMiddleware implements NestMiddleware {
	constructor(private readonly _als: AsyncLocalStorage<ILocalStorage>) {}

	use(req: Request, res: Response, next: NextFunction) {
		const store: ILocalStorage = {
			request: req,
			requestId: (req as any).id,
		};
		this._als.run(store, () => next());
	}
}
