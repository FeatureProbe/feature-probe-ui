import React from 'react';

interface IProps extends  React.HTMLProps<HTMLSpanElement> {
  type: string;
  customClass?: string;
}

const Icon = (props: IProps) => {
  const { type, customClass } = props;

  return (
   <span {...props} className={`iconfont icon-${type} ${customClass}`} ></span>
  )
}
  
export default Icon;