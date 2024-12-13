import {LogEntry} from '@core/services/logger/log-entry';
import {LogLevel} from '@core/services/logger/logger.interface';

export abstract class AbstractTransport {
	protected constructor(public level: LogLevel) {}

	get name() {
		return this.constructor.name;
	}

	protected abstract log(logEntry: LogEntry);
}
