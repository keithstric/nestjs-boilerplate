import {AlsModule} from '@core/modules/async-local-storage/als.module';
import {createMock} from '@golevelup/ts-jest';
import {Injectable} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {AbstractRouteService} from '@shared/services/abstract-route/abstract-route.service';

describe('AbstractRouteService', () => {
	let abstractRouteService: AbstractRouteService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AlsModule],
			providers: [MockRouteService],
		}).compile();
		abstractRouteService = module.get(MockRouteService);
	});

	beforeEach(() => {
		jest.spyOn((abstractRouteService as any)._als, 'getStorage').mockReturnValue({
			traceId: '321',
			requestId: '123',
			request: createMock<Request>(),
		});
	});

	it('should be defined', () => {
		expect(abstractRouteService).toBeDefined();
	});
});

@Injectable()
class MockRouteService extends AbstractRouteService {
	constructor() {
		super();
	}
}
