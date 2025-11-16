const Controls = ({handleCheck, handleReset}) => {
    return (
        <div style={{marginTop: 16}}>
            <button onClick={handleCheck} style={{ marginRight: 8 }}>Check</button>
            <button onClick={handleReset} style={{ marginRight: 8 }}>Reset</button>
        </div>
    )
};

export default Controls;