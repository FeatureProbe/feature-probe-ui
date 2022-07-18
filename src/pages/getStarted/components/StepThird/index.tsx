import { FormattedMessage } from 'react-intl';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Button from 'components/Button';
import Icon from 'components/Icon';
import CopyToClipboardPopup from 'components/CopyToClipboard';
import { getAndroidCode, getGoCode, getJavaCode, getJSCode, getObjCCode, getRustCode, getSwiftCode } from '../constants';
import styles from '../Steps/index.module.scss';
import { useEffect, useState } from 'react';

interface IProps {
  currentStep: number;
  currentSDK: string;
  saveStep(): void;
  goBackToStep(step: number): void;
}

interface ICodeOption {
  title?: string;
  name: string;
  code: string;
}

const CURRENT = 3;

const StepThird = (props: IProps) => {
  const { currentStep, currentSDK, saveStep } = props;
  const [ options, saveOptions ] = useState<ICodeOption[]>([]);

  useEffect(() => {
    if (currentSDK) {
      switch (currentSDK) {
        case 'Java': 
          saveOptions(getJavaCode('1', '33333', '23242342342343'));
          break;
        case 'Rust': 
          saveOptions(getRustCode('1', '33333', '23242342342343'));
          break;
        case 'Go': 
          saveOptions(getGoCode('1', '33333', '23242342342343'));
          break;
        case 'Android': 
          saveOptions(getAndroidCode('1', '33333', '23242342342343'));
          break;
        case 'Swift': 
          saveOptions(getSwiftCode('1', '33333', '23242342342343'));
          break;
        case 'Objective-C': 
          saveOptions(getObjCCode('1', '33333', '23242342342343'));
          break;
        case 'JavaScript': 
          saveOptions(getJSCode('1', '33333', '23242342342343'));
          break;
      }
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
                <div>
                  {
                    options.map((item: ICodeOption) => {
                      return (
                        <div>
                          <div>{item.name}</div>
                          <div className={styles.code}>
                            <span className={styles.copy}>
                              <CopyToClipboardPopup text={item.code}>
                                <span className={styles.copyBtn}>Copy</span>
                              </CopyToClipboardPopup>
                            </span>
                            <SyntaxHighlighter language='java' style={docco}>
                              {item.code}
                            </SyntaxHighlighter>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
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