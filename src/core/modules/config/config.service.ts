import {Inject, Injectable} from '@nestjs/common';
import {ConfigService as NestConfigService} from '@nestjs/config';

@Injectable()
export class ConfigService {
	private readonly _cachedConfig: Map<string, any> = new Map<string, any>();
	private _packageJsonPrefix = 'package.json-';

	constructor(
		@Inject('PACKAGE_JSON_PROVIDER') private readonly _packageJson: any,
		private readonly _nestConfig: NestConfigService,
	) {}

	get currentConfig() {
		const returnVal = {};
		const keys = Array.from(this._cachedConfig.keys());
		keys.forEach(key => {
			returnVal[key] = this._cachedConfig.get(key);
		});
		return returnVal;
	}

	/**
	 * Get a configuration property that nest handles natively, for example
	 * values from `.env` or a configuration property that was previously
	 * cached
	 * @param key
	 */
	get<T>(key: string): T {
		let configVal = this._cachedConfig.get(key);
		if (!configVal) {
			configVal = this._nestConfig.get(key);
			this.set(key, configVal);
		}
		return configVal;
	}

	/**
	 * Add a configuration key/value to the configuration cache
	 * @param key
	 * @param value
	 */
	set(key: string, value: any) {
		this._cachedConfig.set(key, value);
	}

	/**
	 * Get a field value from `package.json`. Will add that value
	 * to the configuration cache
	 * @param key
	 */
	getPackageJsonVal(key: string): string {
		const cachedKey = key.startsWith(this._packageJsonPrefix) ? key : `${this._packageJsonPrefix}${key}`;
		if (!this._cachedConfig.has(cachedKey)) {
			this.set(cachedKey, this._packageJson[key]);
		}
		return this.get(cachedKey);
	}
}
