import { SyntheticEvent, useCallback, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Popup } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { EnvironmentColors, EnvironmentBgColors } from 'constants/colors';
import CopyToClipboardPopup from 'components/CopyToClipboard';
import Icon from 'components/Icon';
import { IEnvironment } from 'interfaces/project';
import { environmentContainer } from '../../provider';
import styles from './index.module.scss';

interface IProps {
  item: IEnvironment;
  index: number;
  projectKey: string;
  handleEditEnvironment(): void;
}

const EnvironmentCard = (props: IProps) => {
  const { item, index, projectKey, handleEditEnvironment } = props;
  const history = useHistory();
  const [ isHover, setIsHover ] = useState<boolean>(false);
  const [ open, setMenuOpen ] = useState<boolean>(false);

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
    </div>
	)
}

export default EnvironmentCard;
