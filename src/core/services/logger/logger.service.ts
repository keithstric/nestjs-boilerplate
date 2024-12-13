import {AsyncLocalStorageService} from '@core/modules';
import {LogEntry} from '@core/services/logger/log-entry';
import {LogLevel} from '@core/services/logger/logger.interface';
import {ConsoleTransport} from '@core/services/logger/transports/console.transport';
import {NestTransport} from '@core/services/logger/transports/nest.transport';
import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';

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

@Injectable()
export class LoggerService {
	private static _level: LogLevel;
	private static configTransports: string;
	private static _transports: any[];
	private static _exception: Error;

	constructor(
		@Inject(forwardRef(() => ConfigService)) private readonly config: ConfigService,
	) {
		const configLevel: string = config.get('LOG_LEVEL');
		LoggerService._level = LogLevel[configLevel] || LogLevel.INFO;
		LoggerService.configTransports = config.get('LOG_TRANSPORTS');
	}

	static get level() {
		return LoggerService._level;
	}

	static get exception() {
		return LoggerService._exception;
	}

	static get transports() {
		if (!this._transports) {
			const transports = [];
			const transportNames = LoggerService.configTransports?.split(',');
			transportNames.forEach((transportName: string) => {
				const transport = transportFactory.createTransport(transportName, LoggerService.level);
				transports.push(transport);
			});
			LoggerService._transports = transports;
		}
		return LoggerService._transports || [];
	}

	static error(message: string, error: Error, context?: string, ...params: any[]) {
		LoggerService._exception = error;
		LoggerService._writeLog(LogLevel.ERROR, message, context, ...params);
		LoggerService._exception = undefined;
	}

	static warn(message: string, context?: string, ...params: any[]) {
		LoggerService._writeLog(LogLevel.WARN, message, context, ...params);
	}

	static info(message: string, context?: string, ...params: any[]) {
		LoggerService._writeLog(LogLevel.INFO, message, context, ...params);
	}

	static debug(message: string, context?: string, ...params: any[]) {
		LoggerService._writeLog(LogLevel.DEBUG, message, context, ...params);
	}

	static silly(message: string, context?: string, ...params: any[]) {
		LoggerService._writeLog(LogLevel.SILLY, message, context, ...params);
	}

	static log(level: LogLevel, message: string, error?: Error, context?: string, ...params: any[]) {
		if (level === LogLevel.ERROR && error) {
			LoggerService._exception = error;
		}
		LoggerService._writeLog(level, message, context, ...params);
		LoggerService._exception = undefined;
	}

	private static _writeLog(level: LogLevel, message: string, context: string,...params: any[]) {
		if (level <= this.level) {
			const logEntry = new LogEntry(level, message, params, context, LoggerService.exception);
			this.transports.forEach(transport => {
				transport.log(logEntry);
			});
		}
	}
}
