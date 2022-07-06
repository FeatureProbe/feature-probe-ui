import { SyntheticEvent, useEffect, useState, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import cloneDeep from 'lodash/cloneDeep';
import { Menu, MenuItemProps, Popup } from 'semantic-ui-react';
import localForage from 'localforage';
import { FormattedMessage, useIntl } from 'react-intl';
import message from 'components/MessageBox';
import Button from 'components/Button';
import ProjectLayout from 'layout/projectLayout';
import TargetingForm from './components/TargetingForm';
import Metrics from './components/Metrics';
import Info from './components/Info';
import History from './components/History';
import { Provider } from './provider';
import { getTargeting, getToggleInfo } from 'services/toggle';
import { getSegmentList } from 'services/segment';
import { IToggleInfo, ITarget, IContent, IModifyInfo } from 'interfaces/targeting';
import { ISegmentList } from 'interfaces/segment';
import { IRouterParams } from 'interfaces/project';
import { NOT_FOUND } from 'constants/httpCode';
import styles from './index.module.scss';

const Targeting = () => {
  const { projectKey, environmentKey, toggleKey, navigation } = useParams<IRouterParams>();
  const [ activeItem, saveActiveItem ] = useState(navigation || 'targeting');
  const [ toggleInfo, saveToggleInfo ] = useState<IToggleInfo>();
  const [ targeting, saveTargeting ] = useState<ITarget>();
  const [ segmentList, saveSegmentList ] = useState<ISegmentList>();
  const [ toggleDisabled, saveToggleDisable ] = useState<boolean>(false);
  const [ initialTargeting, saveInitTargeting ] = useState<IContent>();
  const [ historyOpen, setHistoryOpen ] = useState<boolean>(false);
  const [ modifyInfo, saveModifyInfo ] = useState<IModifyInfo>();

  const history = useHistory();
  const intl = useIntl();

  useEffect(() => {
    const handler = () => {
      if (historyOpen) {
        setHistoryOpen(false);
      }
    }
    window.addEventListener('click', handler);

    return () => window.removeEventListener('click', handler);
  }, [historyOpen]);

  useEffect(() => {
    if (projectKey) {
      localForage.setItem('projectKey', projectKey);
    }
    if (environmentKey) {
      localForage.setItem('environmentKey', environmentKey);
    }
  }, [projectKey, environmentKey]);

  useEffect(() => {
    saveActiveItem(navigation);
  }, [navigation]);

  const initTargeting = useCallback(() => {
    getTargeting<IContent>(projectKey, environmentKey, toggleKey).then(res => {
      const { data, success } = res;
      if (success && data) {
        const { content, disabled, modifiedBy, modifiedTime } = data;
        saveTargeting(cloneDeep(content) || {});
        saveToggleDisable(disabled);
        saveInitTargeting(cloneDeep({
          disabled,
          content,
        }));
        saveModifyInfo({
          modifiedBy,
          modifiedTime,
        });
      } else {
        message.error(res.message || intl.formatMessage({id: 'toggles.targeting.error.text'}));
      }
    });
  }, [intl, projectKey, environmentKey, toggleKey]);

  const initToggleInfo = useCallback(() => {
    getToggleInfo<IToggleInfo>(projectKey, environmentKey, toggleKey).then(async(res) => {
      const { data, success, code } = res;
      if (success && data) {
        saveToggleInfo(data);
      } else if (!success && code === NOT_FOUND) {
        await localForage.removeItem('projectKey');
        await localForage.removeItem('environmentKey');
        history.push('/notfound');
        return;
      } else {
        message.error(res.message || intl.formatMessage({id: 'toggles.info.error.text'}));
      }
    });
  }, [intl, projectKey, environmentKey, toggleKey, history]);

  const initSegmentList = useCallback(() => {
    getSegmentList<ISegmentList>(projectKey, {
      pageIndex: 0,
      pageSize: 10,
    }).then(async (res) => {
      const { success, data } = res;
      if (success) {
        saveSegmentList(data);
      }
    });
  }, [projectKey]);

  useEffect(() => {
    initToggleInfo();
    initTargeting();
    initSegmentList();
  }, [initToggleInfo, initTargeting, initSegmentList]);

  const handleItemClick = useCallback((e: SyntheticEvent, value: MenuItemProps) => {
    history.push(`/${projectKey}/${environmentKey}/${toggleKey}/${value.name}`);
  }, [history, projectKey, environmentKey, toggleKey]);

	return (
    <ProjectLayout>
      <div className={styles.targeting}>
        <Provider>
          <>
            <Info
              toggleInfo={toggleInfo}
              modifyInfo={modifyInfo}
            />
            <div className={styles.menus}>
              <Menu pointing secondary className={styles.menu}>
                <Menu.Item
                  name='targeting'
                  active={activeItem === 'targeting'}
                  onClick={handleItemClick}
                >
                  <FormattedMessage id='common.targeting.text' />
                </Menu.Item>
                <Menu.Item
                  name='metrics'
                  active={activeItem === 'metrics'}
                  onClick={handleItemClick}
                >
                  <FormattedMessage id='common.metrics.text' />
                </Menu.Item>
              </Menu>
              <div className={styles.history}>
                <Popup
                  basic
                  open={historyOpen}
                  on='click'
                  position='bottom right'
                  className={styles.popup}
                  trigger={
                    <Button 
                      primary
                      type='button'
                      onClick={(e: SyntheticEvent) => {
                        document.body.click();
                        e.stopPropagation();
                        setHistoryOpen(true);
                      }}
                      className={styles['variation-add-btn']} 
                    >
                      <FormattedMessage id='common.history.text' />
                    </Button>
                  }
                >
                  <History />
                </Popup>
              </div>
            </div>
            {
              activeItem === 'targeting' && (
                <TargetingForm 
                  targeting={targeting}
                  toggleInfo={toggleInfo}
                  segmentList={segmentList}
                  toggleDisabled={toggleDisabled}
                  initialTargeting={initialTargeting}
                  initTargeting={initTargeting}
                  saveToggleDisable={saveToggleDisable}
                />
              )
            }
            {
              activeItem === 'metrics' && (
                <Metrics />
              )
            }
          </>
        </Provider>
      </div>
    </ProjectLayout>
	)
}

export default Targeting;
