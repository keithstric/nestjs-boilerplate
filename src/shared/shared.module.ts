import {HttpModule} from '@nestjs/axios';
import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';

@Module({
	imports: [ConfigModule, HttpModule],
	providers: [],
	exports: [],
})
export class SharedModule {}
