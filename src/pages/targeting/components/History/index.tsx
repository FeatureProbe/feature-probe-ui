
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import styles from './index.module.scss';

const History = () => {
  return (
    <div className={styles.history}>
      <div className={styles['history-title']}>
        <span>
          <FormattedMessage id='common.history.text' />
        </span>
        <Icon customClass={styles['history-title-icon']} type='close' onClick={() => {}} />
      </div>
    </div>
  )
};

export default History;