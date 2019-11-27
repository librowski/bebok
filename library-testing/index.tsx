/** @jsx createElement */
import { createElement, render } from '../src/index';
import Container from "./components/Container";
const root = document.getElementById('root');

render(root, <Container />); // render main <App /> component in root element
