import React, { useState } from 'react';

const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at

export default function AppFunctional(props) {
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);

  function getXY() {
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;
    return { x, y };
  }

  function getXYMessage() {
    const { x, y } = getXY();
    return `Coordinates (${x}, ${y})`;
  }

  function reset() {
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex);
  }

  function getNextIndex(direction) {
    switch (direction) {
      case 'left':
        return index % 3 === 0 ? index : index - 1;
      case 'right':
        return index % 3 === 2 ? index : index + 1;
      case 'up':
        return index < 3 ? index : index - 3;
      case 'down':
        return index > 5 ? index : index + 3;
      default:
        return index;
    }
  }

  function move(evt) {
    const direction = evt.target.id;
    const newIndex = getNextIndex(direction);

    if (newIndex === index) {
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
      setIndex(newIndex);
      setSteps(steps + 1);
      setMessage('');
    }
  }

  function onChange(evt) {
    setEmail(evt.target.value);
  }

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
      setEmail('');
    } catch (error) {
      setMessage('An error occurred while submitting the form.');
    }
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} {steps === 1 ? 'time' : 'times'}</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
          <div
            key={idx}
            className={`square${idx === index ? ' active' : ''}`}
            aria-label={idx === index ? 'Current position' : null}
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
