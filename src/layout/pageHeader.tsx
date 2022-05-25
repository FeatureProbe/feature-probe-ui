import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Popup } from 'semantic-ui-react';
import classNames from 'classnames';
import { FormattedMessage, useIntl } from 'react-intl';
import Icon from 'components/Icon';
import message from 'components/MessageBox';
import { PROJECT_PATH } from 'router/routes';
import { getUserInfo, logout } from 'services/user';
import { IUserInfo } from 'interfaces/member';
import logo from 'images/logo.svg';
import styles from './pageHeader.module.scss';

const PROJECT_NAV = 'projects';
const SETTING_NAV = 'settings';

const PROJECT_ROUTE_LIST = ['projects', 'toggles', 'targeting', 'metrics'];
const SETTING_ROUTE_LIST = ['members', 'profile'];

const PageHeader = () => {
  const history = useHistory();
  const location = useLocation();
  const intl = useIntl();

  const [ selectedNav, setSelectedNav ] = useState<string>('');
  const [ account, setAccount ] = useState<string>('');
  const [ menuOpen, setMenuOpen ] = useState<boolean>(false);
  const [ helpMenuOpen, setHelpMenuOpen ] = useState<boolean>(false);

  useEffect(() => {
    const handler = () => {
      if (menuOpen) {
        setMenuOpen(false);
      }
      if (helpMenuOpen) {
        setHelpMenuOpen(false);
      }
    }
    window.addEventListener('click', handler);

    return () => window.removeEventListener('click', handler);
  }, [menuOpen, helpMenuOpen]);

  useEffect(() => {
    getUserInfo<IUserInfo>().then((res) => {
      const { success } = res;
      if (success) {
        const { data } = res;
        if (data) {
          setAccount(data?.account);
        }
      } else {
        message.error(intl.formatMessage({id: 'header.getuser.error.text'}));
      }
    });
  }, [intl]);

  useEffect(() => {
    const reg = new RegExp('[^/]+$');
    const res = reg.exec(location.pathname);
    

    if (res && res[0]) {
      if (PROJECT_ROUTE_LIST.includes(res[0])) {
        setSelectedNav(PROJECT_NAV);
      } else if (SETTING_ROUTE_LIST.includes(res[0])) {
        setSelectedNav(SETTING_NAV);
      }
    }
  }, [location.pathname])

  const handleGotoProject = useCallback(() => {
    history.push(PROJECT_PATH);
  }, [history]);

  const handleGotoAccount = useCallback(() => {
    history.push('/settings/members');
  }, [history]);

  const projectCls = classNames(
    styles['navs-item'],
    {
      [styles['navs-item-selected']]: selectedNav === PROJECT_NAV
    }
  );

  const settingCls = classNames(
    styles['navs-item'],
    {
      [styles['navs-item-selected']]: selectedNav === SETTING_NAV
    }
  );

  const handleLogout = useCallback(async () => {
    const res = await logout();
    if (res.success) {
      history.push('/login');
    }
  }, [history]);

  const handleGotoDocument = useCallback(() => {
    window.open('https://github.com/FeatureProbe/FeatureProbe');
  }, []);

  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <img className={styles['logo-image']} src={logo} alt='logo' />
      </div>
      <div className={styles.navs}>
        <div className={projectCls} onClick={handleGotoProject}>
          <FormattedMessage id='common.projects.text' />
        </div>
        <div className={settingCls} onClick={handleGotoAccount}>
          <FormattedMessage id='common.settings.text' />
        </div>
      </div>
      <div className={styles.user}>
        <div onClick={handleGotoDocument}>
          <img className={styles.github} src={require('images/github.png')} alt='github' />
        </div>

        {/* <Popup
          basic
          open={helpMenuOpen}
          on='click'
          position='bottom right'
          className={styles.popup}
          trigger={
            <div onClick={(e: SyntheticEvent) => {
              document.body.click();
              e.stopPropagation();
              setHelpMenuOpen(true);
            }}>
              <Icon customClass={styles['icon-question']} type='question' />
            </div>
          }
        >
          <div className={styles['menu']} onClick={() => {setHelpMenuOpen(false)}}>
            <div className={styles['menu-item']} onClick={handleGotoDocument}>
              <FormattedMessage id='common.documentation.text' />
            </div>
          </div>
        </Popup> */}

        <Popup
          basic
          open={menuOpen}
          on='click'
          position='bottom right'
          className={styles.popup}
          trigger={
            <div onClick={(e: SyntheticEvent) => {
              document.body.click();
              e.stopPropagation();
              setMenuOpen(true);
            }}>
              <span className={styles['user-circle']}>
                <Icon customClass={styles['icon-avatar']} type='avatar' />
              </span>
              <span className={styles.username}>{ account }</span>
            </div>
          }
        >
          <div className={styles['menu']} onClick={() => {setMenuOpen(false)}}>
            <div className={styles['menu-item']} onClick={handleLogout}>
              <FormattedMessage id='common.logout.text' />
            </div>
          </div>
        </Popup>
      </div>
    </div>
	)
}

export default PageHeader;