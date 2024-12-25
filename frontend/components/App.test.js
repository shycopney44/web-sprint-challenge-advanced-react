import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppFunctional from './AppFunctional';

describe('AppFunctional Component', () => {
  beforeEach(() => {
    render(<AppFunctional />);
  });

  test('renders visible texts in headings, buttons, and form elements', () => {
    // Check headings
    expect(screen.getByText(/coordinates/i)).toBeInTheDocument();
    expect(screen.getByText(/you moved/i)).toBeInTheDocument();

    // Check buttons
    expect(screen.getByText(/left/i)).toBeInTheDocument();
    expect(screen.getByText(/up/i)).toBeInTheDocument();
    expect(screen.getByText(/right/i)).toBeInTheDocument();
    expect(screen.getByText(/down/i)).toBeInTheDocument();
    expect(screen.getByText(/reset/i)).toBeInTheDocument();

    // Check input placeholder
    expect(screen.getByPlaceholderText(/type email/i)).toBeInTheDocument();
  });

  test('typing in the email input updates its value', () => {
    const emailInput = screen.getByPlaceholderText(/type email/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput).toHaveValue('test@example.com');
  });

  test('initial coordinates are displayed correctly', () => {
    expect(screen.getByText(/coordinates \(2, 2\)/i)).toBeInTheDocument();
  });

  test('clicking a movement button updates the coordinates and steps', () => {
    const leftButton = screen.getByText(/left/i);

    fireEvent.click(leftButton);

    expect(screen.getByText(/coordinates \(1, 2\)/i)).toBeInTheDocument();
    expect(screen.getByText(/you moved 1 times/i)).toBeInTheDocument();
  });

  test('reset button restores the initial state', () => {
    const leftButton = screen.getByText(/left/i);
    const resetButton = screen.getByText(/reset/i);

    // Simulate movement
    fireEvent.click(leftButton);
    expect(screen.getByText(/coordinates \(1, 2\)/i)).toBeInTheDocument();

    // Simulate reset
    fireEvent.click(resetButton);
    expect(screen.getByText(/coordinates \(2, 2\)/i)).toBeInTheDocument();
    expect(screen.getByText(/you moved 0 times/i)).toBeInTheDocument();
  });
});
