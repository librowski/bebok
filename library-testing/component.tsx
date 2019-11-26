/** @jsx createElement */
import { createElement } from "../src/jsx";

const containerStyle = `
    border: 5px black solid;
    background: #AFAFAF;
    font-family: sans-serif;
`;

const headerStyle = `
    color: #3F5F7F;
    font-size: 16px;
`;

const Component = ({ testProp }: { testProp: string }) => {
    return (
        <div style={containerStyle}>
            <h1 style={headerStyle}>
                Bebok JS
            </h1>
            <div
                style='background: #FAFAFA; box-shadow: 3px 5px 0px 0px #999999; margin: 5px;'>
                TestProp: {testProp || 'brak'}
            </div>
            {[1, 2].map(a => `numer ${a}`)}
        </div>
    );
};

const Container = () => {
    return (
        <div>
            <Component testProp={'cokolwiek'} />
            <Component testProp={'coś innego'} />
        </div>
    )
};

export default Container;
