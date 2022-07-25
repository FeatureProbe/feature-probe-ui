import { useEffect, useState } from 'react';
import { Form, Dropdown } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import Button from 'components/Button';
import Icon from 'components/Icon';
import java from 'images/java.svg';
import rust from 'images/rust.svg';
import go from 'images/go.svg';
import python from 'images/python.svg';
import javascript from 'images/javascript.svg';
import android from 'images/android.svg';
import swift from 'images/swift.svg';
import apple from 'images/apple.svg';
import styles from '../Steps/index.module.scss';

const SDK_LOGOS = {
  'Java': java,
  'Rust': rust,
  'Go': go,
  'Python': python,
  'JavaScript': javascript,
  'Android': android,
  'Swift': swift,
  'Objective-C': ''
};

const SERVER_SIDE_SDKS = [
  {
    name: 'Java',
    logo: java,
  },
  {
    name: 'Go',
    logo: go,
  },
  // {
  //   name: 'Python',
  //   logo: python,
  // }
  {
    name: 'Rust',
    logo: rust,
  },
];

const CLIENT_SIDE_SDKS = [
  {
    name: 'JavaScript',
    logo: javascript,
  },
  {
    name: 'Android',
    logo: android,
  },
  {
    name: 'Swift',
    logo: swift,
  },
  {
    name: 'Objective-C',
    logo: apple,
  }
];

interface IOption {
  name: string;
  logo: string
}

interface IProps {
  currentStep: number;
  currentSDK: string;
  saveStep(sdk: string): void;
  goBackToStep(step: number): void;
  saveCurrentSDK(sdk: string): void;
}

const CURRENT = 1;

const StepFirst = (props: IProps) => {
  const { currentStep, currentSDK, saveStep, goBackToStep, saveCurrentSDK } = props;
  const [ selectedSDKLogo, saveSelectedSDKLogo ] = useState<string>('');


  useEffect(() => {
    if (currentSDK) {
      // @ts-ignore
      saveSelectedSDKLogo(SDK_LOGOS[currentSDK]);
    }
  }, [currentSDK]);

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
              <div className={styles.circle}>{ CURRENT }</div>
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
          <FormattedMessage id='connect.second.title' />
        </div>
        <div className={styles['step-detail']}>
          {
            currentStep === CURRENT && (
              <Form className={styles.form}>
                <Form.Field>
                  <label>
                    <span className={styles['label-required']}>*</span>
                    <FormattedMessage id='connect.second.sdk' />
                  </label>
                  <Dropdown
                    fluid 
                    selection
                    floating
                    className={styles['dropdown']}
                    icon={<Icon customClass={styles['angle-down']} type='angle-down' />}
                    trigger={
                      <div className={styles.dropdown}>
                        {
                          currentSDK ? (
                            <>
                              { selectedSDKLogo && <img className={styles['dropdown-logo']} src={selectedSDKLogo} alt='logo' /> }
                              <span className={styles['dropdown-text']}>
                                { currentSDK }
                              </span>
                            </>
                          ) : (
                            <FormattedMessage id='common.dropdown.placeholder' />
                          )
                        }
                      </div>
                    }
                  >
                    <Dropdown.Menu>
                      <Dropdown.Header content='Server-side SDKs' />
                      <Dropdown.Divider />
                      {
                        SERVER_SIDE_SDKS.map((sdk: IOption) => {
                          return (
                            <Dropdown.Item 
                              onClick={() => {
                                saveCurrentSDK(sdk.name);
                              }}
                            >
                              <div className={styles['sdk-item']}>
                                <img className={styles['sdk-logo']} src={sdk.logo} alt='logo' />
                                { sdk.name }
                              </div>
                            </Dropdown.Item>
                          )
                        })
                      }
                      <Dropdown.Header content='Client-side SDKs' />
                      <Dropdown.Divider />
                      {
                        CLIENT_SIDE_SDKS.map((sdk: IOption) => {
                          return (
                            <Dropdown.Item onClick={() => {
                              saveCurrentSDK(sdk.name);
                            }}>
                              <div className={styles['sdk-item']}>
                                { sdk.logo && <img className={styles['sdk-logo']} src={sdk.logo} alt='logo' /> }
                                { sdk.name }
                              </div>
                            </Dropdown.Item>
                          )
                        })
                      }
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Field>
                <Button 
                  primary 
                  type='submit'
                  disabled={!currentSDK}
                  onClick={() => {
                    saveStep(currentSDK);
                  }}
                >
                  <FormattedMessage id='connect.save.continue.button' />
                </Button>
              </Form>
            )
          }
          {
            currentStep > CURRENT && (
              <div className={styles.card}>
                <div className={styles['card-left']}>
                  {
                    selectedSDKLogo && <img className={styles['dropdown-logo']} src={selectedSDKLogo} alt='logo' />
                  }
                  <div className={styles['dropdown-text']}>
                    { currentSDK }
                  </div>
                </div>
                <div className={styles['card-right']}>
                  <Icon type='edit' onClick={() => {
                    goBackToStep(CURRENT);
                  }} />
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default StepFirst;