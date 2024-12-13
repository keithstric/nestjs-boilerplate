import {LogLevel} from '@core/services/logger/logger.interface';

export class LogEntry {
	constructor(public level: LogLevel, public message: string, public params: any[], public context?: string, public error?: Error) {}

	toJson() {
		return JSON.parse(this.toString())
	}

	toString() {
		return JSON.stringify(this);
	}

	toFormattedString() {
		return JSON.stringify(this, null, 2);
	}
}
