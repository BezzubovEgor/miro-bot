import { Textarea as MiroTextarea } from '@mirohq/design-system';

import { inputStyle } from './Input';
import { forwardRef } from 'react';


export const Textarea = forwardRef<HTMLTextAreaElement, Parameters<typeof MiroTextarea>[0]>((props, ref) => {
    const css = { ...inputStyle, ...props.css };
    return <MiroTextarea {...props} css={css} ref={ref} />;
});
