import classNames from "classnames";

const Grid = ({board, puzzle, handleInput, selected, setSelected, greenCount}) => {

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
                                            "green": cellIndex < greenCount
                                        }
                                    )}>
                                        <input
                                            type="text"
                                            maxLength={1}
                                            value={cell == null ? "" : cell}
                                            readOnly={isPrefilled}
                                            onFocus={() => {setSelected([rIdx, cIdx])}}
                                            onClick={() => {setSelected([rIdx, cIdx])}}
                                            onChange={(e) => {
                                                handleInput(rIdx, cIdx, e.target.value)
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