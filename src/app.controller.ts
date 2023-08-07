import {AppService} from '@/src/app.service';
import {Controller, Get, HttpStatus, Res} from '@nestjs/common';
import {ApiOperation, ApiResponse} from '@nestjs/swagger';
import {Response} from 'express';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	/**
	 * Added by NestJS when the app was created. Left it here
	 * mainly just as a way to get the name of the application
	 */
	@Get()
	@ApiOperation({summary: 'This endpoint will return the application name from package.json'})
	@ApiResponse({
		status: 200,
		description: 'Name of project from package.json',
	})
	getProjectName(): string {
		return this.appService.getProjectName();
	}

	/**
	 * Returns 'OK' with a status of 200. Mainly to check api is alive
	 * @param res
	 */
	@Get('ping')
	@ApiOperation({summary: 'This endpoint will return an Http OK response. Used for determining if api is up'})
	@ApiResponse({
		status: 200,
		description: 'Http OK',
	})
	ping(@Res() res: Response): Response {
		return res.sendStatus(HttpStatus.OK);
	}

	/**
	 * Reports the version from package.json and the Salesforce client
	 */
	@Get('version')
	@ApiOperation({summary: 'This endpoint will return the version from package.json'})
	@ApiResponse({
		status: 200,
		description: `version from package.json and Salesforce api version`,
	})
	version(): any {
		return this.appService.getAppVersion();
	}

	/**
	 * Gets all the cached configuration values from the config service
	 */
	@Get('currentConfig')
	@ApiOperation({summary: 'This endpoint will return all the cached configuration variables from the config service'})
	@ApiResponse({
		status: 200,
		description: 'Cached configuration values',
	})
	currentConfig(): any {
		return this.appService.getAppInfo();
	}
}
