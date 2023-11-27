import { Provider } from "@nestjs/common";

export const cacheProvider: Provider<Map<string, any>> = {
  provide: `CACHE_PROVIDER`,
  useFactory: (): Map<string, any> => {
    return new Map<string, any>();
  }
}
