import { Loader } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from 'components/Button';
import Icon from 'components/Icon';
import styles from '../Steps/index.module.scss';
import { useEffect, useState } from 'react';

interface IProps {
  currentStep: number;
  toggleAccess: boolean;
  projectKey: string;
  environmentKey: string;
  toggleKey: string;
  checkToggleStatus(): void;
}

const CURRENT = 3;
const INTERVAL = 30;

const StepThird = (props: IProps) => {
  const { currentStep, toggleAccess, environmentKey, toggleKey, checkToggleStatus } = props;
  const [ isLoading, saveIsLoading ] = useState<boolean>(false);
  const [ count, saveCount ] = useState<number>(1);
  const intl = useIntl();

  useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        saveCount(count + 1);
        checkToggleStatus();
      }, 1000);

      if (count >= INTERVAL) {
        clearInterval(timer);
        saveIsLoading(false);
        saveCount(1);
      }
  
      return (() => {
        clearInterval(timer);
      })
    }
  }, [count, isLoading, checkToggleStatus]);

  return (
    <div className={styles.step}>
      <div className={styles['step-left']}>
        {
          currentStep === CURRENT ? (
            <div className={styles.circleCurrent}>
              { CURRENT }
            </div>
          ) : (
            <div className={styles.circle}>
              { CURRENT }
            </div>
          )
        }
      </div>
      <div className={styles['step-right']}>
        <div className={styles['step-title']}>
          <FormattedMessage id='connect.fourth.title' />
        </div>
        <div className={styles['step-detail']}>
          {
            currentStep === CURRENT && (
              <>
                {
                  toggleAccess ? (
                    <div className={styles['connect-success']}>
                      <Icon type='success-circle' customClass={styles['success-circle']} />
                      <FormattedMessage id='connect.fourth.success' />
                    </div>
                  ) : (
                    isLoading ? (
                      <div className={styles['connect-retrying']}>
                        <Loader  size='small' active inline='centered' />
                        <div className={styles['connect-retrying-text']}>
                          {
                            intl.formatMessage({
                              id: 'connect.fourth.running'
                            }, {
                              environment: environmentKey,
                              toggle: toggleKey,
                            })
                          }
                        </div>
                      </div>
                    ) : (
                      <div className={styles['connect-failed']}>
                        <div>
                          <Icon type='error-circle' customClass={styles['error-circle']} />
                          <FormattedMessage id='connect.fourth.failed' />
                        </div>
                        <div className={styles['retry-connection']}>
                          <Button primary className={styles['retry-connection-btn']} onClick={() => {
                            saveIsLoading(true);
                          }}>
                            <FormattedMessage id='connect.fourth.failed.button' />
                          </Button>
                        </div>
                      </div>
                    )
                  )
                }
              </>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default StepThird;