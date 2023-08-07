import 'dotenv/config';
import {ConfigService} from '@core/modules/config/config.service';
import {Logger} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import helmet from 'helmet';
import {AppModule} from './app.module';

/**
 * Bootstrap the application
 */
async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	// Since config module was initialized above, we get the config service
	const configService = app.get(ConfigService);
	// Setup swagger
	const swaggerConfig = new DocumentBuilder()
		.setTitle(`${configService.getPackageJsonVal('name')}`)
		.setDescription(`${configService.getPackageJsonVal('description') || ''}`)
		.setVersion(configService.get('version'))
		.build();
	const document = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('openapi', app, document);
	// Enable CORS if running locally to allow other services to call this service
	if (configService.get('NODE_ENV') === 'local') {
		app.enableCors();
	}
	// Disable etag caching
	app.getHttpAdapter().getInstance().set('etag', false);
	app.use(helmet({contentSecurityPolicy: false}));
	await app.listen(configService.get('PORT') || 3000, '0.0.0.0');
	Logger.log(
		`NestJS App bootstrapped and listening on ${await app.getUrl()}`,
		'main.ts.bootstrap',
	);
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
