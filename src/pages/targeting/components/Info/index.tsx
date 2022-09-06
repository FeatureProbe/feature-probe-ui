import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Grid, Form, TextAreaProps } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import CopyToClipboardPopup from 'components/CopyToClipboard';
import Button from 'components/Button';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import { IToggleInfo, IModifyInfo } from 'interfaces/targeting';
import { HeaderContainer } from 'layout/hooks';
import styles from './index.module.scss';

interface IProps {
  toggleInfo?: IToggleInfo;
  modifyInfo?: IModifyInfo;
  gotoGetStarted(): void;
}

const Info = (props: IProps) => {
  const { toggleInfo, modifyInfo, gotoGetStarted } = props;
  const [ open, saveOpen ] = useState<boolean>(false);
  const [ status, saveStatus ] = useState<string>('');
  const [ isReEdit, saveIsREdit ] = useState<boolean>(true);
  const [ reason, saveReason ] = useState<string>('');
  const [ toggleStatus, saveToggleStatus ] = useState<string>('PENDING');
  const { userInfo } = HeaderContainer.useContainer();
  const intl = useIntl();

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    trigger,
    clearErrors,
  } = useForm();

  useEffect(() => {
    if (!open) {
      clearErrors();
      saveReason('');
    }
  }, [open, clearErrors]);

  const onSubmit = useCallback(() => {
    saveOpen(false);
  }, []);

  const onCancel = useCallback(() => {
    saveOpen(false);
  }, []);

  const handleChange = useCallback((e: SyntheticEvent, detail: TextAreaProps) => {
    // @ts-ignore detail value
    saveReason(detail.value);
  }, []);

	return (
    <div className={styles.info}>
      <div className={styles['info-title']}>
        <div className={styles['info-title-left']}>
          <div className={styles['info-toggle-name']}>
            {toggleInfo?.name}
          </div>
          {
            toggleStatus === 'PENDING' && (
              <div className={`${styles['status-pending']} ${styles.status}`}>
                <Icon type='pending' customClass={styles['status-icon']} />
                <FormattedMessage id='approvals.status.todo' />
              </div>
            )
          }
          {
            (toggleStatus === 'PASS' || toggleStatus === 'JUMP') && (
              <div className={`${styles['status-publish']} ${styles.status}`}>
                <Icon type='wait' customClass={styles['status-icon']} />
                <FormattedMessage id='approvals.table.header.status.unpublished' />
              </div>
            )
          }
          {
            toggleStatus === 'REJECT' && (
              <div className={`${styles['status-reject']} ${styles.status}`}>
                <Icon type='reject' customClass={styles['status-icon']} />
                <FormattedMessage id='approvals.status.rejected' />
              </div>
            )
          }
        </div>
        <div className={styles['info-title-right']}>
          <div className={styles['connect-sdk']} onClick={gotoGetStarted}>
            <Icon type='connect-sdk' customClass={styles['icon-connect-sdk']} />
            <FormattedMessage id='toggle.connect' />
          </div>
          <div>
            <Button secondary className={styles.btn}>
              <FormattedMessage id='targeting.approval.operation.view.changes' />
            </Button>

            {
              toggleStatus === 'PENDING' && (
                <>
                  <Button 
                    secondary 
                    className={styles.btn} 
                    onClick={() => { 
                      saveOpen(true);
                      saveStatus('skip');
                    }}
                  >
                    <FormattedMessage id='targeting.approval.operation.skip.approval' />
                  </Button>
                  <Button 
                    secondary 
                    className={styles.btn}
                    onClick={() => { 
                      saveOpen(true);
                      saveStatus('withdraw');
                    }}
                  >
                    <FormattedMessage id='targeting.approval.operation.withdraw' />
                  </Button>
                  <Button 
                    secondary 
                    className={styles.btn}
                    onClick={() => { 
                      saveOpen(true);
                      saveStatus('reject');
                    }}
                  >
                    <FormattedMessage id='targeting.approval.operation.reject' />
                  </Button>
                  <Button 
                    primary 
                    className={styles.btn}
                    onClick={() => { 
                      saveOpen(true);
                      saveStatus('pass');
                    }}
                  >
                    <FormattedMessage id='targeting.approval.operation.pass' />
                  </Button>
                </>
              )
            }

            {
              (toggleStatus === 'PASS' || toggleStatus === 'JUMP') && (
                <>
                  <Button 
                    secondary 
                    className={styles.btn}
                    onClick={() => { 
                      saveOpen(true);
                      saveStatus('cancel');
                    }}
                  >
                    <FormattedMessage id='targeting.approval.operation.cancel.publish' />
                  </Button>
                  <Button primary className={styles.btn}>
                    <FormattedMessage id='targeting.approval.operation.publish' />
                  </Button>
                </>
              )
            }

            {
              toggleStatus === 'REJECT' && (
                <>
                  <Button secondary className={styles.btn}>
                    <FormattedMessage id='targeting.approval.operation.abandon' />
                  </Button>
                  <Button primary className={styles.btn}>
                    <FormattedMessage id='targeting.approval.operation.re-edit' />
                  </Button>
                </>
              )
            }
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
        footer={null}
      >
        <div>
          <div className={styles['modal-header']}>
            <span className={styles['modal-header-text']}>
              {
                status === 'pass' && (
                  <FormattedMessage id='targeting.approval.modal.pass' />
                )
              }
              {
                status === 'withdraw' && (
                  <FormattedMessage id='targeting.approval.modal.withdraw' />
                )
              }
              {
                status === 'reject' && (
                  <FormattedMessage id='targeting.approval.modal.reject' />
                )
              }
              {
                status === 'skip' && (
                  <FormattedMessage id='targeting.approval.operation.skip.approval' />
                )
              }
              {
                status === 'cancel' && (
                  <FormattedMessage id='targeting.approval.operation.cancel.publish' />
                )
              }
            </span>
            <Icon customClass={styles['modal-header-icon']} type='close' onClick={() => { saveOpen(false); }} />
          </div>
          <div className={styles['modal-content']}>
            <Form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              {
                (status === 'withdraw' || status === 'cancel') && (
                  <div className={styles['modal-continue-edit']}>
                    <FormattedMessage id='targeting.approval.modal.re-edit.text' />
                    <div className={styles['radio-group']}>
                      <Form.Radio
                        name='yes'
                        label={'是'}
                        className={styles['radio-group-item']}
                        checked={isReEdit}
                      />
                      <Form.Radio 
                        name='no'
                        label={'否'}
                        className={styles['radio-group-item']}
                        checked={!isReEdit}
                      />
                    </div>
                  </div>
                )
              }
              <Form.Field>
                <label>
                  {
                    status !== 'pass' && <span className={styles['label-required']}>*</span>
                  }
                  <FormattedMessage id='targeting.approval.modal.reason' />:
                </label>
                
                <Form.TextArea 
                  {
                    ...register('reason', { 
                      required: status !== 'pass', 
                    })
                  }
                  error={ errors.reason ? true : false }
                  value={reason} 
                  placeholder={intl.formatMessage({id: 'targeting.approval.modal.reason.placeholder'})}
                  className={styles.input}
                  onChange={async (e: SyntheticEvent, detail: TextAreaProps) => {
                    handleChange(e, detail);
                    setValue(detail.name, detail.value);
                    await trigger('reason');
                  }}
                />
              </Form.Field>
              { 
                errors.reason && (
                  <div className={styles['error-text']}>
                    <FormattedMessage id='targeting.approval.modal.reason.placeholder' />
                  </div> 
                )
              }
              <div className={styles['footer']} onClick={(e: SyntheticEvent) => { e.stopPropagation(); }}>
                <Button size='mini' className={styles['btn']} basic type='reset' onClick={onCancel}>
                  <FormattedMessage id='common.cancel.text' />
                </Button>
                <Button size='mini' type='submit' primary>
                  <FormattedMessage id='common.confirm.text' />
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Modal>
    </div>
	);
};

export default Info;