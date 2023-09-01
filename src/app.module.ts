import {AlsModule, CoreModule, PopulateAlsMiddleware, RequestIdMiddleware, RequestLoggerMiddleware} from '@/src/core';
import {HttpModule} from '@nestjs/axios';
import {MiddlewareConsumer, Module, RequestMethod} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';

@Module({
	imports: [AlsModule, CoreModule, HttpModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(RequestIdMiddleware, RequestLoggerMiddleware, PopulateAlsMiddleware)
			.forRoutes({path: '/*', method: RequestMethod.ALL});
	}
}
