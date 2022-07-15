import { useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { IRouterParams } from 'interfaces/project';

import styles from '../Steps/index.module.scss';

interface IProps {
  currentStep: number;
}

const CURRENT = 1;

const StepFirst = (props: IProps) => {
  const { currentStep } = props;
  const { projectKey, environmentKey, toggleKey } = useParams<IRouterParams>();

  return (
    <div className={styles.step}>
      <div className={styles['step-left']}>
        {
          currentStep === CURRENT ? (
            <div className={styles.circleCurrent}>
              { CURRENT }
            </div>
          ) : (
            <div className={styles.checked}>
              <Icon type='check' />
            </div>
          )
        }
        <div className={styles.lineSelected}></div>
      </div>
      <div className={styles['step-right']}>
        <div className={styles['step-title']}>
          <FormattedMessage id='connect.first.title' />
        </div>
        <div className={styles['step-detail']}>
          <div className={styles.card}>
            <div className={styles['card-left']}>
              <div className={styles['card-item']}>
                <div className={styles['card-title']}>
                  <FormattedMessage id='common.project.text' /> :
                </div>
                <div className={styles['card-value']}>
                  { projectKey }
                </div>
              </div>
              <div className={styles['card-item']}>
                <div className={styles['card-title']}>
                  <FormattedMessage id='common.environment.text' /> :
                </div>
                <div className={styles['card-value']}>
                  { environmentKey }
                </div>
              </div>
              <div className={styles['card-item']}>
                <div className={styles['card-title']}>
                  <FormattedMessage id='common.toggle.text' /> :
                </div>
                <div className={styles['card-value']}>
                  { toggleKey }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StepFirst;