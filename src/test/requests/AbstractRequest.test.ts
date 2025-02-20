import fetchMock from 'jest-fetch-mock';
import { Constants } from '../../main/Constants';
import { ApiVersion } from '../../main/Enums';
import { AbstractRequest } from '../../main/requests/AbstractRequest';
import { AbstractResponse } from '../../main/requests/AbstractResponse';
import { MediaData } from '../../main/requests/data/MediaData';
import { TestConstants } from '../TestConstants';

describe('AbstractRequest', () => {
    class AbstractRequestImpl extends AbstractRequest<AbstractResponseImpl> {
        protected parseResponse(response: MediaData): AbstractResponseImpl {
            return new AbstractResponseImpl(response);
        }
        protected url(): string {
            return TestConstants.PATH;
        }

        constructor(apiVersion?: ApiVersion) {
            super(TestConstants.ACCESS_TOKEN, apiVersion);
        }
    }

    class AbstractResponseImpl extends AbstractResponse<MediaData> {
        constructor(response: MediaData) {
            super(response);
        }
    }

    const request: AbstractRequestImpl = new AbstractRequestImpl();

    fetchMock.enableMocks();
    fetchMock.mockOnce(JSON.stringify(TestConstants.FULL_MEDIA_DATA));
    it('Executes the request', async () => {
        const response = await request.execute();
        expect(response.getData()).toEqual(TestConstants.FULL_MEDIA_DATA);
    });

    it('Builds a config', () => {
        expect(request.config()).toEqual({
            params: {
                access_token: TestConstants.ACCESS_TOKEN,
            },
            method: 'GET',
            url: TestConstants.PATH,
            baseURL: `${Constants.API_URL}/`,
        });
    });

    it('Adds the paging', () => {
        expect(request.withPaging(TestConstants.BEFORE_PAGE).config().params.before).toEqual(
            TestConstants.BEFORE_PAGE.value
        );
        expect(request.withPaging(TestConstants.AFTER_PAGE).config().params.after).toEqual(
            TestConstants.AFTER_PAGE.value
        );

        // Test that it clears the previous paging
        expect(request.config().params.before).toBeUndefined();
        expect(request.withPaging(TestConstants.BEFORE_PAGE).config().params.after).toBeUndefined();
    });

    it('Adds the range', () => {
        request.withRange(Math.floor(TestConstants.SINCE.getTime() / 1000), Math.floor(TestConstants.UNTIL.getTime() / 1000));
        expect(request.config().params.since).toEqual(TestConstants.SINCE);
        expect(request.config().params.until).toEqual(TestConstants.UNTIL);
    });

    it('Adds the limit', () => {
        expect(request.withLimit(TestConstants.LIMIT).config().params.limit).toEqual(TestConstants.LIMIT);
    });

    it('Adds the Api Version', () => {
        expect(request.withApiVersion(TestConstants.API_VERSION).config().baseURL).toEqual(
            `${Constants.API_URL}/${TestConstants.API_VERSION}`
        );
    });

    const requestExplicitVersion: AbstractRequestImpl = new AbstractRequestImpl(TestConstants.API_VERSION);
    it('Sets the Api Version in the constructor', () => {
        expect(requestExplicitVersion.config().baseURL).toEqual(`${Constants.API_URL}/${TestConstants.API_VERSION}`);
    });
});
