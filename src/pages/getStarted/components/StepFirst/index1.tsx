import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Form, Dropdown, DropdownProps, Popup } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from 'components/Button';
import findIndex from 'lodash/findIndex';
import Icon from 'components/Icon';
import { IEnvironment, IProject } from 'interfaces/project';
import { IOption } from 'interfaces/targeting';
import { IToggle, IToggleList,  } from 'interfaces/toggle';
import { getToggleList } from 'services/toggle';

import styles from '../Steps/index.module.scss';

interface IProps {
  projectList: IProject[];
  currentStep: number;
  saveStep(projectKey: string, environmentKey: string, toggleKey: string): void;
  goBackToStep(step: number): void;
}

interface ISearchParams {
  pageIndex: number;
  pageSize: number;
  sortBy?: string;
  environmentKey: string;
  isVisited?: boolean;
  disabled?: number;
  tags?: string[];
  keyword?: string;
}

const CURRENT = 1;

const StepFirst = (props: IProps) => {
  const { projectList, currentStep, saveStep, goBackToStep } = props;
  const [ projectsOptions, saveProjectOptions ] = useState<IOption[]>([]);
  const [ envOptions, saveEnvOptions ] = useState<IOption[]>([]);
  const [ toggleOptions, saveToggleOptions ] = useState<IOption[]>([]);
  const [ projectKey, saveProjectKey ] = useState<string>('');
  const [ environmentKey, saveEnvironmentKey ] = useState<string>('');
  const [ toggleKey, saveToggleKey ] = useState<string>('');
  const [ searchParams, setSearchParams ] = useState<ISearchParams>({
    pageIndex: 0,
    pageSize: 10,
    environmentKey,
  });
  const intl = useIntl();

  useEffect(() => {
    const result = projectList.map((project: IProject) => {
      return {
        key: project.key,
        value: project.key,
        text: project.name
      }
    });
    saveProjectOptions(result);
  }, [projectList]);

  const getToggles = useCallback((searchParams: ISearchParams) => {
    getToggleList<IToggleList>(projectKey, searchParams)
    .then(async (res) => {
      const { success, data } = res;
      if (success && data) {
        const { content } = data;
        const result = content.map((toggle: IToggle) => {
          return {
            key: toggle.key,
            value: toggle.key,
            text: toggle.name
          }
        });
        saveToggleOptions(result);
      }
    });
  }, [projectKey])

  const handleSelectProject = useCallback((e: SyntheticEvent, detail: DropdownProps) => {
    // @ts-ignore
    saveProjectKey(detail.value);

    const index = findIndex(projectList, (project: IProject) => {
      return project.key === detail.value;
    });

    const result = projectList[index]?.environments.map((env: IEnvironment) => {
      return {
        key: env.key,
        value: env.key,
        text: env.name
      };
    });

    if (result) {
      saveEnvOptions(result);
    } else {
      saveEnvOptions([]);
    }
    saveToggleOptions([]);
  }, [projectList]);

  const handleSelectEnv = useCallback((e: SyntheticEvent, detail: DropdownProps) => {
    // @ts-ignore
    saveEnvironmentKey(detail.value);
    saveToggleOptions([]);
    searchParams.keyword = '';
    // @ts-ignore
    searchParams.environmentKey = detail.value;
    getToggles(searchParams);
  }, [searchParams, getToggles]);

  const handleSelectToggle = useCallback((e: SyntheticEvent, detail: DropdownProps) => {
    // @ts-ignore
    saveToggleKey(detail.value);
  }, []);

  // const saveFirstStep = useCallback((projectKey: string, environmentKey: string, toggleKey: string) => {
  //   step.step1.done = true;
  //   step.step1.projectKey = projectKey;
  //   step.step1.environmentKey = environmentKey;
  //   step.step1.toggleKey = toggleKey;
  //   saveProjectKey(projectKey);
  //   saveEnvironmentKey(environmentKey);
  //   saveToggleKey(toggleKey);
  //   saveDictionary(PREFIX + projectKey + '_' + environmentKey + '_' + toggleKey, step).then((res) => {
  //     if (res.success) {
  //       saveCurrentStep(currentStep + 1);
  //     }
  //   });
  // }, [currentStep, step]);

  const handleSearchToggle = useCallback((e: SyntheticEvent, detail: DropdownProps) => {
    searchParams.environmentKey = environmentKey;
    searchParams.keyword = detail.searchQuery;
    getToggles(searchParams);
  }, [searchParams, environmentKey, getToggles]);

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
          {
            currentStep === CURRENT ? (
              <Form>
                <Form.Field>
                  <label>
                    <span className={styles['label-required']}>*</span>
                    <FormattedMessage id='connect.first.project' />
                  </label>
                  <Dropdown
                    fluid 
                    selection
                    floating
                    clearable
                    selectOnBlur={false}
                    className={styles['dropdown']}
                    value={projectKey}
                    placeholder={intl.formatMessage({id: 'common.dropdown.placeholder'})} 
                    options={projectsOptions} 
                    icon={
                      projectKey
                        ? <Icon customClass={styles['angle-down']} type='remove-circle' />
                        : <Icon customClass={styles['angle-down']} type='angle-down' />
                    }
                    onChange={handleSelectProject}
                  />
                </Form.Field>
                <Form.Field>
                  <label>
                    <span className={styles['label-required']}>*</span>
                    <FormattedMessage id='connect.first.environment' />
                    <Popup
                      inverted
                      trigger={
                        <Icon customClass={styles['icon-question']} type='question' />
                      }
                      content={intl.formatMessage({id: 'connect.first.environment.tip'})}
                      position='top center'
                      className={styles.popup}
                    />
                  </label>
                  <Dropdown
                    fluid 
                    selection
                    floating
                    clearable
                    disabled={!projectKey}
                    selectOnBlur={false}
                    value={environmentKey}
                    className={styles['dropdown']}
                    placeholder={intl.formatMessage({id: 'common.dropdown.placeholder'})} 
                    options={envOptions} 
                    icon={
                      environmentKey
                        ? <Icon customClass={styles['angle-down']} type='remove-circle' />
                        : <Icon customClass={styles['angle-down']} type='angle-down' />
                    }
                    onChange={handleSelectEnv}
                  />
                </Form.Field>
                <Form.Field>
                  <label>
                    <span className={styles['label-required']}>*</span>
                    <FormattedMessage id='connect.first.toggle' />
                    <Popup
                      inverted
                      trigger={
                        <Icon customClass={styles['icon-question']} type='question' />
                      }
                      content={intl.formatMessage({id: 'connect.first.toggle.tip'})}
                      position='top center'
                      className={styles.popup}
                    />
                  </label>
                  <Dropdown
                    fluid 
                    selection
                    floating
                    clearable
                    search
                    value={toggleKey}
                    disabled={!projectKey || !environmentKey}
                    selectOnBlur={false}
                    className={styles['dropdown']}
                    placeholder={intl.formatMessage({id: 'common.dropdown.placeholder'})} 
                    options={toggleOptions} 
                    icon={<Icon customClass={styles['angle-down']} type='angle-down' />}
                    onSearchChange={handleSearchToggle}
                    onChange={handleSelectToggle}
                  />
                </Form.Field>
                <Button 
                  primary 
                  type='submit' 
                  disabled={!toggleKey || !projectKey || !environmentKey} 
                  onClick={() => {
                    saveStep(projectKey, environmentKey, toggleKey);
                  }}
                >
                  <FormattedMessage id='connect.save.continue.button' />
                </Button>
              </Form>
            ) : (
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
                <div className={styles['card-right']}>
                  <Icon type='edit' onClick={() => {
                    goBackToStep(CURRENT);
                  }}/>
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