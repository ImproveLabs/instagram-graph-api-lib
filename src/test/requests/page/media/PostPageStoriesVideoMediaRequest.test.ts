import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Constants } from '../../../../main/Constants';
import { CreatedObjectIdResponse } from '../../../../main/requests/common/CreatedObjectIdResponse';
import { PostPageStoriesPhotoMediaRequest } from '../../../../main/requests/page/media/PostPageStoriesPhotoMediaRequest';
import { TestConstants } from '../../../TestConstants';

describe('PostPageStoriesPhotoMediaRequest.', () => {
    const request: PostPageStoriesPhotoMediaRequest = new PostPageStoriesPhotoMediaRequest(
        TestConstants.ACCESS_TOKEN,
        TestConstants.PAGE_ID,
        TestConstants.MEDIA_URL
    );

    it('Builds the config', () => {
        expect(request.config().method).toEqual('POST');
        expect(request.config().url).toEqual(`/${TestConstants.PAGE_ID}/media`);
        expect(request.config().params.image_url).toEqual(TestConstants.MEDIA_URL);
    });

    const mock = new MockAdapter(axios);
    mock.onPost(`${Constants.API_URL}/${TestConstants.PAGE_ID}/media`).reply(200, { id: TestConstants.CONTAINER_ID });
    it('Parses the response', () => {
        expect.assertions(1);
        return request.execute().then((response) => {
            expect(response).toEqual(new CreatedObjectIdResponse({ id: TestConstants.CONTAINER_ID }));
        });
    });
});
