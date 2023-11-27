## Config Service Providers

Here is where you can define things like Google or Kubernetes Secret connections, items that need to be fetched during bootstrapping, etc. Each one should be it's own `*.provider.ts` and return whatever api is used to get the information. This provider should then be included in the `config.service.ts` file with it's own method of getting values and it's own prefix if the values in your provider may conflict with values from other providers.

