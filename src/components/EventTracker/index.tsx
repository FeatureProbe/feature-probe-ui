import React, { SyntheticEvent } from 'react';

interface IProps {
  action: string;
  children: any;
}

const EventTracker = (props: IProps) => {
  const { action, children } = props;
  const onClick = (e: SyntheticEvent) => {
    const action1 = action || '未命名';
    // TaoTie.trackUserClickEvent(action);
    console.log(action1);

    if (typeof children.props.onClick === 'function') {
      children.props.onClick(e);
    }
  }

  const onlychildren = React.Children.only(children);
  
  return React.cloneElement(
    onlychildren,
    {
      ...props,
      onClick: onClick,
    },
    children.props.children
  );
}

export default EventTracker;
