export interface IRequestError {
	message?: string | string[];
	statusCode?: number;
	sobject?: any;
	requestBody?: any;
	errorCode?: string | string[];
	fields?: string | string[];
	referenceId?: string;
	requestId?: string;
}
