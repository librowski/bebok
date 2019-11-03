import component from "./component";
import {render} from "../src/rendering";

const element = document.getElementById('root');

render(element, component); // render element inside component

console.log('COMPONENT');
console.log(component);
