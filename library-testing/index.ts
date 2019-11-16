import container from "./component";
import {render} from "../src/rendering";

const element = document.getElementById('root');

console.log('CONTAINER');
console.log(container);

render(element, container); // render element inside component
