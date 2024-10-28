import React, { useState } from 'react';
import './App.css';

// Constants for player symbols
const PLAYER_ONE = 'X';
const PLAYER_TWO = 'O';

const Box = ({ value, onClick, disabled }) => {
  return (
    <button className="box" onClick={onClick} disabled={disabled}>
      {value}
    </button>
  );
};

const Grid = ({ grid, onBoxClick, gridIndex, possibleMoves }) => {
  return (
    <div className="grid">
      {grid.map((value, boxIndex) => (
        <Box
          key={boxIndex}
          value={value}
          onClick={() => {
            console.log("ON CLICK OF BOX");
            onBoxClick(gridIndex, boxIndex)
          }}
          disabled={!possibleMoves[gridIndex][boxIndex]} 
        />
      ))}
    </div>
  );
};

const App = () => {
  console.log("APP NOW");
  const [grids, setGrids] = useState(Array(9).fill(Array(9).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER_ONE);
  const [possibleMoves, setPossibleMoves] = useState(Array(9).fill().map(() => Array(9).fill(true))); // 2D array for possible moves
  const [winner, setWinner] = useState(null);

  const checkWinner = (gridIndex) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (grids[gridIndex][a] && grids[gridIndex][a] === grids[gridIndex][b] && grids[gridIndex][a] === grids[gridIndex][c]) {
        return grids[gridIndex][a];
      }
    }
    return null;
  };

  const handleBoxClick = (gridIndex, boxIndex) => {
    console.log("HANDLE BOX CLICK GRID INDEX", gridIndex);
    console.log("HANDLE BOX CLICK BOX INDEX", boxIndex);
    if (grids[gridIndex][boxIndex] || winner) return;
  
    console.log("DID NOT RETURN");
    // Create a new copy of the grids
    const newGrids = grids.map((grid, index) => (index === gridIndex ? [...grid] : grid));
    newGrids[gridIndex][boxIndex] = currentPlayer;
  
    // Check for a winner in the current grid
    const winningPlayer = checkWinner(gridIndex);
    if (winningPlayer) {
      setWinner(winningPlayer);
    }

    console.log("NO WINNER SET");
  
    // Determine the next allowed grid for the next player
    const nextGridIndex = boxIndex; // The next grid is determined by the box clicked
    console.log("NEXT GRID INDEX", nextGridIndex);
    console.log(possibleMoves);
    // Create a new moves array
    setPossibleMoves((prevMoves) => {
      const newMoves = prevMoves.map((row) => [...row]); // Clone the previous state
      newMoves.forEach((row, idx) => row.fill(false)); // Disable all moves
      newMoves[nextGridIndex].fill(true); // Allow moves only in the next grid
      return newMoves;
    });

    // Update the state
    setGrids(newGrids);
    setCurrentPlayer(currentPlayer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE);
  };

  return (
    <div className="game">
      <h1 className='title'>Tic Tac Toe</h1>
      {winner && <h2>Winner: {winner}</h2>}
      <div className="game-board">
        {grids.map((grid, gridIndex) => (
          <Grid
            key={gridIndex}
            grid={grid}
            onBoxClick={handleBoxClick}
            gridIndex={gridIndex}
            disabled={!possibleMoves[gridIndex]}
            possibleMoves={possibleMoves} 
          />
        ))}
      </div>
      <button onClick={() => {
        setGrids(Array(9).fill(Array(9).fill(null)));
        setCurrentPlayer(PLAYER_ONE);
        setWinner(null);
        setPossibleMoves(Array(9).fill().map(() => Array(9).fill(true))); // Reset possible moves
      }}>Restart Now</button>
    </div>
  );
};

export default App;
