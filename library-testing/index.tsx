/** @jsx createElement */
import { createElement, render } from '../src/index';
import App from "./component";
const root = document.getElementById('root');

console.log('APP');
console.log(App);

render(root, <App />); // render main <App /> component in root element
