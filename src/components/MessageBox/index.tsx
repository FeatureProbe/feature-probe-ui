import { useEffect, useState } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import ReactDOM from 'react-dom';

import styles from './index.module.scss';

const RootDom = document.createElement('div');
document.body.appendChild(RootDom);

interface IProps {
  type: string;
  content: string;
  duration: number;
}

interface IObject {
  [key: string]: string;
}

interface IFn {
  (content: string, duration?: number): void;
}
interface IFunc {
  [key: string]: IFn;
}

interface IMessageProps {
  item: IProps
}

const iconObj: IObject = {
  info: 'icon-info-circle',
  success: 'icon-success-circle',
  warn: 'icon-warning-circle',
  error: 'icon-error-circle',
};

const bgObj: IObject = {
  info: 'message-content-info',
  success: 'message-content-success',
  warn: 'message-content-warn',
  error: 'message-content-error',
}

const MessageBox = (props: IProps) => {
  const [ msgs, setMsgs ] = useState<IProps[]>([]);

  useEffect(() => {
    let msgscopy = cloneDeep(msgs);

    setMsgs([...msgscopy, props]);
  }, [props]);

  return (
    <div className={styles.message}>
      {
        msgs.map((item: IProps, index: number) => {
          return (
            <Message 
              key={index}
              item={{...props}}
            />
          );
        })
      }
    </div>
  );
}

const Message = (props: IMessageProps) => {
  const { item } = props;
  const { type, content, duration } = item;
  const [ visible, setVisible ] = useState<boolean>(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration * 1000);

    return () => {
      clearTimeout(timer);
    }
  }, [duration]);


  if (!visible) return null;

  return (
    <div className={`${styles[bgObj[type]]} ${styles['message-content']}`}>
      <i className={`${styles[iconObj[type]]} ${iconObj[type]} iconfont`}></i>
      <span className={styles['message-content-text']}>{ content }</span>
    </div>
  );
}

const message: IFunc = {};

const notice = (props: IProps) => {
  return ReactDOM.render(<MessageBox {...props} />, RootDom);
}

['info', 'success', 'warn', 'error'].forEach((type: string) => {
  message[type] = (content: string, duration = 3) => {
    return notice({ content, duration, type });
  };
});

export default message;

