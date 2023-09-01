import {Module} from '@nestjs/common';
import {ConfigModule as NestConfigModule} from '@nestjs/config';
import {PackageJsonProvider} from './providers';
import {HttpModule} from '@nestjs/axios';
import {ConfigService} from './config.service';

@Module({
	imports: [
		NestConfigModule.forRoot({
			envFilePath: '.env',
			ignoreEnvFile: process.env.NODE_ENV !== 'local' && process.env.NODE_ENV !== 'test',
			isGlobal: true,
		}),
		HttpModule,
	],
	providers: [ConfigService, PackageJsonProvider],
	exports: [ConfigService],
})
export class ConfigModule {}
