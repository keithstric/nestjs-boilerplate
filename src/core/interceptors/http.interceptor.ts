import { CachingService } from "@core/modules/caching/caching.service";
import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import {ConfigService} from '@core/modules/config/config.service';

/**
 * Intercept each request before it is processed by a controller. You can modify the request here
 */
@Injectable()
export class HttpInterceptor implements NestInterceptor {
	@Inject(ConfigService)
	private _config: ConfigService;
	@Inject(CachingService)
	private _cache: CachingService;

	intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<any> {
		const req = context.switchToHttp().getRequest();
		const res = context.switchToHttp().getResponse();
		// Your logic here
		return next.handle();
	}
}
