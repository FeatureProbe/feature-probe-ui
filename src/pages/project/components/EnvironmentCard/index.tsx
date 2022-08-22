import { SyntheticEvent, useCallback, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Popup } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { EnvironmentColors, EnvironmentBgColors } from 'constants/colors';
import CopyToClipboardPopup from 'components/CopyToClipboard';
import message from 'components/MessageBox';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import { editEnvironment } from 'services/project';
import { IEnvironment } from 'interfaces/project';
import { environmentContainer } from '../../provider';
import styles from './index.module.scss';

interface IProps {
  item: IEnvironment;
  total: number;
  index: number;
  projectKey: string;
  isArchived: boolean;
  handleEditEnvironment(): void;
  refreshEnvironmentList(isArchived: boolean): void;
}

const EnvironmentCard = (props: IProps) => {
  const { item, index, projectKey, total, isArchived, handleEditEnvironment, refreshEnvironmentList } = props;
  const history = useHistory();
  const [ isHover, setIsHover ] = useState<boolean>(false);
  const [ open, setMenuOpen ] = useState<boolean>(false);
  const [ archiveOpen, setArchiveOpen] = useState<boolean>(false);
  const [ restoreOpen, setRestoreOpen] = useState<boolean>(false);
  const intl = useIntl();

  const { 
    saveEnvironmentInfo,
    saveOriginEnvironmentInfo,
  } = environmentContainer.useContainer();

  useEffect(() => {
    const handler = () => {
      if (open) {
        setMenuOpen(false);
      }
    }
    window.addEventListener('click', handler);

    return () => window.removeEventListener('click', handler);
  }, [open]);

  const handleGotoToggle = useCallback((environmentKey: string) => {
    history.push(`/${projectKey}/${environmentKey}/toggles`);
  }, [history, projectKey]);

  const confirmArchiveEnv = useCallback(async () => {
    let res = await editEnvironment(projectKey, item.key, {
      archived: true,
    });

    if (res.success) {
      message.success(intl.formatMessage({id: 'toggles.enviroment.archive.success'}));
      refreshEnvironmentList(false);
    } else {
      message.error(intl.formatMessage({id: 'toggles.enviroment.archive.error'}));
    }
  }, [item.key, projectKey, intl, refreshEnvironmentList]);

  const confirmRestoreEnv = useCallback(async () => {
    let res = await editEnvironment(projectKey, item.key, {
      archived: false,
    });

    if (res.success) {
      message.success(intl.formatMessage({id: 'toggles.enviroment.restore.success'}));
      refreshEnvironmentList(true);
    } else {
      message.error(intl.formatMessage({id: 'toggles.enviroment.restore.error'}));
    }
  }, [item.key, projectKey, intl, refreshEnvironmentList]);

	return (
    <div 
      className={styles.environment} 
      onClick={() => handleGotoToggle(item.key)} 
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div style={{background: EnvironmentColors[index % 5]}} className={styles['environment-line']}></div>
      <div className={styles.content}>
        <div className={styles.title}>
          <span>{ item.name }</span>
          {
            isHover && (
              <Popup
                open={open}
                on='click'
                position='bottom left'
                basic
                hoverable
                className={styles.popup}
                onUnmount={() => setMenuOpen(false)}
                trigger={
                  <div 
                    onClick={(e: SyntheticEvent) => {
                      e.stopPropagation();
                      setMenuOpen(true);
                    }}
                  >
                    <Icon customClass={styles.iconfont} type='more' />
                  </div>
                }
              >
                <div className={styles['menu']} onClick={(e: SyntheticEvent) => {
                  e.stopPropagation();
                  setMenuOpen(false);
                }}>
                  <div className={styles['menu-item']} onClick={() => {
                    saveEnvironmentInfo({
                      name: item.name,
                      key: item.key,
                    });
                    saveOriginEnvironmentInfo({
                      name: item.name,
                      key: item.key,
                    });
                    handleEditEnvironment();
                  }}>
                    <FormattedMessage id='projects.menu.edit.environment' />
                  </div>
                  {
                    isArchived ? (
                      <div className={styles['menu-item']} onClick={() => { setRestoreOpen(true); }}>
                        <FormattedMessage id='projects.menu.restore.environment' />
                      </div>
                    ) : (
                      total > 1 && (
                        <div 
                          className={styles['menu-item']} 
                          onClick={() => { 
                            setArchiveOpen(true); 
                          }}
                        >
                          <FormattedMessage id='projects.menu.archive.environment' />
                        </div>
                      )
                    )
                  }
                </div>
              </Popup>
            )
          }
        </div>
        <div className={styles.key} >
          <span style={{color: EnvironmentColors[index % 5], backgroundColor: EnvironmentBgColors[index % 5]}} className={styles['key-label']}>
            { item.key }
          </span>
        </div>
        <div className={styles['sdk-key']}>
          <span className={styles.text}>
            <FormattedMessage id='projects.server.sdk.key' />
          </span>
        </div>
        <div className={styles['sdk-value']}>
          <CopyToClipboardPopup text={item.serverSdkKey}>
            <span className={styles.text} onClick={e => e.stopPropagation()}>
              { item.serverSdkKey }
            </span>
          </CopyToClipboardPopup>
        </div>
        <div className={styles['sdk-key']}>
          <span className={styles.text}>
            <FormattedMessage id='projects.client.sdk.key' />
          </span>
        </div>
        <div className={styles['sdk-value']}>
          <CopyToClipboardPopup text={item.clientSdkKey}>
            <span className={styles.text} onClick={e => e.stopPropagation()}>{ item.clientSdkKey }</span>
          </CopyToClipboardPopup>
        </div>
      </div>

      <Modal 
        open={archiveOpen}
        width={400}
        handleCancel={(e: SyntheticEvent) => {
          e.stopPropagation();
          setArchiveOpen(false);
        }}
        handleConfirm={(e: SyntheticEvent) => {
          e.stopPropagation();
          setArchiveOpen(false);
          confirmArchiveEnv();
        }}
      >
        <div onClick={(e: SyntheticEvent) => { e.stopPropagation(); }}>
          <div className={styles['modal-header']}>
            <Icon customClass={styles['warning-circle']} type='warning-circle' />
            <span className={styles['modal-header-text']}>
              <FormattedMessage id='projects.environment.archive.title' />
            </span>
          </div>
          <div className={styles['modal-content']}>
            <FormattedMessage id='projects.environment.archive.content' />
          </div>
        </div>
      </Modal>

      <Modal 
        open={restoreOpen}
        width={400}
        handleCancel={(e: SyntheticEvent) => {
          e.stopPropagation();
          setRestoreOpen(false);
        }}
        handleConfirm={(e: SyntheticEvent) => {
          e.stopPropagation();
          setRestoreOpen(false);
          confirmRestoreEnv();
        }}
      >
        <div onClick={(e: SyntheticEvent) => { e.stopPropagation(); }}>
          <div className={styles['modal-header']}>
            <Icon customClass={styles['warning-circle']} type='warning-circle' />
            <span className={styles['modal-header-text']}>
              <FormattedMessage id='projects.environment.restore.title' />
            </span>
          </div>
          <div className={styles['modal-content']}>
            <FormattedMessage id='projects.environment.restore.content' />
          </div>
        </div>
      </Modal>
    </div>
	)
}

export default EnvironmentCard;
