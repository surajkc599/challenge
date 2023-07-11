import { PhotosDataService } from './photos.data.service';
import { lastValueFrom, of } from 'rxjs';

// Mockings
const mockApiResponse = 'some random thing...';
const mockGetFn = jest.fn(() => of(mockApiResponse));
// Fake/Mock Get Function
const mockApiResource = {
  get: mockGetFn,
};
jest.mock('@angular/core', () => {
  const actual = jest.requireActual('@angular/core');
  return {
    ...actual,
    // Provide mock instance
    inject: () => mockApiResource,
  };
});

describe('Photos data service', () => {
  const setup = () => {
    const mockPhotosDataService = new PhotosDataService();

    return mockPhotosDataService;
  };

  it('should request api call to load photo details', () => {
    // Arrange
    const service = setup();
    // Act
    service.loadPhoto(6);
    // Assert
    expect(mockGetFn).toBeCalled();
    expect(mockGetFn).toBeCalledTimes(1);
    expect(mockGetFn).toHaveBeenCalledWith({}, 'photos/6');
  });

  it('should request get the response on requesting api call to load photo details', async () => {
    // Arrange
    const service = setup();
    // Act
    const photo$ = service.loadPhoto(6);
    // Assert
    await expect(lastValueFrom(photo$)).resolves.toEqual(mockApiResponse);
  });
});
