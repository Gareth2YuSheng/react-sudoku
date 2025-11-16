const SUDOKU_API = `https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:1){grids{value,solution}}}`;

const EMPTY_CELL = null;

export const fetchPuzzle = async ({
    setError,
    setStatus,
    setPuzzle,
    setSolution,
    setBoard,
    setSelected,
    difficulty
}) => {
    setError("");
    setStatus("");

    try {
        // const res = await fetch(SUDOKU_API);
        // const data = await res.json();

        // const grid = data.newboard.grids[0];
        // const puzzle = grid.value.map((row) => 
        //     row.map(cell => cell === 0 ? null : cell)
        // );
        // const solution = grid.solution.map((row) => 
        //     row.map(cell => cell === 0 ? null : cell)
        // );

        // setPuzzle(puzzle);
        // setSolution(solution);
        // setBoard(puzzle.map((row) => [...row]));
        // setSelected(null);

        ///////////////////////////////////////////////

        const [puzzle, solution] = generatePuzzle(difficulty);

        // console.log(solution);

        setPuzzle(puzzle);
        // setPuzzle(solution); // For Testing
        setSolution(solution);
        setBoard(puzzle.map((row) => [...row]));
        // setBoard(solution); // For Testing
        setSelected(null);

        // For Visual Generation
        // generateSudokuVisual(setBoard);
    } catch (e) {
        setError("Failed to fetch puzzle.", e);
    }
};

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]];   // swap
    }
    return array;
}

/*
| Difficulty | Filled cells | Empty cells |
| ---------- | ------------ | ----------- |
| Easy       | 40–45        | 36–41       |
| Medium     | 35–39        | 42–46       |
| Hard       | 28–34        | 47–53       |
*/
// Helper to check if a number can be placed at (r, c)
const isValidPlacement = (board, r, c, num) => {
    // Check row and column
    for (let i = 0; i < 9; i++) {
        if (board[r][i] === num || board[i][c] === num) {
            return false;
        }
    }

    // Check 3x3 box
    const startRow = Math.floor(r / 3) * 3;
    const startCol = Math.floor(c / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) {
                return false;
            }
        }
    }
    return true;
};

// Helper to find the next empty cell, searching sequentially
const findNextEmpty = (board) => {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] === null) {
                return [r, c];
            }
        }
    }
    return null; // Board is full
};

// Core function to count the number of valid solutions (limit 2 is efficient)
// Due to the recursive nature of the function, best not to make it an arrow func (JavaScript, Named Recursion Issue)
function countSolutions(board, limit = 1) {
    const nextEmpty = findNextEmpty(board);
    if (!nextEmpty) { //If board is full
        return 1; // Found one solution
    }

    let solutionCount = 0;
    const [r, c] = nextEmpty;

    for (let num = 1; num <= 9; num++) {
        if (isValidPlacement(board, r, c, num)) {
            board[r][c] = num;
            solutionCount += countSolutions(board, limit);
            // If we found more than 1 solution, Backtrack
            if (solutionCount > limit) {
                board[r][c] = null;
                return solutionCount; // Propagate up to stop recursion
            }
            board[r][c] = null;
        }
    }
    return solutionCount;
}

const generatePuzzle = (difficulty) => {
    // Diffculty Guidelines
    const emptyCellRanges = {
        'EASY': [36, 41],
        'MEDIUM': [42, 46],
        'HARD': [47, 53]
    };
    const DEFAULT_DIFFICULTY = "MEDIUM";

    if (difficulty) {
        difficulty = difficulty.toUpperCase();
    } else {
        difficulty = DEFAULT_DIFFICULTY;
    }

    const range = emptyCellRanges[difficulty];
    // Target is a random number within the range
    const targetEmptyCells = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0]; 
    
    // Generate a Sudoku board
    const solution = generateSudoku();
    let puzzle = solution.map(row => [...row]);

    // Prepare Removal Order, shuffle cells to ensure puzzle variation
    let cells = [];
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            cells.push([r, c]);
        }
    }
    shuffleArray(cells);

    let emptyCount = 0;    
    // Removal Loop
    for (const [r, c] of cells) {
        if (emptyCount >= targetEmptyCells) break;
        
        const val = puzzle[r][c];
        if (val === null) continue; 
        
        // Attempt removal
        puzzle[r][c] = null; 
        
        // Check if the resulting puzzle still has a unique solution
        // Set the limit to 2 so that we can check for multiple solutions
        // If we only limit to 1 then as soon as it finds the first solution it returns, 
        // ignoring the possibility of multiple solutions
        const solCount = countSolutions(puzzle.map(row => [...row]), 2); // Pass a deep copy

        if (solCount === 1) {
            emptyCount++; // Keep the cell empty and add to count
        } else {
            puzzle[r][c] = val; // Put the number back
        }
    }

    return [puzzle, solution];
};

