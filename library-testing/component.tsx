/** @jsx bebokJSX */
import { bebokJSX } from "../src/jsx";

const containerStyle = `
    border: 5px black solid;
    background: #AFAFAF;
    font-family: sans-serif;
`;

const headerStyle = `
    color: #3F5F7F;
    font-size: 16px;
`;

const component = (
    <div style={containerStyle}>
        <h1 style={headerStyle}>
            BebokJS
        </h1>
        <div style='background: #FAFAFA; box-shadow: 3px 5px 0px 0px #999999; margin: 5px;'>
            Oto prosty test działania biblioteki
        </div>
    </div>
);

export default component;
