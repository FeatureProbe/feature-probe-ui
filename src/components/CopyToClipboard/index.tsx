import { ReactElement, useState } from 'react';
import debounce from 'lodash/debounce';
import { Popup } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Icon from 'components/Icon';
import styles from './index.module.scss';

interface IProps {
  children?: ReactElement;
  text: string;
}

const CopyToClipboardPopup = (props: IProps) => {
  const { text, children } = props;
  const [ isCopySuccess, setSuccess ] = useState<boolean>(false);
  const [ open, setOpen ] = useState<boolean>(false);

  let timer: NodeJS.Timeout;

  const handleCopy = () => {
    clearTimeout(timer);
    setOpen(true);
    setSuccess(true);
    timer = setTimeout(() => {
      setSuccess(false);
      setOpen(false);
    }, 2000);
  };

  const handleMouseEnter = debounce(() => {
    setOpen(true);
  }, 300);

  const handleMouseLeave = debounce(() => {
    setOpen(false);
  }, 300);

  const handelUnmount = () => {
    setSuccess(false);
    clearTimeout(timer);
  };

  return (
    <Popup 
      open={open}
      position='top center'
      onUnmount={handelUnmount}
      content={
        isCopySuccess ? (
          <span>
            <Icon customClass={styles['icon-success']} type='success-circle' />
            <FormattedMessage id='common.copy.success.text' />
          </span>
          ) : (
            <span>
              <FormattedMessage id='common.copy.text' />
            </span>
          )
      }
      trigger={
        <span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <CopyToClipboard 
            text={text}
            onCopy={handleCopy}
          >
            { children }
          </CopyToClipboard>
        </span>
      } 
    />
  );
};
  
export default CopyToClipboardPopup;