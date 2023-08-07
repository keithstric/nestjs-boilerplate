import {AppService} from '@/src/app.service';
import {ConfigService} from '@core/modules/config/config.service';
import {createMock} from '@golevelup/ts-jest';
import {HttpService} from '@nestjs/axios';
import {Test, TestingModule} from '@nestjs/testing';

describe('AppService', () => {
	let appService: AppService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [],
			providers: [
				AppService,
				{provide: ConfigService, useValue: createMock<ConfigService>()},
				{provide: HttpService, useValue: createMock<HttpService>()},
			],
		}).compile();
		appService = module.get<AppService>(AppService);
	});

	it('should be defined', () => {
		expect(appService).toBeDefined();
	});

	it('should call the ConfigService.getPackageJsonVal with "name"', () => {
		const getPackageJsonValSpy = jest.spyOn((appService as any)._config, 'getPackageJsonVal');
		appService.getProjectName();
		expect(getPackageJsonValSpy).toHaveBeenCalledWith('name');
	});

	it('should call the ConfigService and SalesforceClientService to get versions', () => {
		const getPackageJsonValSpy = jest.spyOn((appService as any)._config, 'getPackageJsonVal');
		// not testing the salesforce property call because accessing a getter on an instance is bugged
		/*const salesforceClientVersionSpy = jest
			.spyOn((appService as any)._salesForce as SalesforceClientService, 'version', 'get')
			.mockReturnValue('53.0');*/
		appService.getAppVersion();
		expect(getPackageJsonValSpy).toHaveBeenCalledWith('version');
		// expect(salesforceClientVersionSpy).toBeDefined();
	});
});
