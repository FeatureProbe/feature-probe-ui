import { ReactElement, useCallback, useEffect, useState } from 'react';
import { useParams, useHistory, useRouteMatch } from 'react-router-dom';
import { Breadcrumb } from  'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import SideBar from './sidebar';
import ProjectSiderbar from './projectSiderbar';
import message from 'components/MessageBox';
import Icon from 'components/Icon';
import { getProjectInfo } from 'services/project';
import { getToggleInfo } from 'services/toggle';
import { IProject, IRouterParams } from 'interfaces/project';
import { IToggleInfo } from 'interfaces/targeting';

import { EnvironmentColors } from 'constants/colors';
import { 
  TOGGLE_PATH, 
  TARGETING_PATH, 
  SEGMENT_PATH, 
  SEGMENT_ADD_PATH, 
  GET_STARTED_PATH,
  SEGMENT_EDIT_PATH,
} from 'router/routes';

import styles from './layout.module.scss';

interface IProps {
  children: ReactElement
}

const ProjectLayout = (props: IProps) => {
  const { projectKey, environmentKey, toggleKey } = useParams<IRouterParams>();
  const [ projectInfo, setProjectInfo ] = useState<IProject>({
    name: '',
    key: '',
    description: '',
    environments: [{
      name: '',
      key: '',
      clientSdkKey: '',
      serverSdkKey: ''
    }]
  });
  const [ envIndex, setEnvIndex ] = useState<number>(0);
  const [ toggleName, saveToggleName ] = useState<string>('');
  const history = useHistory();
  const match = useRouteMatch();

  useEffect(() => {
    getProjectInfo<IProject>(projectKey).then(res => {
      if (res.success) {
        const { data } = res;
        if (data) {
          setProjectInfo(data);
        }
      } else {
        message.error(res.message || 'Get project information error!');
      }
    });
  }, [projectKey]);

  useEffect(() => {
    if (!toggleKey) return;
    getToggleInfo<IToggleInfo>(projectKey, environmentKey, toggleKey).then(res => {
      const { data, success } = res;

      if (success && data) {
        saveToggleName(data.name);
      } 
    });
  }, [projectKey, environmentKey, toggleKey]);

  useEffect(() => {
    const index = projectInfo.environments.findIndex(env => {
      return env.key === environmentKey;
    });
    setEnvIndex(index === -1 ? 0 : index);
  }, [environmentKey, projectInfo.environments])
  
  const gotoProjects = useCallback(() => {
    history.push('/projects');
  }, [history]);

  const gotoToggle = useCallback(() => {
    if (!toggleKey) {
      return;
    };
    history.push(`/${projectKey}/${environmentKey}/toggles`);
  }, [history, projectKey, environmentKey, toggleKey]);

  const gotoTargeting = useCallback(() => {
    history.push(`/${projectKey}/${environmentKey}/${toggleKey}/targeting`);
  }, [history, projectKey, environmentKey, toggleKey]);

  const gotoSegments = useCallback(() => {
    history.push(`/${projectKey}/${environmentKey}/segments`);
  }, [history, projectKey, environmentKey]);

  return (
    <div className={styles.main}>
      <SideBar>
        <ProjectSiderbar 
          projectInfo={projectInfo}
          backgroundColor={EnvironmentColors[envIndex]}
        />
      </SideBar>
      <div className={styles.content}>
        <Breadcrumb className={styles.breadcrumb}>
          <Breadcrumb.Section link onClick={gotoProjects}>
            <FormattedMessage id='common.projects.text' />
          </Breadcrumb.Section>
          <Breadcrumb.Divider icon={<Icon customClass={styles['breadcrumb-icon']} type='angle-right' />} />
          {
            match.path === TARGETING_PATH && (
              <>
                <Breadcrumb.Section link onClick={gotoToggle}>{ projectInfo?.name }</Breadcrumb.Section>
                <Breadcrumb.Divider icon={<Icon customClass={styles['breadcrumb-icon']} type='angle-right' />} />
                <Breadcrumb.Section active>
                  { toggleName }
                </Breadcrumb.Section>
              </>
            )
          }
          {
            match.path === GET_STARTED_PATH && (
              <>
                <Breadcrumb.Section link onClick={gotoToggle}>{ projectInfo?.name }</Breadcrumb.Section>
                <Breadcrumb.Divider icon={<Icon customClass={styles['breadcrumb-icon']} type='angle-right' />} />
                <Breadcrumb.Section link onClick={gotoTargeting}>{ toggleName }</Breadcrumb.Section>
                <Breadcrumb.Divider icon={<Icon customClass={styles['breadcrumb-icon']} type='angle-right' />} />
                <Breadcrumb.Section active>
                  <FormattedMessage id='common.get.started.text' />
                </Breadcrumb.Section>
              </>
            )
          }
          {
            match.path === GET_STARTED_PATH && (
              <>
                <Breadcrumb.Section link onClick={gotoToggle}>{ projectInfo?.name }</Breadcrumb.Section>
                <Breadcrumb.Divider icon={<Icon customClass={styles['breadcrumb-icon']} type='angle-right' />} />
                <Breadcrumb.Section active>
                  <FormattedMessage id='common.get.started.text' />
                </Breadcrumb.Section>
              </>
            )
          }
          {
            match.path === TOGGLE_PATH && (
              <Breadcrumb.Section active>{ projectInfo?.name }</Breadcrumb.Section>
            )
          }
          {
            match.path === SEGMENT_PATH && (
              <Breadcrumb.Section active><FormattedMessage id='common.segments.text' /></Breadcrumb.Section>
            )
          }
          {
            match.path === SEGMENT_ADD_PATH && (
              <>
                <Breadcrumb.Section link onClick={gotoSegments}>
                  <FormattedMessage id='common.segments.text' />
                </Breadcrumb.Section>
                <Breadcrumb.Divider icon={<Icon customClass={styles['breadcrumb-icon']} type='angle-right' />} />
                <Breadcrumb.Section active>
                  <FormattedMessage id='common.new.lowercase.text' />
                </Breadcrumb.Section>
              </>
            )
          }
          {
            match.path === SEGMENT_EDIT_PATH && (
              <>
                <Breadcrumb.Section link onClick={gotoSegments}>
                  <FormattedMessage id='common.segments.text' />
                </Breadcrumb.Section>
                <Breadcrumb.Divider icon={<Icon customClass={styles['breadcrumb-icon']} type='angle-right' />} />
                <Breadcrumb.Section active>
                  <FormattedMessage id='common.edit.lowercase.text' />
                </Breadcrumb.Section>
              </>
            )
          }
        </Breadcrumb>
        {
          (
            match.path === SEGMENT_PATH || 
            match.path === SEGMENT_ADD_PATH ||
            match.path === SEGMENT_EDIT_PATH
          ) 
            ? null 
            : <div style={{background: EnvironmentColors[envIndex]}} className={styles['environment-line']}></div>
        }
        { props.children }
      </div>
    </div>
	)
}

export default ProjectLayout;