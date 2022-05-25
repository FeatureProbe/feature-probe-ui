import { ReactElement, useCallback, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Breadcrumb } from  'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import SideBar from './sidebar';
import ProjectSiderbar from './projectSiderbar';
import message from 'components/MessageBox';
import Icon from 'components/Icon';
import { getProjectInfo } from 'services/project';
import { IProject, IRouterParams } from 'interfaces/project';
import { EnvironmentColors } from 'constants/colors';

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
  const history = useHistory();

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
    })
  }, [projectKey]);

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
            !!toggleKey ? (
              <Breadcrumb.Section link onClick={gotoToggle}>{ projectInfo?.name }</Breadcrumb.Section>
            ) : (
              <Breadcrumb.Section active>{ projectInfo?.name }</Breadcrumb.Section>
            )
          }
          {
            toggleKey && (
              <>
                <Breadcrumb.Divider icon={<Icon customClass={styles['breadcrumb-icon']} type='angle-right' />} />
                <Breadcrumb.Section active>
                  {toggleKey}
                </Breadcrumb.Section>
              </>
            )
          }
        </Breadcrumb>
        <div style={{background: EnvironmentColors[envIndex]}} className={styles['environment-line']}></div>
        { props.children }
      </div>
    </div>
	)
}

export default ProjectLayout;