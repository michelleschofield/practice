import { useState } from "react";

type Piece = {
    type: string;
    color: Color;
}

type Square = {
    piece?: Piece
}

type Selected = Piece & {
    x: number;
    y: number;
}

type Color = 'black' | 'white';

type MoveInfo = {
    selected: Selected;
    x: number,
    y: number,
    attacked?: Piece;
}

function buildBoard(): Square[][] {
    const board = []
    for (let i = 0; i < 8; i++) {
        if (i === 0) {
            board.push(pieceRow('black'));
        } else if (i === 1) {
            board.push(pawnRow('black'))
        } else if (i == 6) {
            board.push(pawnRow('white'))
        } else if (i === 7) {
            board.push(pieceRow('white'));
        } else {
            board.push(blankRow());
        }
    }
    return board;
}

function blankRow(): Square[] {
    return [{},{},{},{},{},{},{},{}]
}

function pawnRow(color: Color): Square[] {
    const row: Square[] = [];
    for (let i = 0; i < 8; i++) {
        row.push({
            piece: {
                type: 'pawn',
                color: color,
            }
        });
    }
    return row;
}

function pieceRow(color: Color): Square[] {
    const row: Square[] = [
        {
            piece: {
                type: 'rook',
                color,
            }
        },
        {
            piece: {
                type: 'knight',
                color,
            }
        },
        {
            piece: {
                type: 'bishop',
                color,
            }
        },
        {
            piece: {
                type: 'queen',
                color,
            }
        },
        {
            piece: {
                type: 'king',
                color,
            }
        },
        {
            piece: {
                type: 'bishop',
                color,
            }
        },
        {
            piece: {
                type: 'knight',
                color,
            }
        },
        {
            piece: {
                type: 'rook',
                color,
            }
        }
    ];
    return row;
}

export function Chess(): JSX.Element {
    const [board, setBoard] = useState<Square[][]>(buildBoard());
    const [selected, setSelected] = useState<Selected>();

    function handleSelect(x: number, y: number, piece?: Piece): void {
        if (!selected && piece) {
            setSelected({...piece, x, y});
        }

        if (selected) {
            makeMove(selected, x, y);
        }
    }

    function makeMove(selected: Selected | undefined, x: number, y: number) {
        if (!selected) return;
        const attacked = board[x][y].piece;
        if (attacked?.color === selected.color) {
            setSelected(undefined);
            return;
        }
        const moveInfo: MoveInfo = {
            selected,
            x,
            y,
            attacked,
        }
        switch (selected.type) {
            case 'pawn': {
                pawnMove(moveInfo);
                break;
            }
            case 'knight': {
                knightMove(moveInfo);
                break;
            }

        }
        setSelected(undefined);
    }

    function knightMove({selected, x, y}: MoveInfo): void {
        const xDiff = Math.abs(selected.x - x);
        const yDiff = Math.abs(selected.y - y);
        if (xDiff === 2 && yDiff === 1) {
            movePiece(selected, x, y);
        } else if (xDiff === 1 && yDiff === 2) {
            movePiece(selected, x, y);
        }
    }

    function pawnMove({selected, x, y, attacked}: MoveInfo): void {
        if (attacked && y === selected.y) return;
        if (!attacked && y !== selected.y) return;

        if (selected.x === 6 && x === 4 && selected.color === 'white') {
            movePiece(selected, x, y);
            return;
        }

        if (selected.x === 1 && x === 3 && selected.color === 'black') {
            movePiece(selected, x, y);
            return;
        }

        const dir = selected.color === 'white' ? - 1 : 1;
        if (x !== selected.x + dir) return;

        if (Math.abs(selected.y - y) <= 1) {
            movePiece(selected, x, y);
        }
    }

    function movePiece(selected: Selected, x: number, y: number): void {
        const newBoard = [...board];
        newBoard[x][y] = {piece: {color: selected.color, type: selected.type}}
        newBoard[selected.x][selected.y] = {};
        setBoard(newBoard);
    }

    return ( 
        <div className="flex flex-col">
            {board.map((row, x) => {
                return (<div className="flex board-row" key={x}>{row.map((square, y) => {
                    return <div className={`w-20 h-20 board-square ${x === selected?.x && y === selected?.y ? 'selected' : ''}`}  onClick={() => handleSelect(x, y, square.piece)} key={y}>{square.piece?.type}</div>
                }
            )}</div>)
            })}
        </div>
    )
}


