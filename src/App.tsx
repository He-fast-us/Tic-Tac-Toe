import './App.css';
import React, { useReducer } from 'react';

function Square(props: { onClick: () => void, value: SquareValue, className?: string }) { // "?" here just makes the className property optional
  return ( //the backticks below, `, are used instead of quotes to allow for interpolation in button's className properties 
    <button className={`square ${props.className}`} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

type BoardProps = {
  squares: Array<SquareValue>, // Array<SquareValue> is identical to SquareValue[]
  onClick: (index: number) => void,
  winningLine?: number[],
}

function Board(props: BoardProps) {

  const isinwinningLine = (i: number) => props.winningLine?.includes(i)
  const renderSquare = (i: number) =>
    <Square
      value={props.squares[i]}
      onClick={() => props.onClick(i)}
      className={isinwinningLine(i) ? "winning-line" : ""}
    />

  return (
    <div className="board">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
    </div>
  );
}

type SquareValue = "X" | "O" | null

type GameState = {
  history: Array<{ squares: Array<SquareValue> }>,
  stepNumber: number,
  xIsNext: boolean,
}

// possible responses to a user click
type Action =
  | { type: "clickSquare", index: number } // which squaure was clicked
  | { type: "jumpTo", step: number } // which turn was jumped back to

// action creators
const clickSquare = (index: number): Action => ({ type: "clickSquare", index })
const jumpTo = (step: number): Action => ({ type: "jumpTo", step })

function updateGameState(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "clickSquare":
      const history = state.history.slice(0, state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice(); // slice() makes a copy of the original array
      if (calculateWinner(squares) || squares[action.index] != null) {
        return state;
      }
      squares[action.index] = state.xIsNext ? "X" : "O"; // condensed if/else statement
      return {
        history: history.concat([
          {
            squares: squares
          }
        ]),
        stepNumber: history.length,
        xIsNext: !state.xIsNext
      }

    case "jumpTo":
      return {
        ...state,
        stepNumber: action.step,
        xIsNext: (action.step % 2) === 0,
      }
  }
}

const initialState: GameState = {
  history: [{ squares: Array(9).fill(null) }],
  stepNumber: 0,
  xIsNext: true,
}

function Game() {
  const [state, dispatch] = useReducer(updateGameState, initialState)

  const history = state.history;
  const current = history[state.stepNumber];
  const winningplayer = calculateWinner(current.squares);
  console.log("winningplayer", winningplayer);

  const moves = history.map((step, move) => {
    const desc = move !== 0 ?
      'Go to move #' + move :
      'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => dispatch(jumpTo(move))}>{desc}</button>
      </li>
    );
  });

  let status: string;
  if (winningplayer) {
    status = `Player ${winningplayer.winner} wins!`;
  } else {
    status = "Next player: " + (state.xIsNext ? "X" : "O");
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={i => dispatch(clickSquare(i))}
          winningLine={winningplayer?.line /* "?" will check winningplayer.line for null before returning, to prevent crash */}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// ========================================

function calculateWinner(squares: Array<SquareValue>): { winner: "X" | "O", line: number[] } | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (const line of lines) {
    const [a, b, c] = line; // destructuring assignment
    const [square_a, square_b, square_c] = [squares[a], squares[b], squares[c]]
    if (square_a != null && square_a === square_b && square_a === square_c) { // runs check for winning row
      return { winner: square_a, line }; // squares[a] could be "X" or "O," and "line" will return winning line
    }
  }
  return null;
}

export default Game;
