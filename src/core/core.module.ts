import {CachingModule} from "@core/modules/caching/caching.module";
import {AlsModule, ConfigModule} from '@core/modules';
import {Module} from '@nestjs/common';

@Module({
	imports: [AlsModule, ConfigModule, CachingModule],
	providers: [],
	exports: [AlsModule, ConfigModule, CachingModule],
})
export class CoreModule {}
