import {ILocalStorage} from '@core/interfaces/async-local-storage.interface';
import {Injectable} from '@nestjs/common';
import {AsyncLocalStorage} from 'async_hooks';

@Injectable()
export class AsyncLocalStorageService {
	constructor(private readonly _als: AsyncLocalStorage<ILocalStorage>) {}

	getValue<T>(storageKey: keyof ILocalStorage) {
		return this.getStorage()[storageKey] as T;
	}

	getStorage() {
		return this._als.getStore();
	}
}
