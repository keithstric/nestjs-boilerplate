import {Request} from 'express';

export interface ILocalStorage {
	request: Request;
	requestId: string;
}
