import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppFunctional from './AppFunctional';

describe('AppFunctional Component', () => {
  beforeEach(() => {
    render(<AppFunctional />);
  });

  // Mock the fetch API before all tests
  beforeAll(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ message: 'Submission successful!' })
      })
    );
  });

  // Clear mock after each test
  afterEach(() => {
    jest.clearAllMocks();
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

  // Test movement buttons (left, up, right, down)
  test('clicking the left button updates the coordinates and steps', () => {
    const leftButton = screen.getByText(/left/i);
    
    // Initial state
    expect(screen.getByText(/coordinates \(2, 2\)/i)).toBeInTheDocument();
    expect(screen.getByText(/you moved 0 times/i)).toBeInTheDocument();
    
    // Click left button
    fireEvent.click(leftButton);
    expect(screen.getByText(/coordinates \(1, 2\)/i)).toBeInTheDocument();
    expect(screen.getByText(/you moved 1 time/i)).toBeInTheDocument();
  });

  test('clicking the right button updates the coordinates and steps', () => {
    const rightButton = screen.getByText(/right/i);
    
    // Initial state
    expect(screen.getByText(/coordinates \(2, 2\)/i)).toBeInTheDocument();
    expect(screen.getByText(/you moved 0 times/i)).toBeInTheDocument();
    
    // Click right button
    fireEvent.click(rightButton);
    expect(screen.getByText(/coordinates \(3, 2\)/i)).toBeInTheDocument();
    expect(screen.getByText(/you moved 1 time/i)).toBeInTheDocument();
  });

  test('clicking the up button updates the coordinates and steps', () => {
    const upButton = screen.getByText(/up/i);
    
    // Initial state
    expect(screen.getByText(/coordinates \(2, 2\)/i)).toBeInTheDocument();
    expect(screen.getByText(/you moved 0 times/i)).toBeInTheDocument();
    
    // Click up button
    fireEvent.click(upButton);
    expect(screen.getByText(/coordinates \(2, 1\)/i)).toBeInTheDocument();
    expect(screen.getByText(/you moved 1 time/i)).toBeInTheDocument();
  });

  test('clicking the down button updates the coordinates and steps', () => {
    const downButton = screen.getByText(/down/i);
    
    // Initial state
    expect(screen.getByText(/coordinates \(2, 2\)/i)).toBeInTheDocument();
    expect(screen.getByText(/you moved 0 times/i)).toBeInTheDocument();
    
    // Click down button
    fireEvent.click(downButton);
    expect(screen.getByText(/coordinates \(2, 3\)/i)).toBeInTheDocument();
    expect(screen.getByText(/you moved 1 time/i)).toBeInTheDocument();
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

  test('steps counter increments by 1 after a single valid move', () => {
    const rightButton = screen.getByText(/right/i);
    expect(screen.getByText("You moved 0 times")).toBeInTheDocument(); // Initial state
    fireEvent.click(rightButton); // Single move
    expect(screen.getByText("You moved 1 time")).toBeInTheDocument();
  });

  test('submitting the form with a valid email sends a POST request', async () => {
    const emailInput = screen.getByPlaceholderText(/type email/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    // Simulate entering a valid email
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Simulate clicking the submit button
    fireEvent.click(submitButton);

    // Wait for the success message after the form is submitted
    await waitFor(() => expect(screen.getByText('Submission successful!')).toBeInTheDocument());

    // Check that fetch was called with the correct URL and payload
    expect(fetch).toHaveBeenCalledWith('http://localhost:9000/api/result', expect.objectContaining({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        x: 2,
        y: 2,
        steps: 0,
        email: 'test@example.com'
      })
    }));
  });

  test('displays error message when submitting without email', async () => {
    const submitButton = screen.getByRole('button', { name: /submit/i });

    // Simulate submitting without entering an email
    fireEvent.click(submitButton);

    // Verify that the error message is displayed
    expect(screen.getByText('Ouch: email is required')).toBeInTheDocument();
  });
});
