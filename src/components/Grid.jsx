import classNames from "classnames";

const Grid = ({board, puzzle, handleInput, selected, greenCount, selectedVal, setSelectedCell}) => {

    return (
        <div className="container">
            <table className="table">
                <tbody>
                    {board.map((row, rIdx) => {
                        return (
                            <tr key={rIdx}>
                                {row.map((cell, cIdx) => {
                                    const isPrefilled = puzzle[rIdx][cIdx] !== null;
                                    const cellIndex = rIdx * 9 + cIdx;
                                    return <td key={cIdx} className={classNames(
                                        "cell",
                                        {
                                            "same-row": selected && rIdx === selected[0],
                                            "same-col": selected && cIdx === selected[1],
                                            "same-box": selected &&
                                                        Math.floor(rIdx/3) === Math.floor(selected[0]/3) &&
                                                        Math.floor(cIdx/3) === Math.floor(selected[1]/3),
                                            "green": cellIndex < greenCount,
                                            "same-value-cell": selected && cell && cell === selectedVal
                                        }
                                    )}>
                                        <input
                                            className={
                                                classNames({
                                                    "prefilled-cell": isPrefilled,
                                                    "empty-cell": !isPrefilled
                                                })
                                            }
                                            type="text"
                                            maxLength={1}
                                            value={cell == null ? "" : cell}
                                            readOnly={isPrefilled}
                                            onFocus={() => {setSelectedCell([rIdx, cIdx], cell)}}
                                            onClick={() => {setSelectedCell([rIdx, cIdx], cell)}}
                                            onChange={(e) => {
                                                console.log(e.target.value);
                                                handleInput(rIdx, cIdx, e.target.value);
                                            }}
                                        />
                                    </td>
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default Grid;