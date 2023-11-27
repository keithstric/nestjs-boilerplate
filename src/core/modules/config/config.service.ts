import { CachingService } from "@core/modules/caching/caching.service";
import {Inject, Injectable} from '@nestjs/common';
import {ConfigService as NestConfigService} from '@nestjs/config';

/**
 * This service will retrieve and cache all environment variables and package.json values. Other
 * items that should go here would be GoogleSecretManager implementation or any other "configuration"
 * variable providers
 * @example
 * ```
 * @Injectable()
 * export class SomeService {
 *   constructor(private readonly _config: ConfigService) {}
 *
 *   someFunction() {
 *     const nodeEnv = this._config.get<string>('NODE_ENV');
 *     const packageVersion = this._config.getPackageJsonVal('version');
 *   }
 * }
 * ```
 */
@Injectable()
export class ConfigService {
	private _packageJsonPrefix = 'package.json-';

	constructor(
		@Inject('PACKAGE_JSON_PROVIDER') private readonly _packageJson: any,
		private readonly _nestConfig: NestConfigService,
		private readonly _cache: CachingService,
	) {}

	get currentConfig() {
		const returnVal = {};
		const keys = this._cache.keys;
		keys.forEach(key => {
			returnVal[key] = this._cache.get(key);
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
		let configVal = this._cache.get(key);
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
		this._cache.set(key, value);
	}

	/**
	 * Get a field value from `package.json`. Will add that value
	 * to the configuration cache
	 * @param key
	 */
	getPackageJsonVal(key: string): string {
		const cachedKey = key.startsWith(this._packageJsonPrefix) ? key : `${this._packageJsonPrefix}${key}`;
		if (!this._cache.hasKey(cachedKey)) {
			this.set(cachedKey, this._packageJson[key]);
		}
		return this.get(cachedKey);
	}
}
