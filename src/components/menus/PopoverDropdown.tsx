import * as Dropdown from '@radix-ui/react-dropdown-menu'
import * as Popover from '@radix-ui/react-popover'


/**
 * 增加 type, 暂用不影响布局的 popover
 */
export const PopoverDropdown = ({type = "popover", trigger, content, ...rest}) => {
  let Root = Popover.Root;
  let Trigger = Popover.Trigger;
  let Content = Popover.Content;
  if (type === "dropdown") {
    Root = Dropdown.Root;
    Trigger = Dropdown.Trigger;
    Content = Dropdown.Content;
  }

  return (
      <Root>
        <Trigger asChild>
          {trigger}
        </Trigger>
        <Content asChild>
          {content}
        </Content>
      </Root>
  );
}
