import { render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import InputName from '@/components/groups/GroupNameInput';
import ActionButtons from '@/components/groups/CreateActionButtons';
import CreateUserSelector from '@/components/groups/CreateUserSelector';

describe('InputName', () => {
  it('input should be accessible by label', () => {
    render(<InputName />);

    const inputElement = screen.getByLabelText('Add Group Name');
    expect(inputElement).toBeInTheDocument();
  });

  it('should render the input field with correct attributes', () => {
    render(<InputName />);

    const inputElement = screen.getByPlaceholderText('Enter a group name');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'text');
    expect(inputElement).toHaveAttribute('name', 'name');
    expect(inputElement).toBeRequired();
  });
});
describe('CreateUserSelector', () => {
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
      <CreateUserSelector
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
      <CreateUserSelector
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

describe('ActionButtons', () => {
  it('renders the action buttons', () => {
    render(<ActionButtons />);

    // Verify both buttons are in the document
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Create Group' })
    ).toBeInTheDocument();
  });
});
