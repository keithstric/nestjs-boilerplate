import {FsDataService} from '@core/decorators';
import {Iv2} from '@core/interfaces';
import {AlsModule} from '@core/modules/async-local-storage/als.module';
import {FirebaseModule} from '@core/modules/firebase/firebase.module';
import {FirestoreDataService} from '@core/modules/firebase/firestore-data.service';
import {createMock} from '@golevelup/ts-jest';
import {Injectable} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {AbstractRouteService} from '@shared/services/abstract-route/abstract-route.service';
import {AtlasTransformService} from '@shared/services/atlas-transform/atlas-transform.service';
import {SalesforceService} from '@shared/services/salesforce/salesforce.service';
import jlConfigDoc from '@testing/mocks/job-lead-config-doc.mock.json';
import sfDoc from '@testing/mocks/custom-contract-SF-POST-response.json';
import jlGAIM from '@testing/mocks/job-lead-gaim-payload.mock.json';
import jlTranlateResult from '@testing/mocks/job-lead-patch-translation-result.mock.json';
import jlRequestPayload from '@testing/mocks/job-lead-sf-payload.mock.json';
import ciPatchPayload from '@testing/mocks/client-interview-gaim-patch-payload.mock.json';

describe('AbstractRouteService', () => {
	let abstractRouteService: AbstractRouteService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [FirebaseModule.forRoot(), AlsModule],
			providers: [
				MockRouteService,
				{provide: SalesforceService, useValue: createMock<SalesforceService>()},
				{provide: AtlasTransformService, useValue: createMock<AtlasTransformService>()},
			],
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

	it('should set the config document', async () => {
		jest.spyOn((abstractRouteService as any)._absConfigsDs, 'getSubCollectionDoc').mockReturnValue(jlConfigDoc);
		await (abstractRouteService as any).getConfig('job-lead');
		expect((abstractRouteService as any)._config).toBeTruthy();
	});

	/*it('should throw an error if no config is present', () => {
		jest.spyOn((abstractRouteService as any)._absConfigsDs, 'getSubCollectionDoc').mockReturnValue(undefined);
		(abstractRouteService as any)._config = undefined;
		expect(async () => {
			await (abstractRouteService as any).getConfig('job-lead');
		}).toThrow(Error);
	});*/

	describe('get', () => {
		let sfGetSpy;
		let transformSpy;
		beforeEach(() => {
			(abstractRouteService as any)._config = jlConfigDoc;
			sfGetSpy = jest.spyOn((abstractRouteService as any)._salesForce, 'getSobjectById').mockReturnValue(sfDoc);
			transformSpy = jest.spyOn((abstractRouteService as any)._transformer, 'transform');
		});

		afterEach(() => {
			jest.clearAllMocks();
		});

		it('should not call transform when doTransform is false', async () => {
			const getResult = await abstractRouteService.get('123', false);
			expect(sfGetSpy).toHaveBeenCalled();
			expect(transformSpy).toBeCalledTimes(0);
			expect(getResult).toBeTruthy();
		});

		it('should call multiple services', async () => {
			const getResult = await abstractRouteService.get('123');
			expect(sfGetSpy).toHaveBeenCalled();
			expect(transformSpy).toHaveBeenCalled();
			expect(getResult).toBeTruthy();
		});
	});

	describe('post', () => {
		afterEach(() => {
			jest.clearAllMocks();
		});

		it('should call into multiple services', async () => {
			const transformSpy = jest
				.spyOn((abstractRouteService as any)._transformer, 'transform')
				.mockReturnValue(jlTranlateResult);
			const compPayloadSpy = jest
				.spyOn((abstractRouteService as any)._salesForce, 'getCompositeRequestPayload')
				.mockReturnValue(jlRequestPayload);
			const createSoSpy = jest.spyOn((abstractRouteService as any)._salesForce, 'createSObject').mockReturnValue(sfDoc);
			const getRespBodySpy = jest.spyOn((abstractRouteService as any)._salesForce, 'getSFResponseBody');
			const getSpy = jest.spyOn(abstractRouteService, 'get');
			const postResult = await abstractRouteService.post(jlGAIM);
			expect(transformSpy).toHaveBeenCalled();
			expect(compPayloadSpy).toHaveBeenCalled();
			expect(createSoSpy).toHaveBeenCalled();
			expect(getRespBodySpy).toHaveBeenCalled();
			expect(getSpy).toHaveBeenCalled();
			expect(postResult).toBeTruthy();
		});
	});

	describe('patch', () => {
		afterEach(() => {
			jest.clearAllMocks();
		});

		it('should call into multiple services', async () => {
			const transformSpy = jest
				.spyOn((abstractRouteService as any)._transformer, 'transform')
				.mockReturnValue(jlTranlateResult);
			const transformPatchSpy = jest.spyOn((abstractRouteService as any)._transformer, 'getPatchedTransform');
			const compPayloadSpy = jest
				.spyOn((abstractRouteService as any)._salesForce, 'getCompositeRequestPayload')
				.mockReturnValue(jlRequestPayload);
			const getRespBodySpy = jest.spyOn((abstractRouteService as any)._salesForce, 'getSFResponseBody');
			const getSpy = jest.spyOn(abstractRouteService, 'get');
			const patchResult = await abstractRouteService.patch('456', ciPatchPayload);
			expect(transformSpy).toHaveBeenCalled();
			expect(transformPatchSpy).toHaveBeenCalled();
			expect(compPayloadSpy).toHaveBeenCalled();
			expect(getRespBodySpy).toHaveBeenCalled();
			expect(getSpy).toHaveBeenCalled();
			expect(patchResult).toBeTruthy();
		});
	});
});

@Injectable()
class MockRouteService extends AbstractRouteService {
	constructor(
		@FsDataService('salesforce-sor-configs', true)
		private readonly _configsDs: FirestoreDataService<Iv2>,
	) {
		super(_configsDs);
	}
}
