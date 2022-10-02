import './App.css';
import React, { useReducer } from 'react';

function Square(props: { onClick: () => void, value: SquareValue }) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

type BoardProps = {
  squares: Array<SquareValue>, // Array<SquareValue> is identical to SquareValue[]
  onClick: (index: number) => void,
}

function Board(props: BoardProps) {

  const renderSquare = (i: number) =>
    <Square
      value={props.squares[i]}
      onClick={() => props.onClick(i)}
    />

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

type SquareValue = "X" | "O" | null

type GameState = {
  history: Array<{ squares: Array<SquareValue> }>,
  stepNumber: number,
  xIsNext: boolean,
}

type Action =
  | { type: "clickSquare", index: number }
  | { type: "jumpTo", step: number }

// action creators
const clickSquare = (index: number): Action => ({ type: "clickSquare", index })
const jumpTo = (step: number): Action => ({ type: "jumpTo", step })

function updateGameState(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "clickSquare":
      const history = state.history.slice(0, state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice(); // slice() makes a copy of the original array
      if (calculateWinner(squares) || squares[action.index]) {
        return state;
      }
      squares[action.index] = state.xIsNext ? "X" : "O";
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
  const winner = calculateWinner(current.squares);

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
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (state.xIsNext ? "X" : "O");
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={i => dispatch(clickSquare(i))}
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

function calculateWinner(squares: Array<SquareValue>) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default Game;
