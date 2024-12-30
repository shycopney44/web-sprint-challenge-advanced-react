import React, { useState } from 'react';

const GRID_SIZE = 3; // Size of the grid (3x3)
const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4; // Starting index for "B"

export default function AppFunctional(props) {
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);

  // Get the x, y coordinates based on index
  function getXY() {
    const x = (index % GRID_SIZE) + 1;
    const y = Math.floor(index / GRID_SIZE) + 1;
    return { x, y };
  }

  // Get the coordinates message
  function getXYMessage() {
    const { x, y } = getXY();
    return `Coordinates (${x}, ${y})`;
  }

  // Reset the game state
  function reset() {
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex);
  }

  // Get the next index based on the direction
  function getNextIndex(direction) {
    switch (direction) {
      case 'left':
        return index % GRID_SIZE === 0 ? index : index - 1;
      case 'right':
        return index % GRID_SIZE === GRID_SIZE - 1 ? index : index + 1;
      case 'up':
        return index < GRID_SIZE ? index : index - GRID_SIZE;
      case 'down':
        return index >= GRID_SIZE * (GRID_SIZE - 1) ? index : index + GRID_SIZE;
      default:
        return index;
    }
  }

  // Handle movement button clicks
  function move(evt) {
    const direction = evt.target.id;
    const newIndex = getNextIndex(direction);

    if (newIndex === index) {
      // Out of bounds
      switch (direction) {
        case 'left':
          setMessage("You can't go left");
          break;
        case 'right':
          setMessage("You can't go right");
          break;
        case 'up':
          setMessage("You can't go up");
          break;
        case 'down':
          setMessage("You can't go down");
          break;
        default:
          setMessage('');
      }
    } else {
      // Update position and steps
      setIndex(newIndex);
      setSteps(prevSteps => prevSteps + 1);
      setMessage('');
    }
  }

  // Handle email input change
  function onChange(evt) {
    setEmail(evt.target.value);
  }

  // Handle form submission
  async function onSubmit(evt) {
    evt.preventDefault();
    const { x, y } = getXY();

    if (!email.trim()) {
      setMessage('Ouch: email is required');
      return;
    }

    const payload = { x, y, steps, email };

    try {
      const response = await fetch('http://localhost:9000/api/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data && data.message) {
        setMessage(data.message);
      } else {
        setMessage('Submission successful but no message returned.');
      }

      // Clear email and reset state after successful submission
      setEmail('');
      setMessage('');
    } catch (error) {
      setMessage('An error occurred while submitting the form.');
      console.error(error); // Log the error for debugging
    }
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} {steps === 1 ? 'time' : 'times'}</h3>
      </div>
      <div id="grid" role="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
          <div
            key={idx}
            className={`square${idx === index ? ' active' : ''}`}
            aria-label={idx === index ? 'Current position' : null}
            role="button"
            tabIndex={0}
            onClick={() => setIndex(idx)} // Allow users to click on a square to move to it
          >
            {idx === index ? 'B' : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move} aria-label="Move left">LEFT</button>
        <button id="up" onClick={move} aria-label="Move up">UP</button>
        <button id="right" onClick={move} aria-label="Move right">RIGHT</button>
        <button id="down" onClick={move} aria-label="Move down">DOWN</button>
        <button id="reset" onClick={reset} aria-label="Reset the game">RESET</button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          placeholder="type email"
          value={email}
          onChange={onChange}
          aria-label="Email input"
        />
        <input id="submit" type="submit" aria-label="Submit form" />
      </form>
    </div>
  );
}
