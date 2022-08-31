import { useCallback } from 'react';
import classNames from 'classnames';
import { useIntl } from 'react-intl';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { MEMBER_PATH, PROFILE_PATH } from 'router/routes';
import PutAwayMemu from 'components/PutAwayMenu';
import { MEMBERS, PROFILE } from 'constants/sidebar';
import { SidebarContainer } from './hooks';
import styles from './sidebar.module.scss';

const Sidebar = () => {
  const { isPutAway } = SidebarContainer.useContainer();
  const match = useRouteMatch();
  const history = useHistory();
  const intl = useIntl();

  const sidebarCls = classNames(
    styles['setting-sidebar'], 
    {
      [styles['setting-sidebar-close']]: isPutAway
    }
  );

  const memberCls = classNames(
    styles['project-menu-item'],
    {
      [styles['project-menu-item-close']]: isPutAway,
    },
    {
      [styles.selected]: match.path === MEMBER_PATH,
    }
  );

  const profileCls = classNames(
    styles['project-menu-item'],
    {
      [styles['project-menu-item-close']]: isPutAway
    },
    {
      [styles.selected]: match.path === PROFILE_PATH,
    }
  );

  const gotoPage = useCallback((path: string) => {
    history.push(`/settings/${path}`);
  }, [history]);

  return (
    <div className={sidebarCls}>
      <div className={memberCls} onClick={() => gotoPage(MEMBERS)}>
        <PutAwayMemu
          type='member'
          isPutAway={isPutAway}
          title={intl.formatMessage({id: 'common.members.text'})}
        />
      </div>
      <div className={profileCls} onClick={() => gotoPage(PROFILE)}>
        <PutAwayMemu
          type='attribute'
          isPutAway={isPutAway}
          title={intl.formatMessage({id: 'common.profile.text'})}
        />
      </div>
    </div>
	);
};

export default Sidebar;