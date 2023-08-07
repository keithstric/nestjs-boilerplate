import {ConfigService} from '@core/modules/config/config.service';
import {HttpService} from '@nestjs/axios';
import {Injectable} from '@nestjs/common';

@Injectable()
export class AppService {
	constructor(
		private readonly _config: ConfigService,
		private readonly _http: HttpService,
	) {}

	getProjectName(): string {
		return this._config.getPackageJsonVal('name');
	}

	getAppVersion() {
		const appVersion = this._config.getPackageJsonVal('version');
		return {
			appVersion,
		};
	}

	getAppInfo() {
		return this._config.currentConfig;
	}
}
