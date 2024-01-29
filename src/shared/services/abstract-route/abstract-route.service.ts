import {AsyncLocalStorageService} from '@core/modules/async-local-storage/async-local-storage.service';
import {Inject, Injectable} from '@nestjs/common';

/**
 * This service is meant for the "src/routes" services to extend. Its main goal is to allow for redundant processes to be
 * defined in a single place. For example, every GET request for every route does the exact same thing, with the exception
 * of what is actually fetched. The get method in this class allows you to add all that duplicate functionality here instead
 * of every route.
 */
@Injectable()
export abstract class AbstractRouteService {
	@Inject(AsyncLocalStorageService)
	private _als: AsyncLocalStorageService;

	/*
	START Request Lifecycle Method Definitions
	This block of optional methods are for handling custom code during the processing
	of requests. This helps prevent the need of having to implement custom post, get, put and patch
	methods. Naming is: pre<MethodName> = runs before code in method. post<MethodName> runs after
	all the code in the method.
	Add any other methods that may be required for processing requests
	 */
	// GET lifecycle
	preGet?<T>(id: string): T;
	postGet?<T>(id: string, returnedRecord: Record<string, any>): T;
	// POST lifecycle
	prePost?<T>(reqBody: any): T;
	postPost?<T>(reqBody: any, createdRecord: Record<string, any>): T;
	// PATCH lifecycle
	prePatch?<T>(id: string, reqBody: any): T;
	postPatch?<T>(id: string, reqBody: any, updatedRecord: Record<string, any>): T;
	// PUT lifecycle
	prePut?<T>(id: string, reqBody: any): T;
	postPut?<T>(id: string, reqBody: any, updatedRecord: Record<string, any>): T;
	/* END Lifecycle Method Definitions */

	protected constructor() {}

	get requestId(): string {
		return this._als.getValue<string>('requestId');
	}

	async get(id: string) {
		const preGetVal = this.preGet?.(id);
		let returnVal: Record<string, any>;
		// do stuff...
		returnVal = this.postGet?.(id, returnVal);
		return returnVal;
	}

	async post(body: Record<string, any>) {
		const prePostVal = this.prePost?.(body);
		// do stuff...
		const id = undefined;
		let returnVal = this.get(id);
		returnVal = this.postPost?.(body, returnVal);
		return returnVal;
	}

	async patch(id: string, body: any) {
		const prePatchVal = this.prePatch?.(id, body);
		// do stuff....
		let returnVal = await this.get(id);
		returnVal = this.postPatch(id, body, returnVal);
		return returnVal;
	}

	async put(id: string, body: any) {
		const prePutVal = this.prePut?.(id, body);
		// do stuff
		let returnVal = await this.get(id);
		returnVal = this.postPut(id, body, returnVal);
		return returnVal;
	}
}
