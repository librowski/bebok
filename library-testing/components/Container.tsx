/** @jsx createElement */
import {createElement, createLocalState} from '../../index';
import Button from "./Button";
import Counter from "./Counter";

const style = `
    margin: 0;
    background-color: #08AEEA;
    background-image: linear-gradient(0deg, #08AEEA 0%, #2AF598 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    font-family: 'Roboto', Ubuntu, sans-serif;
    color: #fafafa;
`;

const titleStyle = `
    margin: 64px;
    font-size: 48px;
`;

const Container = () => {
    const [counter, setCounter] = createLocalState(0);

    const increaseCounter = () => setCounter(prev => prev + 1);

    return (
        <div style={style}>
            <h1 style={titleStyle}>Bebok library test</h1>
            <Counter clicks={counter}/>
            <Button onClick={increaseCounter}/>
        </div>
    );
};

export default Container;
