# Logger Service

The logger service is a static class for logging to various "transports". This logger mimics some of the functionality of and basic principle of the [Winston Logger](https://github.com/winstonjs/winston).

## Logging level theory

The logging levels are determined by an enum defined in the `logger.interface.ts` file. This enum does not define string values for the levels and the order of those levels is important. For example, if you define a `LOG_LEVEL` of `info`. The value of `info` is 2. So any logging events with a level of `info`(2), `warn`(1) or `error`(0) will be logged (LogLevel <= LOG_LEVEL).

## Configuration

To configure the logger, you will need to define 2 environment variables in your `.env` file.

Example `.env`
```text
LOG_LEVEL=INFO
LOG_TRANSPORTS=console,nest
```
For LOG_LEVEL you can use any of the log levels (ERROR,WARN,INFO,DEBUG,SILLY). The LOG_TRANSPORTS is a comma separated list (mind the spaces) of the transport or transports you want your logger to use.

### Transports

A Transport is responsible for sending logs to different places. You can define multiple transports and each log entry will be sent to each transport. The boilerplate includes a console transport which will use the console log to report log messages. It also includes a nest transport which uses the NestJs Logger. If you have custom needs you can create your own transport which extends `AbstractTransport`.

Once your custom transport is created, you will need to update the transport factory in `/src/core/services/logger/logger.service.ts`. Just add your new transport to the `transports` property in the factory.

```typescript
const transportFactory = {
	transports: {
		console: ConsoleTransport,
		nest: NestTransport,
	},
	createTransport: function(name: string, level: LogLevel) {
		const clazz = this.transports[name];
		return new clazz(level);
	},
};
```

## Log Entry (log-entry.ts)

A Log Entry is processed by a transport. It contains the message, context (i.e. ClassName.MethodName), log level, and any error that may have caused the logging message.

## Usage

There are multiple ways to use the logger, you can call `LoggerService.<LogLevel>(<msg>, <context>, param1, param2, ...)` or `LoggerService.log(LogLevel.<level>, <msg>, <error>, <context>, param1, param2, ...)`. You can include any number of parameters (param).

Here are some example usages of the logger:

```typescript
class SomeClass {
    someMethod() {
        const someObj = {foo: 'bar', bar: 'baz'};
        const someOtherObj = {baz: 'bar', bar: 'foo'};
        const err = new Error('Some error');
        LoggerService.info('an info message', 'SomeClass.someMethod', someObj);
        LoggerService.debug('a debug message', 'SomeClass.someMethod', someObj, someOtherObj);
        LoggerService.error('some error occurred', err, 'SomeClass.someMethod', someObj);
        LoggerService.log(LogLevel.ERROR, err.message, err, 'SomeClass.someMethod');
    }
}
```
