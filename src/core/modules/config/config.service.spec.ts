import { CachingModule } from "@core/modules/caching/caching.module";
import {PackageJsonProvider} from '@core/modules/config/providers';
import {createMock} from '@golevelup/ts-jest';
import {HttpService} from '@nestjs/axios';
import {Test, TestingModule} from '@nestjs/testing';
import {ConfigService} from './config.service';
import {ConfigModule as NestConfigModule, ConfigService as NestConfigService} from '@nestjs/config';

describe('ConfigService', () => {
	let configService: ConfigService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [NestConfigModule.forRoot({isGlobal: true}), CachingModule],
			providers: [
				NestConfigService,
				ConfigService,
				PackageJsonProvider,
				{provide: HttpService, useValue: createMock<HttpService>()},
			],
		}).compile();

		configService = module.get<ConfigService>(ConfigService);
	});

	it('should be defined', () => {
		expect(configService).toBeDefined();
	});

	describe('package.json', () => {
		beforeEach(() => {
			(configService as any)._cache.flushAll();
		});

		it('should get values from package.json', () => {
			const packageJsonKey = 'name';
			const packageJsonName = configService.getPackageJsonVal(packageJsonKey);
			expect(packageJsonName).toBe('nestjs-boilerplate');
		});

		it('should cache values it receives', () => {
			const packageJsonKey = 'version';
			configService.getPackageJsonVal(packageJsonKey);
			const cacheKey = `${(configService as any)._packageJsonPrefix}${packageJsonKey}`;
			expect((configService as any)._cache.hasKey(cacheKey)).toBe(true);
		});
	});
});
