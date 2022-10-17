import { ReactElement, useCallback, useEffect, useState } from 'react';
import { useParams, useHistory, useRouteMatch } from 'react-router-dom';
import { Breadcrumb } from  'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import Joyride, { CallBackProps, Step, EVENTS, ACTIONS } from 'react-joyride';
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
import { DEMO_TIP_SHOW, USER_GUIDE_LAYOUT } from 'constants/dictionary_keys';

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

interface IProps {
  children: ReactElement
}

const STEPS: Step[] = [
  {
    content: (
      <div className={styles['joyride-content']}>
        <div className={styles['joyride-title']}>
          <FormattedMessage id='guide.global.step1.title' />
        </div>
        <ul className={styles['joyride-item']} >
          <li><FormattedMessage id='guide.global.step1.project' /></li>
          <li><FormattedMessage id='guide.global.step1.env' /></li>
          <li><FormattedMessage id='guide.global.step1.enter' /></li>
        </ul>
        <div className={styles['joyride-pagination']}>1/2</div>
      </div>
    ),
    placement: 'bottom',
    spotlightPadding: 0,
    target: '.joyride-project',
    ...commonConfig
  },
  {
    content: (
      <div className={styles['joyride-content']}>
        <div className={styles['joyride-title']}>
          <FormattedMessage id='guide.global.step2.title' />
        </div>
        <ul className={styles['joyride-item']} >
          <li><FormattedMessage id='guide.global.step2.env' /></li>
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
  const [ stepIndex, saveStepIndex ] = useState<number>(0);
  const history = useHistory();
  const match = useRouteMatch();
  const intl = useIntl();

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

    getFromDictionary<IDictionary>(USER_GUIDE_LAYOUT).then(res => {
      const { success, data } = res;
      if (success && data) {
        const savedData = JSON.parse(data.value);
        if (parseInt(savedData) !== STEPS.length) {
          setTimeout(() => {
            saveRun(true);
          }, 0);
          saveStepIndex(parseInt(savedData));
        }
      } else {
        setTimeout(() => {
          saveRun(true);
        }, 0);
      }
    });
  }, []);
  
  const gotoProjects = useCallback(() => {
    history.push('/projects');
  }, [history]);

  const gotoToggle = useCallback(() => {
    if (!toggleKey) return;
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

  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { action, index, type } = data;

    if (([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(type)) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      saveStepIndex(nextStepIndex);
      saveDictionary(USER_GUIDE_LAYOUT, nextStepIndex);
    }
  }, []);

  return (
    <div className={styles.main}>
      <Joyride
        run={run}
        callback={handleJoyrideCallback}
        stepIndex={stepIndex}
        continuous
        hideCloseButton
        scrollToFirstStep
        showProgress={false}
        showSkipButton
        steps={STEPS}
        disableCloseOnEsc={true}
        locale={{
          'back': intl.formatMessage({id: 'guide.last'}),
          'next': intl.formatMessage({id: 'guide.next'}),
          'last': intl.formatMessage({id: 'guide.done'}),
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