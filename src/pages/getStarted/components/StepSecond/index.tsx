import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useParams } from 'react-router-dom';
import Button from 'components/Button';
import Icon from 'components/Icon';
import CopyToClipboardPopup from 'components/CopyToClipboard';
import { IRouterParams } from 'interfaces/project';
import { getAndroidCode, getGoCode, getJavaCode, getJSCode, getObjCCode, getRustCode, getSwiftCode } from '../constants';
import styles from '../Steps/index.module.scss';

interface IProps {
  currentStep: number;
  currentSDK: string;
  serverSdkKey: string;
  clientSdkKey: string;
  saveStep(): void;
  goBackToStep(step: number): void;
}

interface ICodeOption {
  title?: string;
  name: string;
  code: string;
}

const CURRENT = 2;

const StepSecond = (props: IProps) => {
  const { currentStep, currentSDK, serverSdkKey, clientSdkKey, saveStep } = props;
  const [ options, saveOptions ] = useState<ICodeOption[]>([]);
  const { toggleKey } = useParams<IRouterParams>();

  useEffect(() => {
    if (currentSDK) {
      switch (currentSDK) {
        case 'Java': 
          saveOptions(getJavaCode('1', serverSdkKey, toggleKey));
          break;
        case 'Rust': 
          saveOptions(getRustCode('1', serverSdkKey, toggleKey));
          break;
        case 'Go': 
          saveOptions(getGoCode(serverSdkKey, toggleKey));
          break;
        case 'Android': 
          saveOptions(getAndroidCode('1', clientSdkKey, toggleKey));
          break;
        case 'Swift': 
          saveOptions(getSwiftCode('1', clientSdkKey, toggleKey));
          break;
        case 'Objective-C': 
          saveOptions(getObjCCode('1', clientSdkKey, toggleKey));
          break;
        case 'JavaScript': 
          saveOptions(getJSCode('1', clientSdkKey, toggleKey));
          break;
      }
    }
  }, [currentSDK, clientSdkKey, serverSdkKey, toggleKey]);

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

export default StepSecond;