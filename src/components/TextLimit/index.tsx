import { ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Popup, PopupProps } from 'semantic-ui-react';
import { stringLimit } from '../../utils/tools';
import styles from './index.module.scss';

interface IProps {
  text: string;
  maxLength?: number;
  hidePopup?: boolean;
  popupRender?: ReactNode;
  maxWidth?: number;
  popupProps?: PopupProps;
}

const TextLimit: React.FC<IProps> = (props) => {
  const { text, maxLength, maxWidth, hidePopup, popupRender, popupProps } = props;
  const ref = useRef<HTMLDivElement | null>(null);
  const [isLong, setIsLoing] = useState<boolean>(false);

  const longJudge: () => boolean = useCallback(() => {
    if(maxLength) {
      return text.length > maxLength;
    } else if(maxWidth) {
      if(ref.current) {
        return ref.current.scrollWidth > ref.current.clientWidth;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }, [ref.current]);

  useEffect(() => {
    if(ref.current) {
      if(ref.current.clientWidth === 0 && ref.current.clientHeight === 0) {
        setTimeout(() => {
          setIsLoing(longJudge());
        }, 500);
      } else {
        setIsLoing(longJudge());
      }
    }
  }, [ref.current]);

  if( !maxLength && !maxWidth ) {
    return <span>{text}</span>;
  } else {
    return (
      <Popup
        inverted
        disabled={!(!hidePopup && isLong)}
        trigger={
          <div 
            className={`${maxWidth ? styles['limit-str-container-w'] : 'limit-str-container-n'}`}
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
