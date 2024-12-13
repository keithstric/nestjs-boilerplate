import {LogEntry} from '@core/services/logger/log-entry';
import {LogLevel} from '@core/services/logger/logger.interface';
import {AbstractTransport} from '@core/services/logger/transports/abstract-transport';
import {Logger} from '@nestjs/common';

export class NestTransport extends AbstractTransport {
	constructor(level: LogLevel) {
		super(level);
	}

	log(logEntry: LogEntry) {
		const context = logEntry.context || 'NestTransport.log';
		const params = logEntry.params;
		let msg = logEntry.message;
		if (params?.length) {
			msg = `${msg}, ${JSON.stringify(logEntry.params, null, 2)}`
		}
		switch (logEntry.level) {
			case LogLevel.ERROR:
				Logger.error(msg, logEntry.error.stack)
				break;
			case LogLevel.WARN:
				Logger.warn(msg, context);
				break;
			case LogLevel.INFO:
				Logger.log(msg, context);
				break;
			case LogLevel.DEBUG:
				Logger.debug(msg, context)
				break;
			case LogLevel.SILLY:
				Logger.log(msg, context);
				break;
		}
	}
}
