import {AlsModule, ConfigModule} from '@core/modules';
import {Module} from '@nestjs/common';

@Module({
	imports: [AlsModule, ConfigModule],
	exports: [AlsModule, ConfigModule],
})
export class CoreModule {}
