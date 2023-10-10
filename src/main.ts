import 'dotenv/config';
import {AllExceptionsFilter} from '@core/exceptions';
import {HttpInterceptor} from '@core/interceptors';
import {ConfigService} from '@core/modules';
import {INestApplication, Logger, ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import { useContainer } from "class-validator";
import helmet from 'helmet';
import {AppModule} from './app.module';

/**
 * Setup the OpenApi documentation for each route
 * @param app
 * @param configService
 */
function setupSwagger(app: INestApplication, configService: ConfigService) {
	Logger.log('Setting up OpenApi for the / route. OpenApi docs at /api/app', 'main.ts.setupSwagger');
	const appSwaggerConfig = new DocumentBuilder()
		.setTitle(`${configService.getPackageJsonVal('name')}`)
		.setDescription(`${configService.getPackageJsonVal('description') || ''}`)
		.setVersion(configService.get('version'))
		.build();
	const document = SwaggerModule.createDocument(app, appSwaggerConfig);
	SwaggerModule.setup('api/app', app, document);
}

/**
 * Bootstrap the application
 */
async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	// Since config module was initialized above, we get the config service
	const configService = app.get(ConfigService);
	setupSwagger(app, configService);
	// Enable CORS if running locally to allow other services to call this service
	if (configService.get('NODE_ENV') === 'local') {
		app.enableCors();
	}
	// Disable etag caching
	app.getHttpAdapter().getInstance().set('etag', false);
	app.use(helmet({contentSecurityPolicy: false}));
	// Setup exception filters. Priority is from right to left. AllExceptionsFilter should be last so
	// specific error filters are executed properly
	app.useGlobalFilters(new AllExceptionsFilter(configService));
	// Enable DTO request payload validation
	app.useGlobalPipes(new ValidationPipe({transform: true}));
	// Add the http interceptor
	app.useGlobalInterceptors(new HttpInterceptor());
	// Allow injection of dependencies to class-validator custom constraint classes
	useContainer(app.select(AppModule), {fallbackOnErrors: true});
	// Start listening for requests on port 3000 or provided PORT environment variable
	await app.listen(configService.get('PORT') || 3000, '0.0.0.0');
	Logger.log(`NestJS App bootstrapped and listening on ${await app.getUrl()}`, 'main.ts.bootstrap');
}
bootstrap();

/**
 * Console log any uncaught exceptions
 */
process.on('uncaughtException', err => {
	console.error(`[salesforce-sor] Uncaught Exception occurred:`, err);
});

/**
 * Console log any unhandled rejections (not sure what this one actually is)
 */
process.on('unhandledRejection', err => {
	console.error('[salesforce-sor] Unhandled Rejection occurred:', err);
});
