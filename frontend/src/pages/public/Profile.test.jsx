import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
jest.mock('../../services/api', () => ({
    get: jest.fn(),
    put: jest.fn(),
    interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() }
    }
}));

import Profile from './Profile';
import api from '../../services/api';

describe('Profile Component', () => {
    const mockUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890'
    };

    beforeEach(() => {
        api.get.mockResolvedValue({ data: mockUser });
        localStorage.setItem('token', 'test-token');
    });

    it('renders user data after fetching', async () => {
        render(<Profile />);
        await waitFor(() => {
            expect(screen.getByDisplayValue('John')).toBeInTheDocument();
            expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
        });
    });

    it('shows error if passwords do not match', async () => {
        render(<Profile />);
        await waitFor(() => screen.getByDisplayValue('John'));

        fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'pass1' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'pass2' } });
        fireEvent.click(screen.getByText('Update Profile'));

        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });

    it('calls api.put on submit', async () => {
        api.put.mockResolvedValue({ data: { ...mockUser, firstName: 'Johnny' } });
        render(<Profile />);
        await waitFor(() => screen.getByDisplayValue('John'));

        fireEvent.change(screen.getByDisplayValue('John'), { target: { value: 'Johnny' } });
        fireEvent.click(screen.getByText('Update Profile'));

        await waitFor(() => {
            expect(api.put).toHaveBeenCalledWith(
                '/users/profile/me',
                expect.objectContaining({ firstName: 'Johnny' })
            );
            expect(screen.getByText('Profile updated successfully!')).toBeInTheDocument();
        });
    });
});
