import {ConfigModule} from '@core/modules/config/config.module';
import {Module} from '@nestjs/common';

@Module({
	imports: [ConfigModule],
	exports: [ConfigModule],
})
export class CoreModule {}
