import { FormattedMessage } from 'react-intl';
import Button from 'components/Button';
import Icon from 'components/Icon';
import styles from '../Steps/index.module.scss';

interface IProps {
  currentStep: number;
  saveStep(): void;
  goBackToStep(step: number): void;
}

const CURRENT = 3;

const StepThird = (props: IProps) => {
  const { currentStep, saveStep, goBackToStep } = props;
  
  return (
    <div className={styles.step}>
      <div className={styles['step-left']}>
        {
          currentStep === CURRENT && (
            <>
              <div className={styles.circleCurrent}>{ CURRENT }</div>
              <div className={styles.lineSelected}></div>
            </>
          )
        }
        {
          currentStep < CURRENT && (
            <>
              <div className={styles.circle}>3</div>
              <div className={styles.line}></div>
            </>
          )
        }
        {
          currentStep > CURRENT && (
            <>
              <div className={styles.checked}>
                <Icon type='check' />
              </div>
              <div className={styles.lineSelected}></div>
            </>
          )
        }
      </div>
      <div className={styles['step-right']}>
        <div className={styles['step-title']}>
          <FormattedMessage id='connect.third.title' />
        </div>
        <div className={styles['step-detail']}>
          {
            currentStep === CURRENT && (
              <>
                <div>11111</div>
                <div>
                  <Button 
                    primary 
                    type='submit'
                    onClick={() => {
                      saveStep();
                    }}
                  >
                    <FormattedMessage id='connect.continue.button' />
                  </Button>
                </div>
              </>
            )
          }
          {
            currentStep > CURRENT && (
              <div className={styles.card}>
                <FormattedMessage id='connect.third.title' />
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default StepThird;