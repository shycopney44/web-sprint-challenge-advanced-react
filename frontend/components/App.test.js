import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AppFunctional from './AppFunctional';

test('moving the active square down and left updates the coordinates correctly', () => {
  render(<AppFunctional />);
  
  const downButton = screen.getByText(/DOWN/i);
  const leftButton = screen.getByText(/LEFT/i);
  const coordinatesHeading = screen.getByText(/Coordinates/i);
  
  // Initial state check
  expect(coordinatesHeading).toHaveTextContent(/Coordinates \(2, 2\)/);
  
  // Click the "DOWN" button
  fireEvent.click(downButton);
  
  // Click the "LEFT" button
  fireEvent.click(leftButton);
  
  // Check the updated state
  expect(coordinatesHeading).toHaveTextContent(/Coordinates \(1, 3\)/);
});

test('moving the active square down twice and left twice updates the coordinates correctly', () => {
  render(<AppFunctional />);
  
  const downButton = screen.getByText(/DOWN/i);
  const leftButton = screen.getByText(/LEFT/i);
  const coordinatesHeading = screen.getByText(/Coordinates/i);
  
  // Initial state check
  expect(coordinatesHeading).toHaveTextContent(/Coordinates \(2, 2\)/);
  
  // Click the "DOWN" button twice
  fireEvent.click(downButton);
  fireEvent.click(downButton);
  
  // Click the "LEFT" button twice
  fireEvent.click(leftButton);
  fireEvent.click(leftButton);
  
  // Check the updated state
  expect(coordinatesHeading).toHaveTextContent(/Coordinates \(1, 3\)/);
});

