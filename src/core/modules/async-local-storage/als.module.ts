import {AsyncLocalStorageService} from './async-local-storage.service';
import {Module} from '@nestjs/common';
import {AsyncLocalStorage} from 'async_hooks';

@Module({
	providers: [
		AsyncLocalStorageService,
		{
			provide: AsyncLocalStorage,
			useValue: new AsyncLocalStorage(),
		},
	],
	exports: [AsyncLocalStorageService, AsyncLocalStorage],
})
export class AlsModule {}
