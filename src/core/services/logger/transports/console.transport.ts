import {LogEntry} from '@core/services/logger/log-entry';
import {LogLevel, LogLevelMap} from '@core/services/logger/logger.interface';
import {AbstractTransport} from '@core/services/logger/transports/abstract-transport';

export class ConsoleTransport extends AbstractTransport {
	constructor(level: LogLevel) {
		super(level);
	}

	log(logEntry: LogEntry) {
		const consoleMethod = this._getConsoleMethod(logEntry.level);
		consoleMethod(`${this.name}: ${logEntry.message}`, ...logEntry.params);
	}

	private _getConsoleMethod(level: LogLevel) {
		if (level === LogLevel.SILLY) {
			return console.log;
		}
		return console[LogLevelMap[level]];
	}
}
