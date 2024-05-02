import { IconButton as MiroIconButton } from '@mirohq/design-system';

export const buttonStyle = { borderRadius: 0, border: '1px solid #24262C', boxShadow: "2px 2px #24262C" };

export function IconButton(props: Parameters<typeof MiroIconButton>[0]) {
    const css = { ...buttonStyle, ...props.css };
    return <MiroIconButton {...props} css={css} />;
}
