import {Provider} from '@nestjs/common';
import packageInfo from '@/package.json';

/**
 * Get `package.json` file content
 */
export const PackageJsonProvider: Provider<{[key: string]: any}> = {
	provide: 'PACKAGE_JSON_PROVIDER',
	useFactory: (): any => {
		return packageInfo;
	},
};