const generateSudoku = () => {
    const rows = Array.from({ length: 9 }, () => new Set());
    const cols = Array.from({ length: 9 }, () => new Set());
    const boxes = Array.from({ length: 9 }, () => new Set());
    let cells = [];

    // If no board provided, use an empty 2D array
    const board = Array(9).fill(null).map(() => Array(9).fill(null));

    // Initalise cell list
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            cells.push([r, c]);
        }
    }

    // Shuffle cell list so we always fill in cells in a random order
    // shuffleArray(cells); // THIS IS COUNTER-PRODUCTIVE

    function backtrack(index) {
        if (index === cells.length) {
            return true; // All empty cells filled successfully
        }

        const [r, c] = cells[index];
        const boxIndex = Math.floor(r / 3) * 3 + Math.floor(c / 3);
        // console.log(`Trying: [${r}, ${c}]`); //For debugging purposes

        const candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        shuffleArray(candidates);

        // Try numbers 1 through 9
        for (let num of candidates) {
            // Check if the number is NOT present in the row, column, or box (O(1) checks)
            if (!rows[r].has(num) && 
                !cols[c].has(num) && 
                !boxes[boxIndex].has(num)) {
                
                // Place the number (Make the move)
                board[r][c] = num;
                rows[r].add(num);
                cols[c].add(num);
                boxes[boxIndex].add(num);

                // Recursively call for the next empty cell
                if (backtrack(index + 1)) {
                    return true;
                }

                // Backtrack (Undo the move)
                rows[r].delete(num);
                cols[c].delete(num);
                boxes[boxIndex].delete(num);
                board[r][c] = EMPTY_CELL;
            }
        }

        return false; // No number worked for this cell
    }

    backtrack(0);

    return board;
}

const solveSudoku = (board) => {
    const rows = Array.from({ length: 9 }, () => new Set());
    const cols = Array.from({ length: 9 }, () => new Set());
    const boxes = Array.from({ length: 9 }, () => new Set());
    const empties = []; // To track currently empty cells e.g. [r, c]

    // Initialise sets from given board
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const val = board[r][c];
            if (val === EMPTY_CELL) {
                empties.push([r, c]);
            } else {
                const boxIndex = Math.floor(r / 3) * 3 + Math.floor(c / 3);
                rows[r].add(val);
                cols[c].add(val);
                boxes[boxIndex].add(val);
            }
        }
    }

    function backtrack(index) {
        if (index === empties.length) {
            return true; // All empty cells filled successfully
        }

        const [r, c] = empties[index];
        const boxIndex = Math.floor(r / 3) * 3 + Math.floor(c / 3);

        // Try numbers 1 through 9
        for (let num = 1; num <= 9; num++) {
            // Check if the number is NOT present in the row, column, or box (O(1) checks)
            if (!rows[r].has(num) && 
                !cols[c].has(num) && 
                !boxes[boxIndex].has(num)) {
                
                // Place the number (Make the move)
                board[r][c] = num;
                rows[r].add(num);
                cols[c].add(num);
                boxes[boxIndex].add(num);

                // Recursively call for the next empty cell
                if (backtrack(index + 1)) {
                    return true;
                }

                // Backtrack (Undo the move)
                rows[r].delete(num);
                cols[c].delete(num);
                boxes[boxIndex].delete(num);
                board[r][c] = EMPTY_CELL;
            }
        }

        return false; // No number worked for this cell
    }

    backtrack(0);
};

const generateSudokuVisual = async (setBoard) => {
    const rows = Array.from({ length: 9 }, () => new Set());
    const cols = Array.from({ length: 9 }, () => new Set());
    const boxes = Array.from({ length: 9 }, () => new Set());
    const board = Array(9).fill(null).map(() => Array(9).fill(null));
    let cells = [];

    // Fill list of all cells sequentially
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            cells.push([r, c]);
        }
    }
    // shuffleArray(cells); // DO NOT SHUFFLE CELLS

    const sleep = (ms) => new Promise(res => setTimeout(res, ms));

    async function backtrack(index) {
        if (index === cells.length) return true;

        const [r, c] = cells[index];
        const boxIndex = Math.floor(r / 3) * 3 + Math.floor(c / 3);

        let candidates = [1,2,3,4,5,6,7,8,9];
        shuffleArray(candidates);

        for (let num of candidates) {

            if (!rows[r].has(num) &&
                !cols[c].has(num) &&
                !boxes[boxIndex].has(num)) {

                // Place number
                board[r][c] = num;
                rows[r].add(num);
                cols[c].add(num);
                boxes[boxIndex].add(num);

                // Trigger a visual update
                setBoard(board.map(row => [...row]));
                await sleep(5);   // <- adjust speed here

                if (await backtrack(index + 1)) return true;

                // Undo move (backtrack)
                board[r][c] = null;
                rows[r].delete(num);
                cols[c].delete(num);
                boxes[boxIndex].delete(num);

                // Show the backtracking visually
                setBoard(board.map(row => [...row]));
                await sleep(50);
            }
        }

        return false;
    }

    await backtrack(0);
};