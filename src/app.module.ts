import {CoreModule} from '@core/core.module';
import {RequestIdMiddleware} from '@core/middleware/request-id.middleware';
import {RequestLoggerMiddleware} from '@core/middleware/request-logger.middleware';
import {HttpModule} from '@nestjs/axios';
import {MiddlewareConsumer, Module, RequestMethod} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';

@Module({
	imports: [CoreModule, HttpModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(RequestIdMiddleware, RequestLoggerMiddleware).forRoutes({path: '/*', method: RequestMethod.ALL});
	}
}
