import {ILocalStorage} from '@core/interfaces/async-local-storage.interface';
import {Injectable} from '@nestjs/common';
import {AsyncLocalStorage} from 'async_hooks';

/**
 * This is the async local storage service. Used to provide context to downstream classes and methods
 * so that request, request properties or other items available during a request don't need to be
 * passed down the execution stack
 * @example
 * ```
 * @Injectable()
 * export class SomeService {
 *   constructor(private readonly _als: AsyncLocalStorageService) {}
 *
 *   someFunction() {
 *     const requestId = this._als.getValue<string>('requestId');
 *   }
 * }
 * ```
 */
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
