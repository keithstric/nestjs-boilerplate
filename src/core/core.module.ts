import {CachingModule} from "@core/modules/caching/caching.module";
import {AlsModule, ConfigModule} from '@core/modules';
import {LoggerService} from '@core/services/logger/logger.service';
import {Module} from '@nestjs/common';

@Module({
	imports: [AlsModule, ConfigModule, CachingModule],
	providers: [LoggerService],
	exports: [AlsModule, ConfigModule, CachingModule, LoggerService],
})
export class CoreModule {}
