
import { Select as MiroSelect } from '@mirohq/design-system';

import { buttonStyle } from './IconButton';

const MiroSelectTrigger = MiroSelect.Trigger;

export function Select(props: Parameters<typeof MiroSelect>[0]) {
    return <MiroSelect {...props} />;
}

Select.Trigger = function Trigger(props: Parameters<typeof MiroSelectTrigger>[0]) {
    const css = { ...buttonStyle, ...props.css };
    return <MiroSelectTrigger {...props} css={css} />;
};

Select.Value = MiroSelect.Value;
Select.Portal = MiroSelect.Portal;
Select.Content = MiroSelect.Content;
Select.Item = MiroSelect.Item;
Select.Label = MiroSelect.Label;
Select.Group = MiroSelect.Group;
Select.Separator = MiroSelect.Separator;
