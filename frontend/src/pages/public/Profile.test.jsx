import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Profile from './Profile';
import axios from 'axios';

jest.mock('axios');

describe('Profile Component', () => {
    const mockUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '1234567890'
    };

    beforeEach(() => {
        axios.get.mockResolvedValue({ data: mockUser });
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

    it('calls axios.put on submit', async () => {
        axios.put.mockResolvedValue({ data: { ...mockUser, firstName: 'Johnny' } });
        render(<Profile />);
        await waitFor(() => screen.getByDisplayValue('John'));

        fireEvent.change(screen.getByDisplayValue('John'), { target: { value: 'Johnny' } });
        fireEvent.click(screen.getByText('Update Profile'));

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith(
                expect.stringContaining('/api/users/profile/me'),
                expect.objectContaining({ firstName: 'Johnny' }),
                expect.any(Object)
            );
            expect(screen.getByText('Profile updated successfully!')).toBeInTheDocument();
        });
    });
});
