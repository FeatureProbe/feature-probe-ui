import { useEffect, useState } from 'react';
import { Loader } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { IRouterParams } from 'interfaces/project';
import styles from '../Steps/index.module.scss';

interface IProps {
  isLoading: boolean;
  currentStep: number;
  toggleAccess: boolean;
  projectKey: string;
  environmentKey: string;
  toggleKey: string;
  checkToggleStatus(): void;
  saveIsLoading(loading: boolean): void;
}

const CURRENT = 3;
const INTERVAL = 30;

const StepThird = (props: IProps) => {
  const { currentStep, toggleAccess, isLoading, checkToggleStatus, saveIsLoading } = props;
  const { toggleKey, environmentKey } = useParams<IRouterParams>();
  const [ count, saveCount ] = useState<number>(1);
  const intl = useIntl();
  const stepTitleCls = classNames(
    styles['step-title'],
    {
      [styles['step-title-selected']]: currentStep === CURRENT
    }
  );

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
  }, [count, isLoading, checkToggleStatus, saveIsLoading]);

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
        <div className={stepTitleCls}>
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