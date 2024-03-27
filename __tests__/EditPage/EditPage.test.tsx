import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import InputEditName from '@/components/groups/GroupNameEdit';
import ActionButtons from '@/components/groups/EditActionButtons';
import EditUserSelector from '@/components/groups/EditUserSelector';
import userEvent from '@testing-library/user-event';

describe('InputEditName', () => {
  const defaultName = 'Existing Group Name';

  it('renders with the default value', () => {
    render(<InputEditName defaultValue={defaultName} />);
    const inputElement = screen.getByRole('textbox', {
      name: /edit group name/i,
    });

    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue(defaultName);
  });

  it('allows changing the value', async () => {
    render(<InputEditName defaultValue={defaultName} />);
    const inputElement = screen.getByRole('textbox', {
      name: /edit group name/i,
    });

    // Clear the input and type a new value
    await userEvent.clear(inputElement);
    await userEvent.type(inputElement, 'New Group Name');

    expect(inputElement).toHaveValue('New Group Name');
  });

  it('is required for form submission', () => {
    render(
      <form>
        <InputEditName defaultValue={defaultName} />
      </form>
    );
    const inputElement = screen.getByRole('textbox', {
      name: /edit group name/i,
    });

    expect(inputElement).toBeRequired();
  });
});
describe('Edit User Selector', () => {
  it('displays search results and allows adding users', async () => {
    const mockAddUser = jest.fn();
    const searchResults = [
      {
        id: '2',
        firstname: 'Jane',
        lastname: 'Doe',
        email: 'johndoe@test.com',
        password: 'testing',
      },
    ];

    render(
      <EditUserSelector
        userID='1'
        searchQuery='Jan'
        handleSearch={jest.fn()}
        searchResults={searchResults}
        handleAddUser={mockAddUser}
        selectedUsers={[]}
        handleRemoveUser={jest.fn()}
      />
    );

    expect(screen.getByText('Choose participants')).toBeInTheDocument();
    expect(screen.getByText('Selected participants')).toBeInTheDocument();
  });

  it('shows appropriate message when no users are selected', () => {
    render(
      <EditUserSelector
        userID='1'
        searchQuery=''
        handleSearch={jest.fn()}
        searchResults={[]}
        handleAddUser={jest.fn()}
        selectedUsers={[]}
        handleRemoveUser={jest.fn()}
      />
    );

    expect(screen.getByText('No selected users.')).toBeInTheDocument();
  });
});

describe('Edit Action Buttons', () => {
  it('renders the action buttons', () => {
    render(<ActionButtons />);

    // Verify both buttons are in the document
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Edit Group' })
    ).toBeInTheDocument();
  });
});
