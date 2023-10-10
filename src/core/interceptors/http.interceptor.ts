import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {Observable} from 'rxjs';

/**
 * Intercept each request before it is processed by a controller. You can modify the request here
 */
@Injectable()
export class HttpInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<any> {
		const req = context.switchToHttp().getRequest();
		// Your logic here
		return next.handle();
	}
}
