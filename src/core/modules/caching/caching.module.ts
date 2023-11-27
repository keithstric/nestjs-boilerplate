import { CachingService } from "@core/modules/caching/caching.service";
import { cacheProvider } from "@core/modules/caching/providers/cache.provider";
import { Module } from "@nestjs/common";

@Module({
  imports: [],
  providers: [cacheProvider, CachingService],
  exports: [CachingService]
})
export class CachingModule {}
