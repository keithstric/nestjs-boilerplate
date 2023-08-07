import {Request} from 'express';

/**
 * Use this interface instead of the express Request
 */
export interface ICustomRequest extends Request {
	id?: string;
	traceId?: string;
}
