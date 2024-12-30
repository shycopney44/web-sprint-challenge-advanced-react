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

  test('displays limit reached message when trying to move out of bounds', () => {
    const upButton = screen.getByText(/up/i);
    fireEvent.click(upButton); // Valid move
    expect(screen.getByText(/coordinates \(2, 1\)/i)).toBeInTheDocument();

    fireEvent.click(upButton); // Invalid move
    expect(screen.getByText("You can't go up")).toBeInTheDocument();
  });

  test('reset button clears the message and resets state', () => {
    const leftButton = screen.getByText(/left/i);
    const resetButton = screen.getByText(/reset/i);
    fireEvent.click(leftButton); // Valid move
    expect(screen.getByText(/coordinates \(1, 2\)/i)).toBeInTheDocument();
    fireEvent.click(leftButton); // Invalid move
    expect(screen.getByText("You can't go left")).toBeInTheDocument();
    fireEvent.click(resetButton); // Reset
    expect(screen.getByText(/coordinates \(2, 2\)/i)).toBeInTheDocument();
    expect(screen.getByText(/you moved 0 times/i)).toBeInTheDocument();
    expect(screen.queryByText(/you can't go/i)).not.toBeInTheDocument();
  });

  test('displays "You can\'t go right" when trying to move right out of bounds', () => {
    const rightButton = screen.getByText(/right/i);
    fireEvent.click(rightButton); // Valid move
    expect(screen.getByText(/coordinates \(3, 2\)/i)).toBeInTheDocument();
    fireEvent.click(rightButton); // Invalid move
    expect(screen.getByText("You can't go right")).toBeInTheDocument();
  });

  test('steps counter increments by 1 after a single valid move', () => {
    const rightButton = screen.getByText(/right/i);
    expect(screen.getByText("You moved 0 times")).toBeInTheDocument(); // Initial state
    fireEvent.click(rightButton); // Single move
    expect(screen.getByText("You moved 1 time")).toBeInTheDocument();
  });

  test('reset button restores the initial state', () => {
    const leftButton = screen.getByText(/left/i);
    const resetButton = screen.getByText(/reset/i);
    fireEvent.click(leftButton); // Valid move
    expect(screen.getByText(/coordinates \(1, 2\)/i)).toBeInTheDocument();
    fireEvent.click(resetButton); // Reset
    expect(screen.getByText(/coordinates \(2, 2\)/i)).toBeInTheDocument();
    expect(screen.getByText(/you moved 0 times/i)).toBeInTheDocument();
  });

  test('displays error message when submitting without email', () => {
    const submitButton = screen.getByText(/submit/i);
    fireEvent.click(submitButton); // No email
    expect(screen.getByText('Ouch: email is required')).toBeInTheDocument();
  });

  test('submitting the form with a valid email sends a POST request', async () => {
    const emailInput = screen.getByPlaceholderText(/type email/i);
    const submitButton = screen.getByText(/submit/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    expect(screen.getByText('Submission successful!')).toBeInTheDocument();
  });
});
