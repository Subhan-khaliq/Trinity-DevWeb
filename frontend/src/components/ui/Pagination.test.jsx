import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

describe('Pagination Component', () => {
    const defaultProps = {
        currentPage: 1,
        totalPages: 5,
        onPageChange: jest.fn(),
    };

    it('renders correct number of page buttons', () => {
        render(<Pagination {...defaultProps} />);
        const buttons = screen.getAllByRole('button');
        // 2 for arrows + 5 for pages = 7
        expect(buttons).toHaveLength(7);
    });

    it('disables "Previous" button on the first page', () => {
        render(<Pagination {...defaultProps} />);
        expect(screen.getByText(/Previous/)).toBeDisabled();
    });

    it('enables "Next" button if not on the last page', () => {
        render(<Pagination {...defaultProps} />);
        expect(screen.getByText(/Next/)).not.toBeDisabled();
    });

    it('calls onPageChange when "Next" is clicked', () => {
        render(<Pagination {...defaultProps} />);
        fireEvent.click(screen.getByText(/Next/));
        expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
    });

    it('disables "Next" button on the last page', () => {
        render(<Pagination {...defaultProps} currentPage={5} totalPages={5} />);
        expect(screen.getByText(/Next/)).toBeDisabled();
    });
});
