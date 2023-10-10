export interface IRequestError {
	message?: string | string[];
	statusCode?: number;
	requestBody?: any;
	requestId?: string;
}
