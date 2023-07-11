import {
  RequestStatus,
  UserDetails,
  UserStatus,
} from '@fedex/userprofile/domain';
import { render } from '@testing-library/angular';
import '@testing-library/jest-dom';
import { SignupConfirmationComponent } from './signup-confirmation.component';

describe('Signup confirmation test', () => {
  const setup = (props: {
    signupStatus: UserStatus;
    fullName: string;
  }) => {
    const renderComponent = render(SignupConfirmationComponent, {
      componentInputs: {
        ...props,
      },
    });

    return renderComponent;
  };

  it('should show error message', async () => {
    const { getByText } = await setup({
      signupStatus: {
        status: RequestStatus.ERROR,
        data: null,
      },
      fullName: 'dummy user',
    });

    expect(
      getByText('Sorry something went wrong, please try later..')
    ).toBeInTheDocument();
  });

  it('should show in progress state', async () => {
    const { getByText } = await setup({
      signupStatus: {
        status: RequestStatus.INPROGRESS,
        data: null,
      },
      fullName: 'dummy user',
    });

    expect(getByText('Signup is in progress..')).toBeInTheDocument();
  });

  it('should show in success confirmation', async () => {
    const { getByText } = await setup({
      signupStatus: {
        status: RequestStatus.SUCCESS,
        data: { id: 1 } as UserDetails,
      },
      fullName: 'dummy user',
    });

    expect(
      getByText('DUMMY USER your registration is success with id 1')
    ).toBeInTheDocument();
  });
});
