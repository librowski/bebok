/** @jsx createElement */
import { createElement } from "../src/jsx";
import App from "./component";
import {render} from "../src/rendering";

const root = document.getElementById('root');

console.log('APP');
console.log(App);

render(root, <App />); // render main <App /> component in root element
