import { ReactElement, useCallback, useEffect, useState } from 'react';
import { useParams, useHistory, useRouteMatch } from 'react-router-dom';
import { Breadcrumb } from  'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import SideBar from './sidebar';
import ProjectSiderbar from './projectSiderbar';
import message from 'components/MessageBox';
import Icon from 'components/Icon';
import { getProjectInfo } from 'services/project';
import { getToggleInfo } from 'services/toggle';
import { saveDictionary, getFromDictionary } from 'services/dictionary';
import { IDictionary } from 'interfaces/targeting';
import { IProject, IRouterParams } from 'interfaces/project';
import { IToggleInfo } from 'interfaces/targeting';
import { EnvironmentColors } from 'constants/colors';
import { commonConfig, floaterStyle, tourStyle } from 'constants/tourConfig';

import { 
  TOGGLE_PATH, 
  TARGETING_PATH, 
  SEGMENT_PATH, 
  SEGMENT_ADD_PATH, 
  GET_STARTED_PATH,
  SEGMENT_EDIT_PATH,
  SETTING_PATH,
} from 'router/routes';

import styles from './layout.module.scss';

const DEMO_TIP_SHOW = 'is_demo_tips_show';

interface IProps {
  children: ReactElement
}

const STEPS: Step[] = [
  {
    content: (
      <div className={styles['joyride-content']}>
        <div className={styles['joyride-title']}>服务</div>
        <ul className={styles['joyride-item']} >
          <li>管理应用「服务」及服务的「环境」信息</li>
          <li>快速拷贝「环境密钥」，与代码环境变量建立关联</li>
          <li>点击卡片进入不同服务及环境的「开关列表」</li>
        </ul>
        <div className={styles['joyride-pagination']}>1/2</div>
      </div>
    ),
    placement: 'bottom',
    target: '.joyride-project',
    spotlightPadding: 0,
    ...commonConfig
  },
  {
    content: (
      <div className={styles['joyride-content']}>
        <div className={styles['joyride-title']}>项目-环境-开关列表</div>
        <ul className={styles['joyride-item']} >
          <li>点击可切换环境</li>
        </ul>
        <div className={styles['joyride-pagination']}>2/2</div>
      </div>
    ),
    placement: 'right',
    spotlightPadding: 4,
    target: '.joyride-environment',
    ...commonConfig
  },
];

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
  const [ tipVisible, saveTipVisible ] = useState<boolean>(false);
  const [ isLoading, saveIsLoading ] = useState<boolean>(false);
  const [ run, saveRun ] = useState<boolean>(false);
  const history = useHistory();
  const match = useRouteMatch();

  useEffect(() => {
    getProjectInfo<IProject>(projectKey).then(res => {
      saveIsLoading(false);
      if (res.success) {
        const { data } = res;
        if (data) {
          setProjectInfo(data);
        }
      } else {
        message.error(res.message || 'Get project information error!');
      }
    });
    saveRun(true);
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
  }, [environmentKey, projectInfo.environments]);

  useEffect(() => {
    getFromDictionary<IDictionary>(DEMO_TIP_SHOW).then(res => {
      const { success, data } = res;
      if (success && data) {
        const savedData = JSON.parse(data.value);
        saveTipVisible(savedData);
      } else {
        saveTipVisible(true);
      }
    });
  }, []);
  
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

  const hideTip = useCallback(() => {
    saveDictionary(DEMO_TIP_SHOW, false).then((res) => {
      if (res.success) {
        saveTipVisible(false);
      }
    });
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      saveRun(false);
    }
  };

  return (
    <div className={styles.main}>
      <Joyride
        run={run}
        callback={handleJoyrideCallback}
        continuous
        hideCloseButton
        scrollToFirstStep
        showProgress={false}
        showSkipButton
        steps={STEPS}
        spotlightPadding={0}
        locale={{
          'back': '上一个',
          'next': '下一个',
          'last': '完成'
        }}
        floaterProps={{...floaterStyle}}
        styles={{...tourStyle}}
      />
      <SideBar>
        <ProjectSiderbar
          isLoading={isLoading}
          projectInfo={projectInfo}
          backgroundColor={EnvironmentColors[envIndex]}
        />
      </SideBar>
      <div className={styles.content}>
        {
          tipVisible && (localStorage.getItem('isDemo') === 'true') && (
            <div className={styles['platform-tips']}>
              <Icon type='error-circle' customClass={styles['platform-tips-error']} />
              <span className={styles['platform-tips-text']}>
                <FormattedMessage id='platform.warning.text' />
              </span>
              <Icon type='close' customClass={styles['platform-tips-close']} onClick={() => {hideTip();}} />
            </div>
          )
        }
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
            match.path === TOGGLE_PATH && (
              <Breadcrumb.Section active>{ projectInfo?.name }</Breadcrumb.Section>
            )
          }
          {
            match.path === SETTING_PATH && (
              <Breadcrumb.Section active>
                <FormattedMessage id='common.toggle.settings.text' />
              </Breadcrumb.Section>
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
	);
};

export default ProjectLayout;