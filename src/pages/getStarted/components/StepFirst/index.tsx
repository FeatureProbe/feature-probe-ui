import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Form, Dropdown, DropdownProps } from 'semantic-ui-react';
import { useIntl } from 'react-intl';
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

const StepFirst = (props: IProps) => {
  const { projectList } = props;
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
  }, []);

  const handleSelectToggle = useCallback((e: SyntheticEvent, detail: DropdownProps) => {
    // @ts-ignore
    saveToggleKey(detail.value);
  }, []);

  const handleSearchToggle = useCallback((e: SyntheticEvent, detail: DropdownProps) => {
    searchParams.environmentKey = environmentKey;
    searchParams.keyword = detail.searchQuery;
    
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

  }, [searchParams, environmentKey, projectKey]);

  return (
    <div className={styles.step}>
      <div className={styles['step-left']}>
        <div className={styles.circle}>1</div>
        <div className={styles.line}></div>
      </div>
      <div className={styles['step-right']}>
        <div className={styles['step-title']}>Select a project、an environment and a toggle</div>
        <div className={styles['step-detail']}>
          <Form>
            <Form.Field>
              <label>
                <span className={styles['label-required']}>*</span>
                Select your project
              </label>
              <Dropdown
                fluid 
                selection
                floating
                clearable
                selectOnBlur={false}
                className={styles['dropdown']}
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
                Select your environment
              </label>
              <Dropdown
                fluid 
                selection
                floating
                clearable
                disabled={!projectKey}
                selectOnBlur={false}
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
                Select your toggle
              </label>
              <Dropdown
                fluid 
                selection
                floating
                clearable
                search
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
            <Button primary type='submit'>Save and continue</Button>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default StepFirst;