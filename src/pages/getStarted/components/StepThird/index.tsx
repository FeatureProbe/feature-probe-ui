import { FormattedMessage } from "react-intl";
import styles from '../Steps/index.module.scss';

const StepThird = () => {
  return (
    <div className={styles.step}>
      <div className={styles['step-left']}>
        <div className={styles.circle}>3</div>
        <div className={styles.line}></div>
      </div>
      <div className={styles['step-right']}>
        <div className={styles['step-title']}>
          <FormattedMessage id='connect.third.title' />
        </div>
        <div className={styles['step-detail']}>
          333
        </div>
      </div>
    </div>
  )
}

export default StepThird;