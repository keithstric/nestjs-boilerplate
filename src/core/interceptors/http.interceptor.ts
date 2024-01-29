import { CachingService } from "@core/modules/caching/caching.service";
import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
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

	async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<any> {
		// code here runs before the controller method
		const httpCtx = context.switchToHttp();
		const req = httpCtx.getRequest();
		const res = httpCtx.getResponse();
		const controllerClassname = context.getClass().name; // a reference only, NOT an instance

		// Your logic here
		return next.handle();
		// If you use the below pattern, can run code AFTER the controller method
		// return next.handle().pipe()
	}
}
