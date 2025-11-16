const Difficulty = ({ easyOnClick, mediumOnClick, hardOnClick }) => {
    return (
        <div style={{marginTop: 16}}>
            <button onClick={easyOnClick} style={{ marginRight: 8 }}>Easy</button>
            <button onClick={mediumOnClick} style={{ marginRight: 8 }}>Medium</button>
            <button onClick={hardOnClick}>Hard</button>
        </div>
    )
};

export default Difficulty;