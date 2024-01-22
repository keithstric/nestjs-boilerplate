import { CachingService } from "@core/modules/caching/caching.service";
import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { Request, Response } from "express";
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
		const req: Request = context.switchToHttp().getRequest();
		const res: Response = context.switchToHttp().getResponse();
		// Your logic here
		return next.handle();
	}
}
