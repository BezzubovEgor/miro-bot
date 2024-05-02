import { memo } from "react";

import { Heading } from "@mirohq/design-system";

const colors = ["#86b8ff", "#aca3ff"];
const weights = ["bold", "normal"];

const getRandColor = () => colors[Math.floor(Math.random() * colors.length)];
const getRandWeight = () => weights[Math.floor(Math.random() * weights.length)];

export const Header = memo((props: { children: string; }) => {
    return (<Heading css={{ padding: 40, color: "$gray-300", textAlign: 'right' }} level={2}>
        {props.children.split(' ').map((word, i) => <span key={i} style={{ color: getRandColor(), fontWeight: getRandWeight() }}>{word} </span>)}
    </Heading>);
});
