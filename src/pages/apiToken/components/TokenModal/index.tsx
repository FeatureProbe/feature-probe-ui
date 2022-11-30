import Icon from 'components/Icon';
import Modal from 'components/Modal';
import { FormattedMessage } from 'react-intl';
import { Form } from 'semantic-ui-react';
import styles from './index.module.scss';

interface IProps {
  open: boolean;
  handleCancel?: () => void;
}

const TokenModal: React.FC<IProps> = (props) => {
  const { open, handleCancel } = props;

  return (
    <Modal handleCancel={handleCancel} open={open}>
      <div>
        <div className={styles['modal-header']}>
          <span className={styles['modal-header-text']}>
            <FormattedMessage id="token.create.text" />
          </span>
          <Icon customclass={styles['modal-close-icon']} type="close" onClick={handleCancel} />
        </div>
        <div className={styles['header-tips-container']}>
          <div className={styles['header-tips']}></div>
        </div>
        <Form>
          
        </Form>
      </div>
    </Modal>
  );
};

export default TokenModal;
