import { Input as MiroInput } from '@mirohq/design-system';
import { forwardRef } from 'react';

export const inputStyle = { resize: 'none', fontSize: 13, borderRadius: 0, border: '1px solid #24262C' };

type InputProps = Omit<Parameters<typeof MiroInput>[0], 'clearable'>;

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const css = { ...inputStyle, ...props.css };
    return <MiroInput {...props} css={css} ref={ref} />;
});
