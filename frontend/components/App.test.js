import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AppFunctional from './AppFunctional';

// Test 1: Check that the visible texts in headings render on the screen
test('renders the headings with correct text content', () => {
  render(<AppFunctional />);
  expect(screen.getByText("Coordinates")).toBeInTheDocument();
  expect(screen.getByText("You moved")).toBeInTheDocument();
  expect(screen.getByText("Submission successful but no message returned.")).toBeInTheDocument();
});

// Test 2: Check that the visible texts in buttons render on the screen
test('renders the buttons with correct text content', () => {
  render(<AppFunctional />);
  expect(screen.getByText("LEFT")).toBeInTheDocument();
  expect(screen.getByText("UP")).toBeInTheDocument();
  expect(screen.getByText("RIGHT")).toBeInTheDocument();
  expect(screen.getByText("DOWN")).toBeInTheDocument();
  expect(screen.getByText("RESET")).toBeInTheDocument();
  expect(screen.getByText("submit")).toBeInTheDocument();
});

// Test 3: Check that the email input is rendered
test('renders the email input field', () => {
  render(<AppFunctional />);
  expect(screen.getByPlaceholderText("type email")).toBeInTheDocument();
});

// Test 4: Check that typing in the email input results in its value changing
test('email input value changes upon typing', () => {
  render(<AppFunctional />);
  const emailInput = screen.getByPlaceholderText("type email");
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  expect(emailInput.value).toBe('test@example.com');
});

// Test 5: Check that the submission form handles form submission correctly
test('form submission works and displays correct message', async () => {
  render(<AppFunctional />);
  const emailInput = screen.getByPlaceholderText("type email");
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.click(screen.getByText("submit"));
  const message = await screen.findByText("Submission successful but no message returned.");
  expect(message).toBeInTheDocument();
});
