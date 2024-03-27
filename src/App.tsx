import { useState } from 'react'
import { calculateWinner } from './utils/calculateWinner'

function Square({ value, onSquareClick }: { value: string; onSquareClick: () => void }) {
  const squareClass = `square ${value ? value.toLowerCase() : ''}`
  return (
    <button className={squareClass} onClick={onSquareClick}>
      {value || ''}
    </button>
  )
}

function Board({ xIsNext, squares, onPlay }: { xIsNext: boolean; squares: string[]; onPlay: (nextSquares: string[]) => void }) {
  function handleClick(i: number) {
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    const nextSquares = squares.slice()
    if (xIsNext) {
      nextSquares[i] = 'X'
    } else {
      nextSquares[i] = 'O'
    }
    onPlay(nextSquares)
  }

  const winner = calculateWinner(squares)
  let status
  if (winner) {
    status = 'Winner: ' + winner
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O')
  }
  const statusClass = winner ? 'status winner' : xIsNext ? 'status x-player' : 'status o-player'
  return (
    <>
      <div className={statusClass}>{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  )
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)
  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove]

  function handlePlay(nextSquares: string[]) {
    const nextHistory = history.slice(0, currentMove + 1).concat([nextSquares])
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove)
  }

  function resetGame() {
    setHistory([Array(9).fill(null)])
    setCurrentMove(0)
  }
  const winner = calculateWinner(currentSquares)
  const isGameOver = winner || currentSquares.every((square) => square !== null)

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => jumpTo(Math.max(currentMove - 1, 0))} disabled={currentMove === 0}>
          Previous Turn
        </button>
        <button
          className="nextTurn"
          onClick={() => jumpTo(Math.min(currentMove + 1, history.length - 1))}
          disabled={currentMove === history.length - 1}
        >
          Next Turn
        </button>
        {isGameOver && (
          <button className="replay" onClick={resetGame}>
            Replay
          </button>
        )}
      </div>
    </div>
  )
}
