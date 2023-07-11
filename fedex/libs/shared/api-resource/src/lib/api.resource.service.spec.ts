import { ApiResourceService } from './api.resource.service';
import { lastValueFrom, of } from 'rxjs';

jest.mock('@angular/core', () => {
  const actual = jest.requireActual('@angular/core');
  const mockService = {
    ...actual,
    get: jest.fn(() => of('All is well with GET')),
    post: jest.fn(() => of('All is well with POST')),
    baseUrl: 'some-random-url',
  };

  return {
    ...actual,
    inject: () => mockService,
  };
});

describe('Api resource test', () => {
  it('should make a GET request', async () => {
    // Arrange
    const apiResourceService = new ApiResourceService();
    // Act
    const get$ = apiResourceService.get({}, 'test');
    // Assert
    await expect(lastValueFrom(get$)).resolves.toEqual('All is well with GET');
  });

  it('should make a POST request', async () => {
    // Arrange
    const apiResourceService = new ApiResourceService();
    // Act
    const get$ = apiResourceService.post({}, 'test');
    // Assert
    await expect(lastValueFrom(get$)).resolves.toEqual('All is well with POST');
  });
});
