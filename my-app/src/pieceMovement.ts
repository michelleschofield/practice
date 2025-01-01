import { Coords, MoveInfo, Board } from "./Chess";

export function kingMove({ xDiff, yDiff }: MoveInfo): boolean {
    return Math.abs(xDiff) <= 1 && Math.abs(yDiff) <= 1
}

export function queenMove(moveInfo: MoveInfo): boolean {
    return bishopMove(moveInfo) || rookMove(moveInfo);
}

export function rookMove({ selected, x, y, xDiff, yDiff, board }: MoveInfo): boolean {
    if (xDiff && yDiff) return false;

    let xDir = 0;
    if (xDiff) {
        xDir = xDiff < 0 ? -1 : 1;
    }

    let yDir = 0;
    if (yDiff) {
        yDir = yDiff < 0 ? -1 : 1;
    }

    const line = getLine([selected.x, selected.y], [xDir, yDir]);
    if (lineClear(line, [x, y], board)) {
        return true
    }

    return false;
}

export function bishopMove({ selected, x, y, xDiff, yDiff, board }: MoveInfo): boolean {
    if (!xDiff || !yDiff) return false;
    if (Math.abs(xDiff) !== Math.abs(yDiff)) return false;

    const xDir = xDiff < 0 ? -1 : 1;
    const yDir = yDiff < 0 ? -1 : 1;

    const line = getLine([selected.x, selected.y], [xDir, yDir]);
    if (lineClear(line, [x, y], board)) {
        return true;
    }
    return false;
}

export function knightMove({ xDiff, yDiff }: MoveInfo): boolean {
    const xDiffAbs = Math.abs(xDiff);
    const yDiffAbs = Math.abs(yDiff);
    if (xDiffAbs === 2 && yDiffAbs === 1) {
        return true
    } else if (xDiffAbs === 1 && yDiffAbs === 2) {
        return true
    }
    return false;
}

export function pawnMove({ selected, x, y, yDiff, attacked }: MoveInfo): boolean {
    if (attacked && !yDiff) return false;
    if (!attacked && yDiff) return false;

    if (selected.x === 6 && x === 4 && selected.color === "white") {
        return true
    }

    if (selected.x === 1 && x === 3 && selected.color === "black") {
        return true;
    }

    const dir = selected.color === "white" ? -1 : 1;
    if (x !== selected.x + dir) return false;

    if (Math.abs(selected.y - y) <= 1) {
        return true;
    }
    return false;
}

/**
     * check if a line on the board is clear
     * @param line set of coords in line
     * @param end will stop checking at these coords, will not check the board at these coords
     * @returns whether or not the line is clear
     */
function lineClear(line: Coords[], end: Coords, board: Board): boolean {
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