import { useState } from "react";
import {
    pawnMove,
    knightMove,
    rookMove,
    bishopMove,
    queenMove,
    kingMove,
} from "./pieceMovement";

export type Coords = [number, number];

type Piece = {
    type: string;
    color: Color;
};

type Square = {
    piece?: Piece;
};

type Selected = Piece & {
    x: number;
    y: number;
};

type Color = "black" | "white";

export type Board = Square[][];

export type MoveInfo = {
    board: Square[][];
    selected: Selected;
    x: number;
    y: number;
    xDiff: number;
    yDiff: number;
    attacked?: Piece;
};

function buildBoard(): Square[][] {
    const board = [];
    for (let i = 0; i < 8; i++) {
        if (i === 0) {
            board.push(pieceRow("black"));
        } else if (i === 1) {
            board.push(pawnRow("black"));
        } else if (i == 6) {
            board.push(pawnRow("white"));
        } else if (i === 7) {
            board.push(pieceRow("white"));
        } else {
            board.push(blankRow());
        }
    }
    return board;
}

function blankRow(): Square[] {
    return [{}, {}, {}, {}, {}, {}, {}, {}];
}

function pawnRow(color: Color): Square[] {
    const row: Square[] = [];
    for (let i = 0; i < 8; i++) {
        row.push({
            piece: {
                type: "pawn",
                color: color,
            },
        });
    }
    return row;
}

function pieceRow(color: Color): Square[] {
    const row: Square[] = [
        {
            piece: {
                type: "rook",
                color,
            },
        },
        {
            piece: {
                type: "knight",
                color,
            },
        },
        {
            piece: {
                type: "bishop",
                color,
            },
        },
        {
            piece: {
                type: "queen",
                color,
            },
        },
        {
            piece: {
                type: "king",
                color,
            },
        },
        {
            piece: {
                type: "bishop",
                color,
            },
        },
        {
            piece: {
                type: "knight",
                color,
            },
        },
        {
            piece: {
                type: "rook",
                color,
            },
        },
    ];
    return row;
}

export function Chess(): JSX.Element {
    const [board, setBoard] = useState<Square[][]>(buildBoard());
    const [turn, setTurn] = useState<Color>("white");
    const [selected, setSelected] = useState<Selected>();

    function handleSelect(x: number, y: number, piece?: Piece): void {
        if (!selected && piece?.color === turn) {
            setSelected({ ...piece, x, y });
        }

        if (selected) {
            makeMove(selected, x, y);
        }
    }

    function toggleTurn(): void {
        const color = turn === "white" ? "black" : "white";
        setTurn(color);
    }

    function makeMove(selected: Selected | undefined, x: number, y: number) {
        if (!selected) return;
        if (canMove(selected, x, y, board)) {
            movePiece(selected, x, y);
            setSelected(undefined);
        }
    }

    function canMove(
        selected: Selected,
        x: number,
        y: number,
        board: Board
    ): boolean {
        const attacked = board[x][y].piece;

        if (attacked?.color === selected.color) {
            setSelected(undefined);
            return false;
        }
        const xDiff = x - selected.x;
        const yDiff = y - selected.y;
        const moveInfo: MoveInfo = {
            board,
            selected,
            x,
            y,
            xDiff,
            yDiff,
            attacked,
        };

        switch (selected.type) {
            case "pawn":
                return pawnMove(moveInfo);

            case "knight":
                return knightMove(moveInfo);

            case "rook":
                return rookMove(moveInfo);

            case "bishop":
                return bishopMove(moveInfo);

            case "queen":
                return queenMove(moveInfo);

            case "king":
                return kingMove(moveInfo);
        }
        return false;
    }

    function movePiece(selected: Selected, x: number, y: number): void {
        const newBoard = [...board];
        newBoard[x][y] = {
            piece: { color: selected.color, type: selected.type },
        };
        newBoard[selected.x][selected.y] = {};
        setBoard(newBoard);
        toggleTurn();
    }

    return (
        <>
            <p>{turn}</p>
            <div className="flex flex-col">
                {board.map((row, x) => {
                    return (
                        <div className="flex board-row" key={x}>
                            {row.map((square, y) => {
                                return (
                                    <div
                                        className={`w-20 h-20 board-square ${
                                            x === selected?.x &&
                                            y === selected?.y
                                                ? "selected"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleSelect(x, y, square.piece)
                                        }
                                        key={y}
                                    >
                                        {square.piece?.type}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </>
    );
}
