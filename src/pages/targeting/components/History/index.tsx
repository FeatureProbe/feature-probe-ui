
import { SyntheticEvent } from 'react';
import { FormattedMessage } from 'react-intl';
import InfiniteScroll from 'react-infinite-scroll-component';
import dayjs from 'dayjs';
import Icon from 'components/Icon';
import styles from './index.module.scss';
import { IVersion } from 'interfaces/targeting';
import classNames from 'classnames';

interface IProps {
  versions: IVersion[];
  hasMore: boolean;
  selectedVersion: number;
  loadMore(): void;
  viewHistory(version: IVersion): void;
  quiteViewHistory(): void;
}

const History = (props: IProps) => {
  const { versions, hasMore, selectedVersion, loadMore, viewHistory, quiteViewHistory } = props;
  const height = Math.min(85 * versions.length, 410);

  return (
    <div className={styles.history}>
      <div className={styles['history-title']}>
        <span>
          <FormattedMessage id='common.history.text' />
        </span>
        <Icon customClass={styles['history-title-icon']} type='close' onClick={quiteViewHistory} />
      </div>
      <div className={styles.lists} id="scrollableDiv" style={{height: height}}>
        <InfiniteScroll
          dataLength={versions.length}
          next={loadMore}
          hasMore={hasMore}
          scrollableTarget="scrollableDiv"
          loader={
            <div className={styles.loading}>
              <FormattedMessage id='common.loading.text' />
            </div>
          }
        >
          {
            versions.length > 0 && versions.map((item, index) => {
              const clsRight = classNames(
                styles['version-right'],
                {
                  [styles['version-right-selected']]: item?.version === Number(selectedVersion)
                }
              );
              const clsCircle = classNames(
                styles.circle,
                {
                  [styles['circle-selected']]: item?.version === Number(selectedVersion)
                }
              );

              return (
                <div 
                  key={index} 
                  className={styles.version} 
                  onClick={(e: SyntheticEvent) => {
                    e.stopPropagation();
                    viewHistory(item);
                  }}
                >
                  <div className={styles['version-left']}>
                    <div className={clsCircle}></div>
                  </div>
                  <div className={clsRight}>
                    <div className={styles.title}>
                      <FormattedMessage id='common.versions.text' />:&nbsp;
                      { item.version }
                    </div>
                    <div className={styles.modifyBy}>
                      <FormattedMessage id='common.modified.by.text' />:&nbsp;
                      { item.createdBy }
                    </div>
                    <div className={styles.modifyTime}>
                      <FormattedMessage id='common.modified.time.text' />:&nbsp;
                      { dayjs(item?.createdTime).fromNow() }  
                    </div>
                    {
                      item.comment && <div className={styles.modifyTime}>
                        <FormattedMessage id='targeting.publish.modal.comment' />&nbsp;
                        { item.comment }
                      </div>
                    }
                  </div>
                </div>
              )
            })
          }
          {
            versions.length === 0 && (
              <div className={styles.loading}>
                <FormattedMessage id='common.nodata.text' />
              </div>
            )
          }
        </InfiniteScroll>
      </div>
    </div>
  )
};

export default History;