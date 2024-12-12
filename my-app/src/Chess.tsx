import { useState } from "react";

type Coords = [number, number];

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
            case 'rook': {
                rookMove(moveInfo);
                break;
            }
            case 'bishop': {
                bishopMove(moveInfo);
                break;
            }
            case 'queen': {
                queenMove(moveInfo);
                break;
            }

        }
        setSelected(undefined);
    }

    function queenMove({selected, x, y}: MoveInfo): void {
        const xDiff = x -  selected.x;
        const yDiff = y - selected.y;
        if (xDiff && yDiff) {
            bishopMove({selected, x, y});
        } else {
            rookMove({selected, x, y});
        }
    }

    function rookMove({selected, x, y}: MoveInfo): void {
        const xDiff = x -  selected.x;
        const yDiff = y - selected.y;
        if (xDiff && yDiff) return;

        let xDir = 0;
        if (xDiff) {
            xDir = xDiff < 0 ? -1 : 1;
        }

        let yDir = 0;
        if (yDiff) {
            yDir = yDiff < 0 ? -1 : 1;
        }

        const line = getLine([selected.x, selected.y], [xDir, yDir]);
        if (lineClear(line, [x, y])) {
            movePiece(selected, x, y);
        }
    }

    function bishopMove({selected, x, y}: MoveInfo): void {
        const xDiff = x -  selected.x;
        const yDiff = y - selected.y;
        if (!xDiff || !yDiff) return;
        if (Math.abs(xDiff) !== Math.abs(yDiff)) return;

        const xDir = xDiff < 0 ? -1 : 1;
        const yDir = yDiff < 0 ? -1 : 1;

        const line = getLine([selected.x, selected.y], [xDir, yDir]);
        if (lineClear(line, [x, y])) {
            movePiece(selected, x, y);
        }
    }

    /**
     * check if a line on the board is clear
     * @param line set of coords in line
     * @param end will stop checking at these coords, will not check the board at these coords
     * @returns whether or not the line is clear
     */
    function lineClear(line: Coords[], end: Coords): boolean {
        for (let i = 0; i < line.length; i++) {
            const [x, y] = line[i];
            if (x === end[0] && y === end[1]) break;
            if (board[x][y].piece) return false;
        }
        return true;
    }

    function getLine(start: Coords, dir: [number, number]): Coords[] {
        let [x, y] = start;
        x += dir[0];
        y += dir[1];
        const coords: Coords[] = [];
        while (insideBoard(x, y)) {
            coords.push([x, y]);
            x += dir[0];
            y += dir[1];
        }
        return coords;
    }

    function insideBoard(x: number, y: number): boolean {
        if (x > 7 || x < 0) return false;
        if (y > 7 || y < 0) return false;
        return true;
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


