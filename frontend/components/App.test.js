import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AppFunctional from './AppFunctional';

// Mock fetch globally
global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

describe('AppFunctional Component', () => {

  // Test for rendering visible texts
  test('renders visible texts in headings, buttons, and form elements', () => {
    render(<AppFunctional />);
    
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

  // Test for typing in the email input
  test('typing in the email input updates its value', () => {
    render(<AppFunctional />);
    
    const emailInput = screen.getByPlaceholderText(/type email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput).toHaveValue('test@example.com');
  });

  // Test for initial coordinates
  test('initial coordinates are displayed correctly', () => {
    render(<AppFunctional />);
    expect(screen.getByText(/coordinates \(2, 2\)/i)).toBeInTheDocument();
  });

  // Test for clicking a movement button updates coordinates and steps
  test('clicking a movement button updates the coordinates and steps', () => {
    render(<AppFunctional />);
    
    const leftButton = screen.getByText(/left/i);
    fireEvent.click(leftButton);
    
    expect(screen.getByText(/coordinates \(1, 2\)/i)).toBeInTheDocument();
    expect(screen.getByText(/you moved 1 times/i)).toBeInTheDocument();
  });

  // Test for displaying limit reached message when trying to move out of bounds
  test('displays limit reached message when trying to move out of bounds', () => {
    render(<AppFunctional />);
    
    const upButton = screen.getByText(/up/i);
    fireEvent.click(upButton);
    expect(screen.getByText(/coordinates \(2, 1\)/i)).toBeInTheDocument();
  
    fireEvent.click(upButton);
    expect(screen.getByText("You can't go up")).toBeInTheDocument();
  });

  // Test for displaying "You can't go left" when trying to move left out of bounds
  test('displays "You can\'t go left" when trying to move left out of bounds', () => {
    render(<AppFunctional />);
    
    const upButton = screen.getByText(/up/i);
    const leftButton = screen.getByText(/left/i);
  
    fireEvent.click(upButton);
    expect(screen.getByText(/coordinates \(2, 1\)/i)).toBeInTheDocument();
  
    fireEvent.click(leftButton);
    expect(screen.getByText(/coordinates \(1, 1\)/i)).toBeInTheDocument();
  
    fireEvent.click(leftButton);
    expect(screen.getByText("You can't go left")).toBeInTheDocument();
  });

  // Test for reset button functionality
  test('reset button clears the message and resets state', () => {
    render(<AppFunctional />);
    
    const leftButton = screen.getByText(/left/i);
    const resetButton = screen.getByText(/reset/i);
  
    fireEvent.click(leftButton);
    expect(screen.getByText(/coordinates \(1, 2\)/i)).toBeInTheDocument();
    expect(screen.getByText(/you moved 1 times/i)).toBeInTheDocument();
  
    fireEvent.click(leftButton);
    expect(screen.getByText("You can't go left")).toBeInTheDocument();
  
    fireEvent.click(resetButton);
  
    expect(screen.getByText(/coordinates \(2, 2\)/i)).toBeInTheDocument();
    expect(screen.getByText(/you moved 0 times/i)).toBeInTheDocument();
    expect(screen.queryByText(/you can't go/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/submission successful/i)).not.toBeInTheDocument();
  });

  // Test for displaying error message when submitting without email
  test('displays error message when submitting without email', () => {
    render(<AppFunctional />);
    
    const downButton = screen.getByText(/down/i);
    const rightButton = screen.getByText(/right/i);
    const submitButton = screen.getByText(/submit/i);
  
    fireEvent.click(downButton);
    expect(screen.getByText(/coordinates \(2, 3\)/i)).toBeInTheDocument();
  
    fireEvent.click(rightButton);
    expect(screen.getByText(/coordinates \(3, 3\)/i)).toBeInTheDocument();
  
    fireEvent.click(submitButton);
  
    expect(screen.getByText('Ouch: email is required')).toBeInTheDocument();
  });

  // Test for handling the limit when moving right to (3, 2)
  test('displays correct message when reaching right limit at (3, 2)', () => {
    render(<AppFunctional />);
    
    const rightButton = screen.getByText(/right/i);
    fireEvent.click(rightButton);
    expect(screen.getByText(/coordinates \(3, 2\)/i)).toBeInTheDocument();
  
    fireEvent.click(rightButton);
    expect(screen.getByText(/coordinates \(3, 2\)/i)).toBeInTheDocument();
    expect(screen.getByText("You can't go right")).toBeInTheDocument();
  });

  // Test for displaying "You can't go down" when trying to move down out of bounds
  test('displays "You can\'t go down" when trying to move down out of bounds', () => {
    render(<AppFunctional />);
    
    const rightButton = screen.getByText(/right/i);
    const downButton = screen.getByText(/down/i);
  
    fireEvent.click(rightButton);
    expect(screen.getByText(/coordinates \(3, 2\)/i)).toBeInTheDocument();
  
    fireEvent.click(downButton);
    expect(screen.getByText(/coordinates \(3, 3\)/i)).toBeInTheDocument();
  
    fireEvent.click(downButton);
    expect(screen.getByText("You can't go down")).toBeInTheDocument();
  });

  // Test for checking the steps counter increments by 1 after a single valid move
  test('steps counter increments by 1 after a single valid move', () => {
    render(<AppFunctional />);
    
    expect(screen.getByText("You moved 0 times")).toBeInTheDocument();
    
    fireEvent.click(screen.getByText(/right/i));
    
    expect(screen.getByText("You moved 1 time")).toBeInTheDocument();
  });

  // Test for submitting the form with a valid email sends a POST request
  test('submitting the form with a valid email sends a POST request', async () => {
    render(<AppFunctional />);
    
    fireEvent.click(screen.getByText(/right/i)); // Move right to (3, 2)
    fireEvent.click(screen.getByText(/up/i)); // Move up to (3, 1)
    
    const emailInput = screen.getByPlaceholderText(/type email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    fetch.mockResolvedValueOnce({
      json: async () => ({ message: 'Submission successful!' }),
    });

    const submitButton = screen.getByText(/submit/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:9000/api/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          x: 3,
          y: 1,
          steps: 2,
          email: 'test@example.com',
        }),
      });

      expect(screen.getByText('Submission successful!')).toBeInTheDocument();
    });
  });

});

