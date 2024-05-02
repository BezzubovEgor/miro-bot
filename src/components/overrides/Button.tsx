import { Button as MiroButton } from '@mirohq/design-system';

import { buttonStyle } from './IconButton';
import { forwardRef } from 'react';

type ButtonProps = Omit<Parameters<typeof MiroButton>[0], 'clearable'>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const css = { ...buttonStyle, ...props.css };
    return <MiroButton {...props} css={css} ref={ref} />;
});
