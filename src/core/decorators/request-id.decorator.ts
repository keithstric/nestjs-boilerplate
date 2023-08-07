import {ICustomRequest} from '@core/interfaces/custom-request.interface';
import {createParamDecorator, ExecutionContext} from '@nestjs/common';

export const RequestId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request: ICustomRequest = ctx.switchToHttp().getRequest();
	return request.id;
});
