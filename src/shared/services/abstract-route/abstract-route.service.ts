import {AsyncLocalStorageService} from '@core/modules/async-local-storage/async-local-storage.service';
import {
	Inject,
	Injectable,
} from '@nestjs/common';

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
