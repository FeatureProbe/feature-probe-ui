import { ReactNode } from 'react';
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

  if( !maxLength && !maxWidth ) {
    return <span>{text}</span>;
  } else {
    return (
      <Popup
        inverted
        disabled={!showPopup}
        trigger={
          <div 
            className={styles['limit-str-container']}
            style={{
              maxWidth: maxWidth ?? 'unset',
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
