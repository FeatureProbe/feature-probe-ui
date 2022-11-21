import { useCallback } from 'react';
import classNames from 'classnames';
import { useIntl } from 'react-intl';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { WEBHOOK_LIST_PATH, WEBHOOK_SEAT_PATH } from 'router/routes';
import PutAwayMemu from 'components/PutAwayMenu';
import { LIST, SEAT } from 'constants/sidebar';
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
      [styles.selected]: match.path === WEBHOOK_LIST_PATH,
    }
  );

  const profileCls = classNames(
    styles['project-menu-item'],
    {
      [styles['project-menu-item-close']]: isPutAway
    },
    {
      [styles.selected]: match.path === WEBHOOK_SEAT_PATH,
    }
  );

  const gotoPage = useCallback((path: string) => {
    history.push(`/webHook/${path}`);
  }, [history]);

  return (
    <div className={sidebarCls}>
      <div className={memberCls} onClick={() => gotoPage(LIST)}>
        <PutAwayMemu
          type='WebHooks'
          isPutAway={isPutAway}
          title={intl.formatMessage({id: 'common.webhook.text'})}
        />
      </div>
      <div className={profileCls} onClick={() => gotoPage(SEAT)}>
        <PutAwayMemu
          type='attribute'
          isPutAway={isPutAway}
          title={intl.formatMessage({id: 'webhook.seat.text'})}
        />
      </div>
    </div>
	);
};

export default Sidebar;