test('limit reached message is displayed when moving up twice', () => {
  render(<AppFunctional />);
  
  const upButton = screen.getByText(/UP/i);
  const message = screen.getByText(/You can't go up/i);
  
  // Initial state check
  expect(message).not.toBeVisible();
  
  // Click the "UP" button twice
  fireEvent.click(upButton);
  fireEvent.click(upButton);
  
  // Check the limit reached message
  expect(message).toBeVisible();
});

test('steps counter works correctly', () => {
  render(<AppFunctional />);
  
  const upButton = screen.getByText(/UP/i);
  const rightButton = screen.getByText(/RIGHT/i);
  const downButton = screen.getByText(/DOWN/i);
  const leftButton = screen.getByText(/LEFT/i);
  const stepsCounter = screen.getByText(/Steps/i);
  
  // Initial state check
  expect(stepsCounter).toHaveTextContent(/Steps: 0/);
  
  // Perform a series of movements
  fireEvent.click(upButton);
  fireEvent.click(rightButton);
  fireEvent.click(downButton);
  fireEvent.click(leftButton);
  
  // Check the updated steps counter
  expect(stepsCounter).toHaveTextContent(/Steps: 4/);
});

test('limit reached message is displayed when moving up and left twice', () => {
  render(<AppFunctional />);
  
  const upButton = screen.getByText(/UP/i);
  const leftButton = screen.getByText(/LEFT/i);
  const message = screen.getByText(/You can't go left/i);
  
  // Initial state check
  expect(message).not.toBeVisible();
  
  // Click the "UP" button
  fireEvent.click(upButton);
  
  // Click the "LEFT" button twice
  fireEvent.click(leftButton);
  fireEvent.click(leftButton);
  
  // Check the limit reached message
  expect(message).toBeVisible();
});

test('reset button resets the active square', () => {
  render(<AppFunctional />);
  
  const upButton = screen.getByText(/UP/i);
  const rightButton = screen.getByText(/RIGHT/i);
  const resetButton = screen.getByText(/RESET/i);
  const coordinatesHeading = screen.getByText(/Coordinates/i);
  
  // Initial state check
  expect(coordinatesHeading).toHaveTextContent(/Coordinates \(2, 2\)/);
  
  // Perform a series of movements
  fireEvent.click(upButton);
  fireEvent.click(rightButton);
  
  // Click the "RESET" button
  fireEvent.click(resetButton);
  
  // Check the reset state
  expect(coordinatesHeading).toHaveTextContent(/Coordinates \(2, 2\)/);
});

test('limit reached message is displayed when moving up and right twice', () => {
  render(<AppFunctional />);
  
  const upButton = screen.getByText(/UP/i);
  const rightButton = screen.getByText(/RIGHT/i);
  const message = screen.getByText(/You can't go right/i);
  
  // Initial state check
  expect(message).not.toBeVisible();
  
  // Click the "UP" button
  fireEvent.click(upButton);
  
  // Click the "RIGHT" button twice
  fireEvent.click(rightButton);
  fireEvent.click(rightButton);
  
  // Check the limit reached message
  expect(message).toBeVisible();
});

test('reset button resets the message', () => {
  render(<AppFunctional />);
  
  const upButton = screen.getByText(/UP/i);
  const resetButton = screen.getByText(/RESET/i);
  const message = screen.getByText(/You can't go up/i);
  
  // Initial state check
  expect(message).not.toBeVisible();
  
  // Trigger the limit reached message
  fireEvent.click(upButton);
  fireEvent.click(upButton);
  
  // Check the limit reached message
  expect(message).toBeVisible();
  
  // Click the "RESET" button
  fireEvent.click(resetButton);
  
  // Check the reset state
  expect(message).not.toBeVisible();
});

test('limit reached message is displayed when moving right twice', () => {
  render(<AppFunctional />);
  
  const rightButton = screen.getByText(/RIGHT/i);
  const message = screen.getByText(/You can't go right/i);
  
  // Initial state check
  expect(message).not.toBeVisible();
  
  // Click the "RIGHT" button twice
  fireEvent.click(rightButton);
  fireEvent.click(rightButton);
  
  // Check the limit reached message
  expect(message).toBeVisible();
});

test('reset button resets the email input', () => {
  render(<AppFunctional />);
  
  const emailInput = screen.getByLabelText(/Email/i);
  const resetButton = screen.getByText(/RESET/i);
  
  // Initial state check
  expect(emailInput.value).toBe('');
  
  // Enter an email address
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  expect(emailInput.value).toBe('test@example.com');
  
  // Click the "RESET" button
  fireEvent.click(resetButton);
  
  // Check the reset state
  expect(emailInput.value).toBe('');
});

test('limit reached message is displayed when moving right and down twice', () => {
  render(<AppFunctional />);
  
  const rightButton = screen.getByText(/RIGHT/i);
  const downButton = screen.getByText(/DOWN/i);
  const message = screen.getByText(/You can't go down/i);
  
  // Initial state check
  expect(message).not.toBeVisible();
  
  // Click the "RIGHT" button
  fireEvent.click(rightButton);
  
  // Click the "DOWN" button twice
  fireEvent.click(downButton);
  fireEvent.click(downButton);
  
  // Check the limit reached message
  expect(message).toBeVisible();
});

test('submitting valid email does not reset coordinates or steps', () => {
  render(<AppFunctional />);
  
  const upButton = screen.getByText(/UP/i);
  const rightButton = screen.getByText(/RIGHT/i);
  const emailInput = screen.getByLabelText(/Email/i);
  const submitButton = screen.getByText(/SUBMIT/i);
  const coordinatesHeading = screen.getByText(/Coordinates/i);
  const stepsCounter = screen.getByText(/Steps/i);
  
  // Initial state check
  expect(coordinatesHeading).toHaveTextContent(/Coordinates \(2, 2\)/);
  expect(stepsCounter).toHaveTextContent(/Steps: 0/);
  
  // Perform movements
  fireEvent.click(upButton);
  fireEvent.click(rightButton);
  
  // Enter a valid email and submit
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.click(submitButton);
  
  // Check the coordinates and steps counter
  expect(coordinatesHeading).toHaveTextContent(/Coordinates \(3, 1\)/);
  expect(stepsCounter).toHaveTextContent(/Steps: 2/);
});

test('error message is displayed on invalid email submission', () => {
  render(<AppFunctional />);
  
  const downButton = screen.getByText(/DOWN/i);
  const rightButton = screen.getByText(/RIGHT/i);
  const emailInput = screen.getByLabelText(/Email/i);
  const submitButton = screen.getByText(/SUBMIT/i);
  const errorMessage = screen.getByText(/Invalid email address/i);
  
  // Initial state check
  expect(errorMessage).not.toBeVisible();
  
  // Perform movements
  fireEvent.click(downButton);
  fireEvent.click(rightButton);
  
  // Enter an invalid email and submit
  fireEvent.change(emailInput, { target: { value: 'invalid' }});