/** @jsx createElement */
import { createElement } from '../../index';

type Props = {
    clicks: number;
}

const style = `
    outline: none;
    margin: 16px;
    font-size: 32px;
`;

const Counter = ({ clicks }: Props) => (
    <div style={style}>{ clicks }</div>
);

export default Counter;
