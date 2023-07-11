import { UsersDataService } from './users.data.service';
import { lastValueFrom, of } from 'rxjs';

// Mockings
const mockApiResponse = { id: 1 };
const mockPostFn = jest.fn(() => of(mockApiResponse));
// Fake/Mock Get Function
const mockApiResource = {
  post: mockPostFn,
};
jest.mock('@angular/core', () => {
  const actual = jest.requireActual('@angular/core');
  return {
    ...actual,
    // Provide mock instance
    inject: () => mockApiResource,
  };
});

describe('Users data service', () => {
  const setup = () => {
    const mockUsersDataService = new UsersDataService();

    return mockUsersDataService;
  };
  const user = {
    email: 'some@email.com',
    firstName: 'test',
    lastName: 'test last',
    thumbnailUrl: 'random url',
  };

  it('should request api call to post user details', () => {
    // Arrange
    const service = setup();
    // Act
    service.postUser(user);
    // Assert
    expect(mockPostFn).toBeCalled();
    expect(mockPostFn).toBeCalledTimes(1);
    expect(mockPostFn).toHaveBeenCalledWith(user, 'users');
  });

  it('should get the response on requesting api call to post user details', async () => {
    // Arrange
    const service = setup();
    // Act
    const user$ = service.postUser(user);
    // Assert
    await expect(lastValueFrom(user$)).resolves.toEqual(mockApiResponse);
  });
});
