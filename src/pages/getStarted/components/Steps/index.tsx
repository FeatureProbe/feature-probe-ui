
import { useState, useEffect, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import cloneDeep from 'lodash/cloneDeep';
import StepFirst from '../StepFirst';
import StepFourth from '../StepFourth';
import StepSecond from '../StepSecond';
import StepThird from '../StepThird';
import { saveDictionary, getFromDictionary } from 'services/dictionary';
import { getToggleAccess } from 'services/toggle';
import { IDictionary } from 'interfaces/targeting';
import { IRouterParams } from 'interfaces/project';
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
  step4: IStepDetail;
}

interface IAccess {
  isAccess: boolean;
}

const STEP: IStep = {
  step1: {
    done: true,
  },
  step2: {
    done: false,
  },
  step3: {
    done: false,
  },
  step4: {
    done: false,
  }
};

const PREFIX = 'get_started_';

const Steps = () => {
  const [ currentStep, saveCurrentStep ] = useState<number>(2);
  const [ currentSDK, saveCurrentSDK ] = useState<string>('');
  const [ step, saveStep ] = useState<IStep>(cloneDeep(STEP));
  const [ toggleAccess, saveToggleAccess ] = useState<boolean>(false);
  const { projectKey, environmentKey, toggleKey } = useParams<IRouterParams>();

  const init = useCallback(() => {
    const key = PREFIX + projectKey + '_' + environmentKey + '_' + toggleKey;
    getFromDictionary<IDictionary>(key).then(res => {
      const { success, data } = res;
      if (success && data) {
        const savedData = JSON.parse(data.value);
        if (savedData.step3.done) {
          saveCurrentStep(4);
          saveCurrentSDK(savedData.step2.sdk);
          return;
        } 
        if (savedData.step2.done) {
          saveCurrentStep(3);
          saveCurrentSDK(savedData.step2.sdk);
          return;
        }
        if (savedData.step1.done) {
          saveCurrentStep(2);
          return;
        }
      }
    })
  }, [projectKey, environmentKey, toggleKey]);

  useEffect(() => {
    init();
  }, [init]);

  const checkToggleStatus = useCallback(() => {
    getToggleAccess<IAccess>(projectKey, environmentKey, toggleKey).then(res => {
      const { data } = res;
      if (res.success && data) {
        saveToggleAccess(data.isAccess);
      }
    })
  }, [projectKey, environmentKey, toggleKey]);

  useEffect(() => {
    if (currentStep === 4) {
      checkToggleStatus();
    }
  }, [currentStep, checkToggleStatus]);

  const saveSecondStep = useCallback((sdk: string) => {
    step.step2.done = true;
    step.step2.sdk = sdk;
    saveDictionary(PREFIX + projectKey + '_' + environmentKey + '_' + toggleKey, step).then((res) => {
      if (res.success) {
        saveCurrentStep(currentStep + 1);
      }
    });
  }, [projectKey, environmentKey, toggleKey, step, currentStep]);

  const saveThirdStep = useCallback(() => {
    step.step3.done = true;
    saveDictionary(PREFIX + projectKey + '_' + environmentKey + '_' + toggleKey, step).then((res) => {
      if (res.success) {
        saveCurrentStep(currentStep + 1);
      }
    });
  }, [projectKey, environmentKey, toggleKey, step, currentStep]);

  const goBackToStep = useCallback((currentStep: number) => {
    saveCurrentStep(currentStep);
    if (currentStep === 1) {
      step.step2.done = false;
      delete step.step2.sdk;
    } else if (currentStep >= 2) {
      step.step3.done = false;
    }
  }, [step]);

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <div className={styles['intro-title']}>
          <FormattedMessage id='common.get.started.text' />
        </div>
        <div className={styles['intro-desc']}>
          <FormattedMessage id='connect.description' />
        </div>
      </div>
      <div className={styles.steps}>
        <StepFirst 
          currentStep={currentStep}
        />
        <StepSecond 
          currentStep={currentStep}
          currentSDK={currentSDK}
          saveStep={saveSecondStep}
          goBackToStep={goBackToStep}
        />
        <StepThird 
          currentStep={currentStep}
          saveStep={saveThirdStep}
          goBackToStep={goBackToStep}
        />
        <StepFourth 
          projectKey={projectKey}
          environmentKey={environmentKey}
          toggleKey={toggleKey}
          currentStep={currentStep}
          toggleAccess={toggleAccess}
          checkToggleStatus={checkToggleStatus}
        />
      </div>
    </div>
  )
}

export default Steps;