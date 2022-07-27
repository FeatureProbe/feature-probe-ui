import { Grid } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';
import CopyToClipboardPopup from 'components/CopyToClipboard';
import TagsList  from 'components/TagsList';
import { IToggleInfo, IModifyInfo } from 'interfaces/targeting';
import styles from './index.module.scss';

interface IProps {
  toggleInfo?: IToggleInfo;
  modifyInfo?: IModifyInfo;
  gotoGetStarted(): void;
}

const Info = (props: IProps) => {
  const { toggleInfo, modifyInfo, gotoGetStarted } = props;

	return (
    <div className={styles.info}>
      <div className={styles['info-title']}>
        <div className={styles['info-toggle-name']}>
          {toggleInfo?.name}
        </div>
        <div className={styles['info-toggle-tags']}>
          <TagsList 
            tags={toggleInfo?.tags || []}
            showCount={5}
          />
        </div>
      </div>
      <div className={styles['info-content']}>
        <Grid columns='equal'>
          <Grid.Row className={styles['info-content-row']}>
            <Grid.Column>
              <div className={styles.label}>
                <FormattedMessage id='common.key.text' />:
              </div>
              <div className={`${styles['label-value-copy']} ${styles['label-value']}`}>
                <CopyToClipboardPopup text={toggleInfo?.key || ''}>
                  <span>{toggleInfo?.key ? toggleInfo.key : '-'}</span>
                </CopyToClipboardPopup>
              </div>
            </Grid.Column>
            <Grid.Column>
              <div className={styles.label}>
              <FormattedMessage id='common.type.text' />:
              </div>
              <div className={styles['label-value']}>{toggleInfo?.returnType ? toggleInfo.returnType : '-'}</div>
            </Grid.Column>
            <Grid.Column>
              <div className={styles.label}>
                <FormattedMessage id='common.description.text' />:
              </div>
              <div className={styles['label-value']}>{toggleInfo?.desc ? toggleInfo.desc : '-'}</div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className={styles['info-content-row']}>
            <Grid.Column>
              <div className={styles.label}>
                <FormattedMessage id='common.modified.by.text' />:
              </div>
              <div className={styles['label-value']}>{modifyInfo?.modifiedBy ? modifyInfo.modifiedBy : '-'}</div>
            </Grid.Column>
            <Grid.Column>
              <div className={styles.label}>
                <FormattedMessage id='common.modified.time.text' />:
              </div>
              {
                modifyInfo?.modifiedTime ? (
                  <div className={styles['label-value']}>
                    <FormattedMessage id='toggles.updated.text'/> {dayjs(modifyInfo?.modifiedTime).fromNow()}
                  </div>
                ) : <>-</>
              }
            </Grid.Column>
            <Grid.Column>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
      <div className={styles['link-sdk']} onClick={gotoGetStarted}>
        <FormattedMessage id='toggle.connect' />
      </div>
    </div>
	)
}

export default Info;