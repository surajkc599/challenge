import { of, throwError } from 'rxjs';
import { RequestStatus, UserProfileFacade } from '@fedex/userprofile/domain';
import { SignupReactiveformComponent } from './signup-reactiveform.component';
import { render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';
import { createMock } from '@testing-library/angular/jest-utils';
import '@testing-library/jest-dom';

const mockUserProfileFacade = createMock(UserProfileFacade);
mockUserProfileFacade.signUpUser = jest.fn(() =>
  of({
    data: null,
    status: RequestStatus.IDLE,
  })
);

describe('SignupReactiveformComponent', () => {
  const setup = () => {
    const renderComponent = render(SignupReactiveformComponent, {
      componentProviders: [
        {
          provide: UserProfileFacade,
          useValue: mockUserProfileFacade,
        },
      ],
    });

    return renderComponent;
  };

  describe('render', () => {
    it('should render signup form', async () => {
      // Arrange, Act
      const { getByText, getByRole } = await setup();

      // Assert
      expect(getByText('First Name')).toBeInTheDocument();
      expect(getByText('Last Name')).toBeInTheDocument();
      expect(getByText('Email')).toBeInTheDocument();
      expect(getByText('Password')).toBeInTheDocument();

      expect(
        getByRole('button', {
          name: 'Sign Up',
        })
      ).toBeDisabled();
    });
  });

  describe('Form field validations', () => {
    describe('required validator', () => {
      it('should check for required fields', async () => {
        // Arrange, Act
        const { getByRole, getByLabelText } = await setup();

        const firstNameControl = getByRole('textbox', { name: 'First Name' });
        const lastNameControl = getByRole('textbox', { name: 'Last Name' });
        const emailControl = getByLabelText('Email');
        const passwordControl = getByLabelText('Password');

        // Assert
        expect(firstNameControl).toBeInvalid();
        expect(lastNameControl).toBeInvalid();
        expect(emailControl).toBeInvalid();
        expect(passwordControl).toBeInvalid();
      });

      it('should error messages for required fields', async () => {
        // Arrange
        const { getByRole, getAllByText } = await setup();
        const firstNameControl = getByRole('textbox', { name: 'First Name' });

        // Act
        firstNameControl.focus();
        await userEvent.tab();
        await userEvent.tab();
        await userEvent.tab();
        await userEvent.tab();

        // Assert
        expect(getAllByText('This field is required').length).toBe(4);
      });
    });

    describe('first and last name validations', () => {
      it('should not show error message for first name control when input is given', async () => {
        // Arrange
        const { getByRole, queryAllByText } = await setup();
        const firstNameControl = getByRole('textbox', { name: 'First Name' });

        // Act
        await userEvent.type(firstNameControl, 'Fedex');

        // Assert
        expect(queryAllByText('This field is required').length).toBe(0);
      });

      it('should not show error message for last name control when input is given', async () => {
        // Arrange
        const { getByRole, queryAllByText } = await setup();
        const lastNameControl = getByRole('textbox', { name: 'Last Name' });

        // Act
        await userEvent.type(lastNameControl, 'Express');

        // Assert
        expect(queryAllByText('This field is required').length).toBe(0);
      });
    });

    describe('custom password validator', () => {
      it('should have minimum of 8 chars', async () => {
        // Arrange
        const { getByLabelText, getByText } = await setup();

        // Act
        const passwordControl = getByLabelText('Password');
        await userEvent.type(passwordControl, 'rock');
        await userEvent.tab();

        // Assert
        await waitFor(() =>
          expect(
            getByText('Password must be at least 8 characters long')
          ).toBeInTheDocument()
        );
      });

      it('should include lower and upper case chars', async () => {
        // Arrange
        const { getByLabelText, getByText } = await setup();
        const passwordControl = getByLabelText('Password');

        // Act
        await userEvent.type(passwordControl, 'expresss');
        await userEvent.tab();

        // Assert
        await waitFor(() =>
          expect(
            getByText('Password should contain lower and uppercase letters')
          ).toBeInTheDocument()
        );
      });

      it('should not contain first name supported with case-insensitive', async () => {
        // Arrange
        const { getByLabelText, getByText, getByRole } = await setup();
        const firstNameControl = getByRole('textbox', { name: 'First Name' });
        const lastNameControl = getByRole('textbox', { name: 'Last Name' });
        const passwordControl = getByLabelText('Password');

        // Act
        await userEvent.type(firstNameControl, 'Fedex');
        await userEvent.tab();
        await userEvent.type(lastNameControl, 'delivery');
        await userEvent.tab();
        await userEvent.type(passwordControl, 'fedexChallenge');
        await userEvent.tab();

        // Assert
        await waitFor(() =>
          expect(
            getByText('Password should not contain first or last name')
          ).toBeInTheDocument()
        );
      });

      it('should not contain last name', async () => {
        // Arrange
        const { getByLabelText, getByText, getByRole } = await setup();
        const firstNameControl = getByRole('textbox', { name: 'First Name' });
        const lastNameControl = getByRole('textbox', { name: 'Last Name' });
        const passwordControl = getByLabelText('Password');

        // Act
        await userEvent.type(firstNameControl, 'Fedex');
        await userEvent.tab();
        await userEvent.type(lastNameControl, 'delivery');
        await userEvent.tab();
        await userEvent.type(passwordControl, 'Parceldelivery');
        await userEvent.tab();

        // Assert
        await waitFor(() =>
          expect(
            getByText('Password should not contain first or last name')
          ).toBeInTheDocument()
        );
      });
    });

    describe('simple custom email validator', () => {
      const invalidEmails = [
        'test@supercool.comer',
        'test^^%%@supercool.com',
        'restinpeace',
      ];
      it.each(invalidEmails)(
        'verify invalid email addresses %s',
        async (email) => {
          // Arrange
          const { getByLabelText, getByText } = await setup();

          // Act
          const emailControl = getByLabelText('Email');
          await userEvent.type(emailControl, email);
          await userEvent.tab();

          // Assert
          await waitFor(() =>
            expect(
              getByText('Email must be a valid email address')
            ).toBeInTheDocument()
          );
        }
      );
    });
  });

  describe('Form signup success and error', () => {
    it('should be able to submit signup form successfuly', async () => {
      // Arrange
      const { getByRole, getByLabelText, getByText } = await render(
        SignupReactiveformComponent,
        {
          componentProviders: [
            {
              provide: UserProfileFacade,
              useValue: {
                signUpUser() {
                  return of({
                    data: {
                      id: 1,
                    },
                    status: RequestStatus.SUCCESS,
                  });
                },
              },
            },
          ],
        }
      );
      const firstNameControl = getByRole('textbox', { name: 'First Name' });
      const lastNameControl = getByRole('textbox', { name: 'Last Name' });
      const emailControl = getByLabelText('Email');
      const passwordControl = getByLabelText('Password');

      // Act
      await userEvent.type(firstNameControl, 'Fedex');
      await userEvent.tab();
      await userEvent.type(lastNameControl, 'Express');
      await userEvent.tab();
      await userEvent.type(emailControl, 'test@gmail.com');
      await userEvent.tab();
      await userEvent.type(passwordControl, 'Helloworld!');
      await userEvent.tab();

      const signupButton = getByRole('button', {
        name: 'Sign Up',
      });
      await userEvent.click(signupButton);

      // Assert
      expect(
        getByText('FEDEX, EXPRESS your registration is success with id 1')
      ).toBeInTheDocument();
    });

    it('should be able to submit signup form and expect error', async () => {
      // Arrange
      const { getByRole, getByLabelText, getByText } = await render(
        SignupReactiveformComponent,
        {
          componentProviders: [
            {
              provide: UserProfileFacade,
              useValue: {
                signUpUser() {
                  return throwError(() => ({
                    data: null,
                    status: RequestStatus.ERROR,
                  }));
                },
              },
            },
          ],
        }
      );
      const firstNameControl = getByRole('textbox', { name: 'First Name' });
      const lastNameControl = getByRole('textbox', { name: 'Last Name' });
      const emailControl = getByLabelText('Email');
      const passwordControl = getByLabelText('Password');

      // Act
      await userEvent.type(firstNameControl, 'Fedex');
      await userEvent.tab();
      await userEvent.type(lastNameControl, 'Express');
      await userEvent.tab();
      await userEvent.type(emailControl, 'test@gmail.com');
      await userEvent.tab();
      await userEvent.type(passwordControl, 'Helloworld!');
      await userEvent.tab();

      const signupButton = getByRole('button', {
        name: 'Sign Up',
      });
      await userEvent.click(signupButton);

      // Assert
      expect(
        getByText('Sorry something went wrong, please try later..')
      ).toBeInTheDocument();
    });
  });
});
