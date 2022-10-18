import { ReactNode, useEffect, useRef, useState } from 'react';
import { Popup, PopupProps } from 'semantic-ui-react';
import { stringLimit } from '../../utils/tools';
import styles from './index.module.scss';

interface IProps {
  text: string;
  maxLength?: number;
  showPopup?: boolean;
  popupRender?: ReactNode;
  maxWidth?: number;
  popupProps?: PopupProps;
}

const TextLimit: React.FC<IProps> = (props) => {
  const { text, maxLength, maxWidth, showPopup, popupRender, popupProps } = props;
  const ref = useRef<HTMLDivElement | null>(null);
  const [isLong, saveIsLong] = useState(false);

  useEffect(() => {
    if(ref.current) {
      if(ref.current.scrollWidth > ref.current.clientWidth) {
        saveIsLong(true);
      }
    }
  }, [ref]);

  if( !maxLength && !maxWidth ) {
    return <span>{text}</span>;
  } else {
    return (
      <Popup
        inverted
        disabled={!(showPopup && isLong)}
        trigger={
          <div 
            className={styles['limit-str-container']}
            ref={ref}
            style={{
              maxWidth: maxWidth + 'px' ?? 'unset',
            }}
          >
            { stringLimit(text, maxLength ?? 0) }
          </div>
        }
        content={popupRender ?? <span>{ text }</span>}
        position="top center"
        className={styles.popup}
        {...popupProps}
      />
    );
  }
};

export default TextLimit;
