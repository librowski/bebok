/** @jsx createElement */
import { createElement } from '../../src/index';

type Props = {
    onClick: (e: MouseEvent) => void;
}

const style = `
    background: rgb(200, 255, 200) 100%;
    outline: none;
    font-family: 'Roboto', Ubuntu, sans-serif;
    margin: 16px;
    padding: 16px;
    border-radius: 32px;
    border: none;
    box-shadow: 1px 2px 1px 1px #00000066;
    cursor: pointer;
`;

const Button = ({ onClick }: Props) => (
  <button onClick={onClick} style={style}>
      Increase
  </button>
);

export default Button;
