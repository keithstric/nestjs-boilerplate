import {ICustomRequest} from '@core/interfaces/custom-request-response.interface';
import {createParamDecorator, ExecutionContext} from '@nestjs/common';

/**
 * Use the @RequestId() decorator in controllers to get the request.id
 * @example
 * ```
 * @Get('/:id')
 * getObject(@Param('id') id: string, @RequestId() requestId: string) {...}
 * ```
 */
export const RequestId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request: ICustomRequest = ctx.switchToHttp().getRequest();
	return request.id;
});
