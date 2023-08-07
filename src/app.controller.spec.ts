import {ConfigService} from '@core/modules/config/config.service';
import {HttpStatus} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {Response} from 'express';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {createMock} from '@golevelup/ts-jest';

describe('AppController', () => {
	let appController: AppController;
	const mockResponse = createMock<Response>();

	beforeAll(async () => {
		const app: TestingModule = await Test.createTestingModule({
			imports: [],
			controllers: [AppController],
			providers: [
				{provide: AppService, useValue: createMock<AppService>()},
				{provide: ConfigService, useValue: createMock<ConfigService>()},
			],
		}).compile();
		appController = app.get<AppController>(AppController);
	});

	it('should be defined"', () => {
		expect(appController).toBeDefined();
	});

	it('should call AppService.getProjectName', () => {
		const appSvcSpy = jest.spyOn((appController as any).appService, 'getProjectName');
		appController.getProjectName();
		expect(appSvcSpy).toHaveBeenCalled();
	});

	it('should call response.sendStatus with OK', () => {
		const sendStatusSpy = jest.spyOn(mockResponse, 'sendStatus');
		appController.ping(mockResponse);
		expect(sendStatusSpy).toHaveBeenCalledWith(HttpStatus.OK);
	});

	it('should call AppService.getAppVersion', () => {
		const appSvcSpy = jest.spyOn((appController as any).appService, 'getAppVersion');
		appController.version();
		expect(appSvcSpy).toHaveBeenCalled();
	});
});
