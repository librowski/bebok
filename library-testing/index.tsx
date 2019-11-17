/** @jsx bebokJSX */
import { bebokJSX } from "../src/jsx";
import Container from "./component";
import {render} from "../src/rendering";

const element = document.getElementById('root');

console.log('CONTAINER');
console.log(Container);

render(element, <Container />); // render element inside component
