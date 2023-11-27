import {Request, Response} from 'express';

/**
 * Use this interface instead of the express Request
 */
export interface ICustomRequest extends Request {
	id?: string;
	requestId?: string;
}

export interface ICustomResponse extends Response {
	responseBody?: any;
}
