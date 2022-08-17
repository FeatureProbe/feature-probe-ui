import { useState, useEffect, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import Icon from 'components/Icon';
import StepFirst from '../StepFirst';
import StepSecond from '../StepSecond';
import StepThird from '../StepThird';
import { saveDictionary, getFromDictionary } from 'services/dictionary';
import { getSdkVersion } from 'services/misc';
import { getToggleAccess, getToggleInfo, getTargeting } from 'services/toggle';
import { getProjectInfo } from 'services/project';
import { getEnvironment } from 'services/project';
import { IDictionary, IToggleInfo, IContent, IRule } from 'interfaces/targeting';
import { IProject, IEnvironment, IRouterParams } from 'interfaces/project';
import styles from './index.module.scss';

interface IStepDetail {
  done: boolean;
  projectKey?: string;
  environmentKey?: string;
  toggleKey?: string;
  sdk?: string;
}

interface IStep {
  step1: IStepDetail;
  step2: IStepDetail;
  step3: IStepDetail;
}

interface IAccess {
  isAccess: boolean;
}

const step: IStep = {
  step1: {
    done: true,
  },
  step2: {
    done: false,
  },
  step3: {
    done: false,
  },
};

const PREFIX = 'get_started_';
const JAVA_SDK_VERSION = 'java_sdk_version';
const RUST_SDK_VERSION = 'rust_sdk_version';
const ANDROID_SDK_VERSION = 'android_sdk_version';

const Steps = () => {
  const [ currentStep, saveCurrentStep ] = useState<number>(2);
  const [ currentSDK, saveCurrentSDK ] = useState<string>('');
  const [ serverSdkKey, saveServerSDKKey ] = useState<string>('');
  const [ clientSdkKey, saveClientSdkKey ] = useState<string>('');
  const [ sdkVersion, saveSDKVersion ] = useState<string>('');
  const [ returnType, saveReturnType ] = useState<string>('');
  const [ toggleAccess, saveToggleAccess ] = useState<boolean>(false);
  const [ projectName, saveProjectName ] = useState<string>('');
  const [ environmentName, saveEnvironmentName ] = useState<string>('');
  const [ toggleName, saveToggleName ] = useState<string>('');
  const [ isLoading, saveIsLoading ] = useState<boolean>(false);
  const [ rules, saveRules ] = useState<IRule[]>([]);
  const { projectKey, environmentKey, toggleKey } = useParams<IRouterParams>();

  const init = useCallback(() => {
    const key = PREFIX + projectKey + '_' + environmentKey + '_' + toggleKey;
    getFromDictionary<IDictionary>(key).then(res => {
      const { success, data } = res;
      if (success && data) {
        const savedData = JSON.parse(data.value);
        if (savedData.step2.done) {
          saveCurrentStep(3);
          saveCurrentSDK(savedData.step1.sdk);
          return;
        } 
        if (savedData.step1.done) {
          saveCurrentStep(2);
          saveCurrentSDK(savedData.step1.sdk);
          return;
        }
      } else {
        saveCurrentStep(1);
      }
    });

    getProjectInfo<IProject>(projectKey).then(res => {
      const { data, success } = res;
      if (success && data) {
        saveProjectName(data.name);
      }
    });

    getEnvironment<IEnvironment>(projectKey, environmentKey).then( res=> {
      const { success, data} = res;
      if (success &&  data) {
        saveServerSDKKey(data.serverSdkKey);
        saveClientSdkKey(data.clientSdkKey);
        saveEnvironmentName(data.name);
      }
    });

    getToggleInfo<IToggleInfo>(projectKey, environmentKey, toggleKey).then(res => {
      const { data, success } = res;

      if (success && data) {
        saveReturnType(data.returnType);
        saveToggleName(data.name);
      } 
    });

    getTargeting<IContent>(projectKey, environmentKey, toggleKey).then(res => {
      const { data, success } = res;
      if (success && data) {
        const { content } = data;
        saveRules(content?.rules || []);
      }
    });
  }, [projectKey, environmentKey, toggleKey]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (currentSDK) {
      let key = '';
      if (currentSDK === 'Java') {
        key = JAVA_SDK_VERSION;
      } 
      else if (currentSDK === 'Rust') {
        key = RUST_SDK_VERSION;
      } 
      else if (currentSDK === 'Android') {
        key = ANDROID_SDK_VERSION;
      }

      if (key) {
        getSdkVersion<string>(key).then(res => {
          const { success, data } = res;
          if (success && data) {
            saveSDKVersion(data);
          }
        });
      }
    }
  }, [currentSDK]);

  const checkToggleStatus = useCallback(() => {
    getToggleAccess<IAccess>(projectKey, environmentKey, toggleKey).then(res => {
      const { data } = res;
      if (res.success && data) {
        saveToggleAccess(data.isAccess);
      }
    })
  }, [projectKey, environmentKey, toggleKey]);

  useEffect(() => {
    if (currentStep === 3) {
      checkToggleStatus();
    }
  }, [currentStep, checkToggleStatus]);

  const saveFirstStep = useCallback((sdk: string) => {
    step.step1.done = true;
    step.step1.sdk = sdk;
    saveDictionary(PREFIX + projectKey + '_' + environmentKey + '_' + toggleKey, step).then((res) => {
      if (res.success) {
        saveCurrentStep(currentStep + 1);
      }
    });
  }, [projectKey, environmentKey, toggleKey, currentStep]);

  const saveSecondStep = useCallback(() => {
    step.step2.done = true;
    saveDictionary(PREFIX + projectKey + '_' + environmentKey + '_' + toggleKey, step).then((res) => {
      if (res.success) {
        saveCurrentStep(currentStep + 1);
        saveIsLoading(true);
      }
    });
  }, [projectKey, environmentKey, toggleKey, currentStep]);

  const goBackToStep = useCallback((currentStep: number) => {
    saveCurrentStep(currentStep);
    if (currentStep === 1) {
      step.step2.done = false;
    }
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <div className={styles['intro-header']}>
          <span className={styles['intro-title']}>
            <FormattedMessage id='common.get.started.text' />
          </span>
          <Icon type='info-circle' customClass={styles['intro-icon']} />
          <span className={styles['intro-desc']}>
            <FormattedMessage id='connect.description' />
          </span>
        </div>
        <div className={styles['intro-info']}>
          <div className={styles['card-item']}>
            <div className={styles['card-title']}>
              <FormattedMessage id='common.project.text' /> :
            </div>
            <div className={styles['card-value']}>
              { projectName }
            </div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-title']}>
              <FormattedMessage id='common.environment.text' /> :
            </div>
            <div className={styles['card-value']}>
              { environmentName }
            </div>
          </div>
          <div className={styles['card-item']}>
            <div className={styles['card-title']}>
              <FormattedMessage id='common.toggle.text' /> :
            </div>
            <div className={styles['card-value']}>
              <FormattedMessage id='connect.first.toggle.view.left' />
              <span className={styles['toggle-name']}>{ toggleName }</span>
              <FormattedMessage id='connect.first.toggle.view.right' />
              <span className={styles['toggle-key']}>{ toggleKey }</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.steps}>
        <StepFirst 
          currentStep={currentStep}
          currentSDK={currentSDK}
          saveStep={saveFirstStep}
          saveCurrentSDK={saveCurrentSDK}
          goBackToStep={goBackToStep}
        />
        <StepSecond 
          rules={rules}
          currentStep={currentStep}
          currentSDK={currentSDK}
          returnType={returnType}
          serverSdkKey={serverSdkKey}
          clientSdkKey={clientSdkKey}
          sdkVersion={sdkVersion}
          saveStep={saveSecondStep}
          goBackToStep={goBackToStep}
        />
        <StepThird 
          isLoading={isLoading}
          projectKey={projectKey}
          environmentKey={environmentKey}
          toggleKey={toggleKey}
          currentStep={currentStep}
          toggleAccess={toggleAccess}
          saveIsLoading={saveIsLoading}
          checkToggleStatus={checkToggleStatus}
        />
      </div>
    </div>
  )
}

export default Steps;