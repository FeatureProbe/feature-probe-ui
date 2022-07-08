
import { FormattedMessage } from 'react-intl';
import InfiniteScroll from 'react-infinite-scroll-component';
import dayjs from 'dayjs';
import Icon from 'components/Icon';
import styles from './index.module.scss';
import { IVersion } from 'interfaces/targeting';

interface IProps {
  versions: IVersion[];
  total: number;
  loadMore(): void;
}

const History = (props: IProps) => {
  const { versions, total, loadMore } = props;

  return (
    <div className={styles.history}>
      <div className={styles['history-title']}>
        <span>
          <FormattedMessage id='common.history.text' />
        </span>
        <Icon customClass={styles['history-title-icon']} type='close' onClick={() => {}} />
      </div>
      <div className={styles.lists}>
        <InfiniteScroll
          dataLength={versions.length}
          height={410}
          next={loadMore}
          hasMore={total !== versions.length}
          loader={
            <div>Loading...</div>
          }
        >
          {
            versions.map((item, index) => (
              <div key={index} className={styles.version} onClick={(e: any) => {
                e.stopPropagation()
              }}>
                <div className={styles['version-left']}>
                  <div className={styles.circle}></div>
                </div>
                <div className={styles['version-right']}>
                  <div className={styles.title}>Version: { item.version }</div>
                  <div className={styles.modifyBy}>
                    <FormattedMessage id='common.modified.by.text' />：
                    { item.createdBy }
                  </div>
                  <div className={styles.modifyTime}>
                    <FormattedMessage id='common.modified.time.text' />：
                    { dayjs(item?.createdTime).fromNow() }  
                  </div>
                  {
                    item.comment && <div className={styles.modifyTime}>
                      Comment： 
                      { item.comment }
                    </div>
                  }
                </div>
              </div>
            ))
          }
        </InfiniteScroll>
      </div>
    </div>
  )
};

export default History;