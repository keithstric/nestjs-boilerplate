import {AsyncLocalStorageService} from '@core/modules/async-local-storage/async-local-storage.service';
import {
	Inject,
	Injectable,
} from '@nestjs/common';

/**
 * This service is meant for the "Routes" services to extend. Its main goal is to allow for redundant processes to be
 * defined in a single place. For example, every GET request for every route does the exact same thing, with the exception
 * of what is actually fetched. The get method in this class allows you to add all that duplicate functionality here instead
 * of every route.
 */
@Injectable()
export abstract class AbstractRouteService {
	@Inject(AsyncLocalStorageService)
	private _als: AsyncLocalStorageService;

	protected constructor() {}

	get requestId(): string {
		return this._als.getValue<string>('requestId');
	}

	async get(id: string) {
		let returnVal: Record<string, any>;
		// do stuff...
		return returnVal;
	}

	async post(source: Record<string, any>, needRecordTypeId = false) {
		// do stuff...
		const id = undefined;
		return await this.get(id);
	}

	async patch(globalId: string, body: any) {
		// do stuff....
		const id = undefined;
		return await this.get(id);
	}
}
