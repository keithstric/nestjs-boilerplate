import {ConfigModule} from '@core/modules/config/config.module';
import {HttpModule} from '@nestjs/axios';
import {Module} from '@nestjs/common';

@Module({
	imports: [ConfigModule, HttpModule],
	providers: [],
	exports: [],
})
export class SharedModule {}
