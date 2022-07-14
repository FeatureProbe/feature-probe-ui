import { FormattedMessage } from "react-intl";
import Button from 'components/Button';
import Icon from "components/Icon";
import styles from '../Steps/index.module.scss';

const StepFourth = () => {
  return (
    <div className={styles.step}>
      <div className={styles['step-left']}>
        <div className={styles.circle}>4</div>
      </div>
      <div className={styles['step-right']}>
        <div className={styles['step-title']}>
          <FormattedMessage id='connect.fourth.title' />
        </div>
        <div className={styles['step-detail']}>
          <div className={styles['connect-success']}>
            <Icon type='success-circle' customClass={styles['success-circle']} />
            <FormattedMessage id='connect.fourth.success' />
          </div>
          <div className={styles['connect-failed']}>
            <div>
              <Icon type='error-circle' customClass={styles['error-circle']} />
              <FormattedMessage id='connect.fourth.failed' />
            </div>
            <div className={styles['retry-connection']}>
              <Button primary className={styles['retry-connection-btn']}>
                <FormattedMessage id='connect.fourth.failed.button' />
              </Button>
            </div>
          </div>
          <div className={styles['connect-retrying']}>
            <FormattedMessage id='connect.fourth.running' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StepFourth;