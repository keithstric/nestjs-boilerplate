import {HttpModule} from '@nestjs/axios';
import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import { AbstractRouteService } from "@shared/services";

@Module({
	imports: [ConfigModule, HttpModule],
	providers: [],
	exports: [AbstractRouteService],
})
export class SharedModule {}
