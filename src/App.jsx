import { useEffect, useState } from 'react'
import './App.css'
import Grid from './components/Grid';
import Controls from './components/Controls';
import { fetchPuzzle } from './fetch-puzzle';
import Difficulty from './components/Difficulty';

function App() {
    // For Testing
    // const [board, setBoard] = useState(Array(9).fill(null).map(() => Array(9).fill(null)));
    // const [puzzle, setPuzzle] = useState(Array(9).fill(null).map(() => Array(9).fill(null)));
    // const [solution, setSolution] = useState(Array(9).fill(null).map(() => Array(9).fill(null)));

    const [board, setBoard] = useState(null);
    const [puzzle, setPuzzle] = useState(null);
    const [solution, setSolution] = useState(null);

    useEffect(() => {
        resetBoard(difficulty);
    }, []);

    const [selected, setSelected] = useState(null); //[row, col]
    const [selectedVal, setSelectedVal] = useState(null);
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");
    const [difficulty, setDifficulty] = useState("MEDIUM"); // Default diffculty MEDIUM

    const [greenCount, setGreenCount] = useState(0);

    const resetBoard = (diff) => {
        fetchPuzzle({setError, setStatus, setPuzzle, setSolution, setBoard, setSelected, difficulty: diff});
    };

    const handleInput = (rIdx, cIdx, value) => {
        if (value === "" || (value >= 1 && value <=9)) {
            setBoard((prev) => 
                prev.map((row, r) => 
                    row.map((cell, c) => {
                        if (r === rIdx && c === cIdx) {
                            const newCellVal = value ? parseInt(value) : null
                            if (newCellVal) {
                                setSelectedCell([r, c], newCellVal)
                            }
                            return newCellVal;
                        }

                        return cell;
                    })
                )
            );
        }
    };

    const handleCheck = () => {
        const flatBoard = board.flat();
        const flatSolution = solution.flat();

        if (flatBoard.every((cell, i) => cell === flatSolution[i])) {
            setStatus("Correct");
            
            let count = 0;
            const totalCells = 81;
            const interval = setInterval(() => {
                count++;
                setGreenCount(count);
                if (count === totalCells) clearInterval(interval);
            }, 30);

        } else {
            setStatus("Incorrect, try again.");
            setGreenCount(0);
        }
    };

    const handleReset = () => {
        setBoard(puzzle.map((row) => [...row]));
        setStatus("");
        setSelected(null);
        setSelectedVal(null);
        setGreenCount(0);
    };

    const handleDiffcultyChange = (newDiff) => {
        setDifficulty(newDiff);
        resetBoard(newDiff);
    }

    const setSelectedCell = (cellPos, val) => {
        setSelected(cellPos);
        setSelectedVal(val);
    }

    if (error) {
        return <div style={{color: "red"}}>{error}</div>;
    }

    // When loading
    if (!board) {
        return <div>Loading</div>
    }

    return (
        <div style={{textAlign: 'center'}}>
            <h1>Sudoku</h1>
            <p className="difficulty-label">{difficulty}</p>
            <Grid 
                board={board} 
                puzzle={puzzle} 
                handleInput={handleInput}
                selected={selected} 
                setSelectedCell={setSelectedCell}
                greenCount={greenCount}
                selectedVal={selectedVal} />
            <Controls handleCheck={handleCheck} handleReset={handleReset} />
            <section style={{ marginTop: "5px", textAlign: "center" }}>
                <h3>New Puzzle:</h3>
                <Difficulty 
                    easyOnClick={() => handleDiffcultyChange("EASY")}
                    mediumOnClick={() => handleDiffcultyChange("MEDIUM")}
                    hardOnClick={() => handleDiffcultyChange("HARD")}
                />
            </section>
            {status && <div className="status">{status}</div>}
        </div>
    );
}

export default App
