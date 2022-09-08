import classNames from 'classnames';
import { IApprovalList } from 'interfaces/approval';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';
import { getApprovalList } from 'services/approval';
import Lists from './components/Lists';
import styles from './index.module.scss';

const LIST = '/approvals/list';
const MINE = '/approvals/mine';

const Approvals = () => {
  const [ selectedNav, saveSelectedNav ] = useState<string>(LIST);
  const [ count, saveCount ] = useState<number>(0);
  const location = useLocation();
  const history = useHistory();
  
  const listCls = classNames(
    styles['navs-item'],
    {
      [styles['navs-item-selected']]: selectedNav === LIST
    }
  );

  const mineCls = classNames(
    styles['navs-item'],
    {
      [styles['navs-item-selected']]: selectedNav === MINE
    }
  );

  useEffect(() => {
    if (location.pathname === LIST) {
      saveSelectedNav(LIST);
    }
    else if (location.pathname === MINE) {
      saveSelectedNav(MINE);
    }
  }, [location.pathname]);

  useEffect(() => {
    getApprovalList<IApprovalList>({
			pageIndex: 0,
			status: 'PENDING',
			type: 'APPROVAL',
			keyword: '',
		}).then(res => {
			const { success, data } = res;
			if (success && data) {
				const { totalElements } = data;
				saveCount(totalElements);
      }
		});
  }, []);

  return (
    <div className={styles.approvals}>
      <div className={styles.navs}>
        <div 
          className={listCls} 
          onClick={() => { 
            history.push(LIST);
          }}
        >
          <FormattedMessage id='approvals.lists' />
          { count !== 0 && <span className={styles.count}>{count > 99 ? '99+' : count}</span> }
        </div>
        <div 
          className={mineCls} 
          onClick={() => { 
            history.push(MINE);
          }}
        >
          <FormattedMessage id='approvals.application.lists' />
        </div>
      </div>
      <Lists />
    </div>
  );
};

export default Approvals;
