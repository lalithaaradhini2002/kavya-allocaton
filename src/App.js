import React, { useState, useEffect } from 'react';
import './App.css';  // Adjust the path if necessary

const SeatAllocationApp = () => {
  const rows = 10; // Number of rows
  const seatsPerRow = 10; // Number of seats per row
  const totalSeats = rows * seatsPerRow; // Total number of seats available
  const [seats, setSeats] = useState(Array(totalSeats).fill(null)); // null represents an available seat
  const [userInput, setUserInput] = useState({ msid: '', duration: '', seat: '' });

  // Function to handle seat selection
  const handleSeatSelection = (index) => {
    if (seats[index]) return; // Seat already blocked

    const duration = parseInt(userInput.duration, 10) * 1000; // Convert seconds to milliseconds
    if (!userInput.msid || isNaN(duration)) {
      alert('Please provide a valid MSID and duration.');
      return;
    }

    const updatedSeats = [...seats];
    updatedSeats[index] = { msid: userInput.msid, expiresAt: Date.now() + duration }; // Block the seat with expiration time
    setSeats(updatedSeats);
  };

  // Handle manual seat blocking via seat input
  const handleManualBlock = () => {
    const seatIndex = getSeatIndex(userInput.seat);
    if (seatIndex === -1) {
      alert('Invalid seat input. Please enter a valid seat number.');
      return;
    }

    const duration = parseInt(userInput.duration, 10) * 1000; // Convert seconds to milliseconds
    if (!userInput.msid || isNaN(duration)) {
      alert('Please provide a valid MSID and duration.');
      return;
    }

    const updatedSeats = [...seats];
    updatedSeats[seatIndex] = { msid: userInput.msid, expiresAt: Date.now() + duration }; // Block the seat
    setSeats(updatedSeats);
  };

  // Convert seat input (e.g., "A1", "B5") to index
  const getSeatIndex = (seat) => {
    const row = seat.charAt(0).toUpperCase(); // First character is the row
    const seatNumber = parseInt(seat.slice(1), 10); // Rest is the seat number

    // Check if input is valid
    if (row < 'A' || row > 'J' || seatNumber < 1 || seatNumber > 10) {
      return -1; // Invalid seat
    }

    // Convert the seat to a zero-based index
    const rowIndex = row.charCodeAt(0) - 'A'.charCodeAt(0); // Convert 'A' to 0, 'B' to 1, etc.
    const seatIndex = rowIndex * seatsPerRow + (seatNumber - 1); // Seat number adjusted by -1 to match index

    return seatIndex;
  };

  // Update seat availability based on expiration time
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedSeats = seats.map((seat) =>
        seat && seat.expiresAt <= Date.now() ? null : seat
      );
      setSeats(updatedSeats);
    }, 1000);

    return () => clearInterval(interval);
  }, [seats]);

  // Function to generate seat labels like A1, A2, etc.
  const getSeatLabel = (index) => {
    const row = String.fromCharCode('A'.charCodeAt(0) + Math.floor(index / seatsPerRow)); // Get row letter
    const seatNumber = (index % seatsPerRow) + 1; // Get seat number
    return `${row}${seatNumber}`;
  };

  return (
    <div className="app-container">
      <h1 className="title">Seat Allocation System</h1>

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter MSID"
          className="input-field"
          value={userInput.msid}
          onChange={(e) => setUserInput({ ...userInput, msid: e.target.value })}
        />
        <input
          type="number"
          placeholder="Enter duration (seconds)"
          className="input-field"
          value={userInput.duration}
          onChange={(e) => setUserInput({ ...userInput, duration: e.target.value })}
        />
        <input
          type="text"
          placeholder="Enter seat (e.g., A1, B5)"
          className="input-field"
          value={userInput.seat}
          onChange={(e) => setUserInput({ ...userInput, seat: e.target.value })}
        />
        <button className="submit-button" onClick={handleManualBlock}>Submit</button>
      </div>

      <div className="seat-grid">
        {seats.map((seat, index) => (
          <div
            key={index}
            className={`seat ${seat ? 'blocked' : 'available'}`}
            onClick={() => handleSeatSelection(index)}
          >
            <span className="seat-text">
              {seat ? `Blocked by ${seat.msid}` : getSeatLabel(index)} {/* Show seat label or "Blocked" */}
            </span>
          </div>
        ))}
      </div>

      <p className="footer-text">* Seats are blocked for the specified duration.</p>
    </div>
  );
};

export default SeatAllocationApp;
