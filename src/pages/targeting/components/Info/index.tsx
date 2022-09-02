import { useState } from 'react';
import { Grid } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import dayjs from 'dayjs';
import CopyToClipboardPopup from 'components/CopyToClipboard';
import Button from 'components/Button';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import { IToggleInfo, IModifyInfo } from 'interfaces/targeting';
import styles from './index.module.scss';

interface IProps {
  toggleInfo?: IToggleInfo;
  modifyInfo?: IModifyInfo;
  gotoGetStarted(): void;
}

const Info = (props: IProps) => {
  const { toggleInfo, modifyInfo, gotoGetStarted } = props;
  const [ open, saveOpen ] = useState<boolean>(false);
  const [ status, saveStatus ] = useState<string>('www');

	return (
    <div className={styles.info}>
      <div className={styles['info-title']}>
        <div className={styles['info-title-left']}>
          <div className={styles['info-toggle-name']}>
            {toggleInfo?.name}
          </div>
          <div className={`${styles['status-pending']} ${styles.status}`}>
            <Icon type='pending' customClass={styles['status-icon']} />
            <FormattedMessage id='approvals.status.todo' />
          </div>
          <div className={`${styles['status-publish']} ${styles.status}`}>
            <Icon type='wait' customClass={styles['status-icon']} />
            <FormattedMessage id='approvals.table.header.status.unpublished' />
          </div>
          <div className={`${styles['status-reject']} ${styles.status}`}>
            <Icon type='reject' customClass={styles['status-icon']} />
            <FormattedMessage id='approvals.status.rejected' />
          </div>
        </div>
        <div className={styles['info-title-right']}>
          <div className={styles['connect-sdk']} onClick={gotoGetStarted}>
            <Icon type='connect-sdk' customClass={styles['icon-connect-sdk']} />
            <FormattedMessage id='toggle.connect' />
          </div>
          <div>
            {/* view change */}
            <Button secondary className={styles.btn}>
              <FormattedMessage id='targeting.approval.operation.view.changes' />
            </Button>

            <Button secondary className={styles.btn} onClick={() => { saveOpen(true); }}>
              <FormattedMessage id='targeting.approval.operation.skip.approval' />
            </Button>
            <Button secondary className={styles.btn}>
              <FormattedMessage id='targeting.approval.operation.withdraw' />
            </Button>
            
            <Button secondary className={styles.btn}>
              <FormattedMessage id='targeting.approval.operation.reject' />
            </Button>
            <Button primary className={styles.btn}>
              <FormattedMessage id='targeting.approval.operation.pass' />
            </Button>
            

            <Button secondary className={styles.btn}>
              <FormattedMessage id='targeting.approval.operation.cancel.publish' />
            </Button>
            <Button primary className={styles.btn}>
              <FormattedMessage id='targeting.approval.operation.publish' />
            </Button>
            
            
            <Button secondary className={styles.btn}>
              <FormattedMessage id='targeting.approval.operation.abandon' />
            </Button>
            <Button primary className={styles.btn}>
              <FormattedMessage id='targeting.approval.operation.re-edit' />
            </Button>
          </div>
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
              <div className={styles.label}>
                <FormattedMessage id='common.tags.text' />:
              </div>
              <div>
                { toggleInfo?.tags.join(',')}
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
      <Modal 
        open={open}
        width={400}
        handleCancel={() => { console.log(1); }}
        handleConfirm={() => { console.log(2); }}
      >
        <div>
          <div className={styles['modal-header']}>
            <span className={styles['modal-header-text']}>
              <FormattedMessage id='sidebar.modal.title' />
            </span>
            <Icon customClass={styles['modal-header-icon']} type='close' onClick={() => { saveOpen(false); }} />
          </div>
          <div className={styles['modal-content']}>
            <FormattedMessage id='targeting.page.leave.text' />
          </div>
        </div>
      </Modal>
    </div>
	);
};

export default Info;