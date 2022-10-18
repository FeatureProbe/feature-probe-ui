import { ReactNode } from 'react';
import { Popup } from 'semantic-ui-react';
import { stringLimit } from '../../utils/tools';
import styles from './index.module.scss';

interface IProps {
  text: string;
  maxLength: number;
  showPopup?: boolean;
  popupRender?: ReactNode;
}

const TextLimit: React.FC<IProps> = (props) => {
  const { text, maxLength, showPopup, popupRender } = props;
  
  return text.length > 24 ? (
    <Popup
      inverted
      disabled={!showPopup}
      trigger={<span>{ stringLimit(text, maxLength) }</span>}
      content={popupRender ?? <span>{ text }</span>}
      position="top center"
      className={styles.popup}
    />
  ) : (
    <span>{text}</span>
  );
};

export default TextLimit;
