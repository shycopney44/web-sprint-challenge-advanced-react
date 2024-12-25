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
    expect(screen.getByText(/you moved 1 time/i)).toBeInTheDocument();
  });

  test('displays limit reached message when trying to move out of bounds', () => {
    const upButton = screen.getByText(/up/i);
    
    // First move up (valid)
    fireEvent.click(upButton);
    expect(screen.getByText(/coordinates \(2, 1\)/i)).toBeInTheDocument();
    
    // Second move up (invalid)
    fireEvent.click(upButton);
    expect(screen.getByText("You can't go up")).toBeInTheDocument();
  });

  test('displays "You can\'t go left" when trying to move left out of bounds', () => {
    const upButton = screen.getByText(/up/i);
    const leftButton = screen.getByText(/left/i);

    // Move up (valid)
    fireEvent.click(upButton);
    expect(screen.getByText(/coordinates \(2, 1\)/i)).toBeInTheDocument();

    // Move left (valid)
    fireEvent.click(leftButton);
    expect(screen.getByText(/coordinates \(1, 1\)/i)).toBeInTheDocument();

    // Move left again (invalid)
    fireEvent.click(leftButton);
    expect(screen.getByText("You can't go left")).toBeInTheDocument();
  });

  test('reset button clears the message and resets state', () => {
    const leftButton = screen.getByText(/left/i);
    const resetButton = screen.getByText(/reset/i);
    
    // Simulate a valid move
    fireEvent.click(leftButton);
    expect(screen.getByText(/coordinates \(1, 2\)/i)).toBeInTheDocument();
    expect(screen.getByText(/you moved 1 time/i)).toBeInTheDocument();
    
    // Set a message manually
    fireEvent.click(leftButton);
    expect(screen.getByText("You can't go left")).toBeInTheDocument();
    
    // Simulate reset
    fireEvent.click(resetButton);
    
    // Verify reset state
    expect(screen.getByText(/coordinates \(2, 2\)/i)).toBeInTheDocument();
    expect(screen.getByText(/you moved 0 times/i)).toBeInTheDocument();
    expect(screen.queryByText(/you can't go/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/submission successful/i)).not.toBeInTheDocument();
  });

  test('displays error message when submitting without email', () => {
    const downButton = screen.getByText(/down/i);
    const rightButton = screen.getByText(/right/i);
    const submitButton = screen.getByText(/submit/i);

    // Perform moves: down, right
    fireEvent.click(downButton);
    expect(screen.getByText(/coordinates \(2, 3\)/i)).toBeInTheDocument();

    fireEvent.click(rightButton);
    expect(screen.getByText(/coordinates \(3, 3\)/i)).toBeInTheDocument();

    // Attempt to submit without an email
    fireEvent.click(submitButton);

    // Verify error message
    expect(screen.getByText('Ouch: email is required')).toBeInTheDocument();
  });

  test('displays correct message when reaching right limit at (3, 2)', () => {
    const rightButton = screen.getByText(/right/i);

    // Perform valid move to the right
    fireEvent.click(rightButton);
    expect(screen.getByText(/coordinates \(3, 2\)/i)).toBeInTheDocument();

    // Attempt to move right again (invalid)
    fireEvent.click(rightButton);
    expect(screen.getByText("You can't go right")).toBeInTheDocument();
  });

  test('displays "You can\'t go down" when trying to move down out of bounds', () => {
    const rightButton = screen.getByText(/right/i);
    const downButton = screen.getByText(/down/i);

    // Move right to reach coordinates (3, 2)
    fireEvent.click(rightButton);
    expect(screen.getByText(/coordinates \(3, 2\)/i)).toBeInTheDocument();

    // Move down to coordinates (3, 3)
    fireEvent.click(downButton);
    expect(screen.getByText(/coordinates \(3, 3\)/i)).toBeInTheDocument();

    // Try to move down again (invalid)
    fireEvent.click(downButton);
    expect(screen.getByText("You can't go down")).toBeInTheDocument();
  });

  test('steps counter increments by 1 after a single valid move', () => {
    const rightButton = screen.getByText(/right/i);
    
    // Initial check - steps should be 0
    expect(screen.getByText("You moved 0 times")).toBeInTheDocument();
    
    // Perform one right move
    fireEvent.click(rightButton);
    
    // Check if the steps counter has incremented to 1
    expect(screen.getByText("You moved 1 time")).toBeInTheDocument();
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
