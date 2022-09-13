import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Popup } from 'semantic-ui-react';
import classNames from 'classnames';
import { FormattedMessage, useIntl } from 'react-intl';
import Icon from 'components/Icon';
import message from 'components/MessageBox';
import { PROJECT_PATH } from 'router/routes';
import { getUserInfo } from 'services/user';
import { getApprovalList } from 'services/approval';
import { IUser } from 'interfaces/member';
import { I18NContainer } from 'hooks';
import { APPROVAL_ROUTE_LIST, PROJECT_ROUTE_LIST, SETTING_ROUTE_LIST } from 'constants/pathname';
import logo from 'images/logo.svg';
import logoWhite from 'images/logo-white.svg';
import { HeaderContainer } from './hooks';
import { EventTrack } from 'utils/track';
import styles from './pageHeader.module.scss';
import { IApprovalList } from 'interfaces/approval';

const PROJECT_NAV = 'projects';
const SETTING_NAV = 'settings';
const APPROVAL_NAV = 'approvals';
const isDemo = localStorage.getItem('isDemo') === 'true';
const isMainColorHeader = false;

const PageHeader = () => {
  const history = useHistory();
  const location = useLocation();
  const intl = useIntl();
  const { userInfo, saveUserInfo } = HeaderContainer.useContainer();

  const [ selectedNav, setSelectedNav ] = useState<string>('');
  const [ account, setAccount ] = useState<string>('');
  const [ menuOpen, setMenuOpen ] = useState<boolean>(false);
  const [ helpMenuOpen, setHelpMenuOpen ] = useState<boolean>(false);
  const [ i18nMenuOpen, setI18nMenuOpen ] = useState<boolean>(false);

  const {
    i18n,
    setI18n
  } = I18NContainer.useContainer();

  const headerCls = classNames(
    styles['header'],
    {
      [styles['header-main']]: isMainColorHeader
    }
  );

  const projectCls = classNames(
    'navs-item',
    {
      'navs-item-selected': selectedNav === PROJECT_NAV
    }
  );

  const settingCls = classNames(
    'navs-item',
    {
      'navs-item-selected': selectedNav === SETTING_NAV
    }
  );

  const approvalCls = classNames(
    'navs-item',
    {
      'navs-item-selected': selectedNav === APPROVAL_NAV
    }
  );

  useEffect(() => {
    const handler = () => {
      if (menuOpen) {
        setMenuOpen(false);
      }
      if (helpMenuOpen) {
        setHelpMenuOpen(false);
      }
      if (i18nMenuOpen) {
        setI18nMenuOpen(false);
      }
    };
    window.addEventListener('click', handler);

    return () => window.removeEventListener('click', handler);
  }, [menuOpen, helpMenuOpen, i18nMenuOpen]);

  useEffect(() => {
    let result: IUser;

    getUserInfo<IUser>().then(res => {
      const { success } = res;
      if (success) {
        const { data } = res;
        if (data) {
          setAccount(data?.account);
          saveUserInfo({
            ...data,
            approvalCount: userInfo.approvalCount,
          });
          EventTrack.setUserId(data.account);
          result = data;
        }
      } else {
        message.error(intl.formatMessage({id: 'header.getuser.error.text'}));
      }
    });

    getApprovalList<IApprovalList>({
			pageIndex: 0,
			status: 'PENDING',
			type: 'APPROVAL',
			keyword: '',
		}).then(res => {
			const { success, data } = res;
			if (success && data) {
				const { totalElements } = data;
        saveUserInfo({
          ...result,
          approvalCount: totalElements,
        });
      }
		});
  }, [intl, saveUserInfo]);

  useEffect(() => {
    const reg = new RegExp('[^/]+$');
    const res = reg.exec(location.pathname);

    if (res && res[0]) {
      if (PROJECT_ROUTE_LIST.includes(res[0])) {
        setSelectedNav(PROJECT_NAV);
      }
      else if (SETTING_ROUTE_LIST.includes(res?.input)) {
        setSelectedNav(SETTING_NAV);
      }
      else if (APPROVAL_ROUTE_LIST.includes(res?.input)) {
        setSelectedNav(APPROVAL_NAV);
      }
      else {
        setSelectedNav(PROJECT_NAV);
      }
    }
  }, [location.pathname]);

  const handleGotoProject = useCallback(() => {
    history.push(PROJECT_PATH);
  }, [history]);

  const handleGotoAccount = useCallback(() => {
    history.push('/settings/members');
  }, [history]);

  const handleLogout = useCallback(async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('organizeId');
    history.push('/login');
  }, [history]);

  const handleGotoGithub = useCallback(() => {
    window.open('https://github.com/FeatureProbe/FeatureProbe');
  }, []);

  const handleGotoDocument = useCallback(() => {
    if (i18n === 'en-US') {
      window.open('https://docs.featureprobe.io/');
    } else {
      window.open('https://docs.featureprobe.io/zh-CN');
    }
  }, [i18n]);

  const handleGotoApproval = useCallback(() => {
    history.push('/approvals/list');
  }, [history]);

  return (
    <div className={headerCls}>
      <div className={styles.logo} onClick={handleGotoProject}>
        {
          isMainColorHeader 
          ? <img className={styles['logo-image']} src={logoWhite} alt='logo' />
          : <img className={styles['logo-image']} src={logo} alt='logo' />
        }
      </div>
      <div className={styles.navs}>
        <div className={projectCls} onClick={handleGotoProject}>
          <FormattedMessage id='common.projects.text' />
        </div>
        {
          isDemo ? null : (
            <div className={settingCls} onClick={handleGotoAccount}>
              <FormattedMessage id='common.settings.text' />
            </div>
          )
        }
        {
          isDemo ? null : (
            <div className={approvalCls} onClick={handleGotoApproval}>
              <FormattedMessage id='approvals.center' />
              { userInfo.approvalCount !== 0 && <span className={styles.count}>{userInfo.approvalCount > 99 ? '99+' : userInfo.approvalCount}</span> }
            </div>
          )
        }
      </div>
      <div className={'user'}>
        <Popup
          basic
          open={i18nMenuOpen}
          on='click'
          position='bottom right'
          className={styles.popup}
          trigger={
            <div 
              onClick={(e: SyntheticEvent) => {
                document.body.click();
                e.stopPropagation();
                setI18nMenuOpen(true);
              }}
              className={styles['language-popup']}
            >
              {i18n === 'en-US' ? 'English' : '中文'}
              <Icon customClass={styles['angle-down']} type='angle-down' />
            </div>
          }
        >
          <div className={styles['menu']} onClick={() => {setI18nMenuOpen(false);}}>
            <div className={styles['menu-item']} onClick={()=> {setI18n('en-US');}}>
              English
            </div>
            <div className={styles['menu-item']} onClick={()=> {setI18n('zh-CN');}}>
              中文
            </div>
          </div>
        </Popup>
        <Popup
          basic
          open={helpMenuOpen}
          on='click'
          position='bottom right'
          className={styles.popup}
          trigger={
            <div 
              onClick={(e: SyntheticEvent) => {
                document.body.click();
                e.stopPropagation();
                setHelpMenuOpen(true);
              }}
              className={styles['question-popup']}
            >
              <Icon customClass={styles['question']} type='question' />
            </div>
          }
        >
          <div className={styles['menu']} onClick={() => {setHelpMenuOpen(false);}}>
            <div 
              className={styles['menu-item']} 
              onClick={()=> {
                handleGotoDocument();
              }}
            >
              <FormattedMessage id='common.documentation.text' />
            </div>
            <div 
              className={styles['menu-item']} 
              onClick={()=> {
                handleGotoGithub();
              }}
            >
              Github
            </div>
          </div>
        </Popup>
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
             <span className={'user-circle'}>
                <Icon customClass={styles['icon-avatar']} type='avatar' />
              </span>
              <span className={styles.username}>{ account }</span>
            </div>
          }
        >
          <div className={styles['menu']} onClick={() => {setMenuOpen(false);}}>
            <div className={styles['menu-item']} onClick={handleLogout}>
              <FormattedMessage id='common.logout.text' />
            </div>
          </div>
        </Popup>
      </div>
    </div>
	);
};

export default PageHeader;