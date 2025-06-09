import { useState } from "react";

function Square({ value, onSquareClick }) {
    return (
        <button
            className="square  h-20 w-20 text-3xl font-bold border border-gray-400 hover:bg-gray-200"
            onClick={onSquareClick}
        >
            {value}
        </button>
    );
}

function Board({ xIsNext, squares, onPlay }) {
    function handleClick(i) {
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        }
        onPlay(nextSquares);
    }

    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = "Winner: " + winner;
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    return (
        <>
            <div className="status p-4 text-xl font-semibold">{status}</div>

            <div className="flex flex-col gap-2">
                {[0, 3, 6].map((rowStart) => (
                    <div key={rowStart} className="flex gap-2 justify-center">
                        {" "}
                        {[0, 1, 2].map((colOffset) => (
                            <Square
                                key={rowStart + colOffset}
                                value={squares[rowStart + colOffset]}
                                onSquareClick={() =>
                                    handleClick(rowStart + colOffset)
                                }
                            />
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
}

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove]; // 현재 움직임에 해당하는 보드 상태를 가져옴(lendering)

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]; // history.slice(0, currentMove + 1)의 이전 기록 중 해당 부분만 유지하도록
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1); // 시간을 거슬러 올라가 그 지점에서 새로운 움직임을 만들 경우, 그 지점까지의 기록만 유지해야함
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }
    const moves = history.map((squares, move) => {
        let description;
        if (move > 0) {
            description = "Go to move #" + move;
        } else {
            description = "Go to game start";
        }
        return (
            <li key={move}>
                <button
                    className="border p-2 rounded hover:bg-slate-100"
                    onClick={() => jumpTo(move)}
                >
                    {description}
                </button>
            </li>
        );
    });

    return (
        <div className="game flex  item-center justify-center gap-8 p-8">
            <div className="game-board p-20 ">
                <Board
                    xIsNext={xIsNext}
                    squares={currentSquares}
                    onPlay={handlePlay}
                />
            </div>
            <div className="game-info flex flex-col p-20 pt-32">
                <ol className="flex flex-col gap-2">{moves}</ol>
            </div>
        </div>
    );
}

function calculateWinner(squares) {
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
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            return squares[a];
        }
    }
    return null;
}
