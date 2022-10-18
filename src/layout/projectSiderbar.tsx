import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useParams, useHistory, useRouteMatch } from 'react-router-dom';
import { Dropdown, DropdownProps, Dimmer, Loader } from 'semantic-ui-react';
import classNames from 'classnames';
import { FormattedMessage, useIntl } from 'react-intl';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import PutAwayMemu from 'components/PutAwayMenu';
import { IRouterParams, IProject, IEnvironment } from 'interfaces/project';
import { TOGGLE_PATH, TARGETING_PATH, SEGMENT_PATH, SEGMENT_ADD_PATH, SEGMENT_EDIT_PATH, GET_STARTED_PATH, SETTING_PATH } from 'router/routes';
import { SidebarContainer } from './hooks';
import styles from './sidebar.module.scss';

interface IProps {
  isLoading: boolean;
  projectInfo: IProject;
  backgroundColor: string;
}

const ProjectSiderbar = (props: IProps) => {
  const { isLoading, projectInfo, backgroundColor } = props;
  const { projectKey, environmentKey, toggleKey, navigation } = useParams<IRouterParams>();
  const [ selectedItem, setSelectedItem ] = useState<string>();
  const [ open, setOpen ] = useState<boolean>(false);
  const [ env, setEnv ] = useState<string>('');
  const [ envName, setEnvName ] = useState<string>('');
  const history = useHistory();
  const match = useRouteMatch();
  const intl = useIntl();

  const { isPutAway } = SidebarContainer.useContainer();

  const sidebarCls = classNames(
    styles.sidebar, 
    {
      [styles['sidebar-close']]: isPutAway
    }
  );

  const envCls = classNames(
    'joyride-environment',
    styles.environment, 
    {
      [styles['environment-close']]: isPutAway
    }
  );

  const menuCls = classNames(
    styles['project-menu-item'],
    {
      [styles['project-menu-item-close']]: isPutAway
    }
  );

  useEffect(() => {
    const { path } = match;
    if (path === TOGGLE_PATH || path === TARGETING_PATH || path === GET_STARTED_PATH) {
      setSelectedItem('toggle');
    } else if (path === SEGMENT_PATH || path === SEGMENT_ADD_PATH || path === SEGMENT_EDIT_PATH) {
      setSelectedItem('segments');
    } else if (path === SETTING_PATH) {
      setSelectedItem('settings');
    }
  }, [match]);

  const options = projectInfo.environments.map((env: IEnvironment) => {
    return {
      key: env.key,
      text: env.name,
      value: env.key,
    };
  });

  const handleChangeEnv = useCallback(async (e: SyntheticEvent, detail: DropdownProps) => {
    setOpen(true);

    // @ts-ignore detail value
    setEnv(detail.value);
    // @ts-ignore envName
    setEnvName(e.target.innerText);
  }, []);

  const gotoPage = useCallback(() => {
    setOpen(false);
    let url = '';
    if (match.path === TOGGLE_PATH) {
      url = `/${projectKey}/${env}/toggles`;
    } else if (match.path === TARGETING_PATH) {
      url = `/${projectKey}/${env}/${toggleKey}/${navigation}`;
    } else if (match.path === SEGMENT_PATH) {
      url = `/${projectKey}/${env}/segments`;
    }
    history.push(url);
  }, [history, projectKey, toggleKey, navigation, env, match.path]);

  const gotoToggles = useCallback(() => {
    history.push(`/${projectKey}/${environmentKey}/toggles`);
  }, [projectKey, environmentKey, history]);

  const gotoSegments = useCallback(() => {
    history.push(`/${projectKey}/${environmentKey}/segments`);
  }, [projectKey, environmentKey, history]);

  const gotoSettings = useCallback(() => {
    history.push(`/${projectKey}/${environmentKey}/settings`);
  }, [projectKey, environmentKey, history]);

  return (
    <div className={sidebarCls}>
      {
         isLoading ? (
          <Dimmer Dimmer active inverted style={{backgroundColor: 'transparent'}}>
            <Loader size='small'>
              <FormattedMessage id='common.loading.text' />
            </Loader>
          </Dimmer>
        ) : (
          <>
            <div className={styles['project-name']}>
              { projectInfo.name }
            </div>
            <div className={envCls} style={{ backgroundColor }}>
              <Dropdown
                className={styles['environment-dropdown']}
                value={environmentKey} 
                pointing={isPutAway ? 'left' : 'top'}
                options={options} 
                selection 
                floating
                fluid 
                icon={<Icon customClass={styles['angle-down']} type='angle-down' />}
                onChange={handleChangeEnv}
              />
            </div>

            <div className={styles['project-menu']}>
              <div className={`${selectedItem ==='toggle' && styles.selected} ${menuCls}`} onClick={gotoToggles}>
                <PutAwayMemu
                  type='toggle'
                  isPutAway={isPutAway}
                  title={intl.formatMessage({id: 'common.toggles.text'})}
                />
              </div>
            </div>

            <div className={`${selectedItem ==='segments' && styles.selected} ${menuCls}`} onClick={gotoSegments}>
              <PutAwayMemu
                type='member'
                isPutAway={isPutAway}
                title={intl.formatMessage({id: 'common.segments.text'})}
              />
            </div>

            <div className={`${selectedItem ==='settings' && styles.selected} ${menuCls}`} onClick={gotoSettings}>
              <PutAwayMemu
                type='setting'
                isPutAway={isPutAway}
                title={intl.formatMessage({id: 'common.toggle.appoval.settings.text'})}
              />
            </div>
          </>
        )
      }
      
      <Modal 
        open={open}
        width={400}
        handleCancel={() => {setOpen(false);}}
        handleConfirm={gotoPage}
      >
        <div>
          <div className={styles['modal-header']}>
            <Icon customClass={styles['warning-circle']} type='warning-circle' />
            <span className={styles['modal-header-text']}>
              <FormattedMessage id='sidebar.modal.title' />
            </span>
          </div>
          <div className={styles['modal-content']}>
            { 
              intl.formatMessage({
                id: 'sidebar.modal.content'
              }, {
                envName
              }) 
            }
          </div>
        </div>
      </Modal>
    </div>
	);
};

export default ProjectSiderbar;