import { firstValueFrom, lastValueFrom, of } from 'rxjs';
import { IPhoto, IUser, RequestStatus, User, UserProfileFacade } from '../..';

jest.mock('@angular/core', () => {
  const actual = jest.requireActual('@angular/core');
  const photo: IPhoto = {
    albumId: 1,
    id: 1,
    thumbnailUrl: 'thumbnailurl.com',
    title: 'signals',
    url: 'url.com',
  };
  const mockService = {
    ...actual,
    loadPhoto: jest.fn((length: number) =>
      of({
        ...photo,
        albumId: length,
      })
    ),
    postUser: jest.fn((user: IUser) =>
      of({
        ...user,
        id: 10,
      })
    ),
  };

  return {
    ...actual,
    inject: () => mockService,
  };
});

describe('User profile facade test', () => {
  const setup = () => {
    const facade = new UserProfileFacade();

    return facade;
  };

  it('should signup user when user details are provided', async () => {
    // Arrange
    const user: User = {
      email: 'dummy@email.com',
      firstName: 'first name',
      lastName: 'last name',
    };
    const userFacade = setup();

    // Act
    const status$ = userFacade.signUpUser(user);

    // Assert
    await expect(firstValueFrom(status$)).resolves.toEqual({
      data: null,
      status: RequestStatus.INPROGRESS,
    });
    await expect(lastValueFrom(status$)).resolves.toEqual({
      data: {
        ...user,
        id: 10,
        thumbnailUrl: 'thumbnailurl.com',
      },
      status: RequestStatus.SUCCESS,
    });
  });
});
