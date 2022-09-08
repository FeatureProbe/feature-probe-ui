import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Grid, Form, TextAreaProps } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { useForm } from 'react-hook-form';
import JSONbig from 'json-bigint';
import { createPatch } from 'diff';
import { html } from 'diff2html/lib/diff2html';
import CopyToClipboardPopup from 'components/CopyToClipboard';
import Button from 'components/Button';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import message from 'components/MessageBox';
import { HeaderContainer } from 'layout/hooks';
import { updateApprovalStatus, publishTargetingDraft, cancelTargetingDraft } from 'services/approval';
import { getTargeting, getTargetingDiff } from 'services/toggle';
import { IToggleInfo, IModifyInfo, IApprovalInfo, ITargetingDiff, ITargeting, IContent } from 'interfaces/targeting';
import { IRouterParams } from 'interfaces/project';
import styles from './index.module.scss';

interface IProps {
  toggleInfo?: IToggleInfo;
  modifyInfo?: IModifyInfo;
  approvalInfo?: IApprovalInfo;
  gotoGetStarted(): void;
  initTargeting(): void;
  saveApprovalInfo(approvalInfo: IApprovalInfo): void;
  saveInitTargeting(targeting: ITargeting): void;
}

const Info = (props: IProps) => {
  const { toggleInfo, modifyInfo, approvalInfo, gotoGetStarted, initTargeting, saveApprovalInfo, saveInitTargeting } = props;
  const [ enableApproval, saveEnableApproval ] = useState<boolean>(false);
  const [ open, saveOpen ] = useState<boolean>(false);
  const [ diffOpen, saveDiffOpen ] = useState<boolean>(false);
  const [ status, saveStatus ] = useState<string>('');
  const [ isReEdit, saveIsREdit ] = useState<boolean>(true);
  const [ comment, saveComment ] = useState<string>('');
  const [ toggleStatus, saveToggleStatus ] = useState<string>(approvalInfo?.status || '');
  const [ targetingDiff, saveTargetingDiff ] = useState<ITargetingDiff>();
  const [ diffContent, setDiffContent ] = useState<string>('');

  const { userInfo } = HeaderContainer.useContainer();
  const { projectKey, environmentKey, toggleKey } = useParams<IRouterParams>();
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
    getTargetingDiff<ITargetingDiff>(projectKey, environmentKey, toggleKey).then(res => {
      if (res.success) {
        saveTargetingDiff(res.data);
      }
    });
  }, [projectKey, environmentKey, toggleKey]);

  useEffect(() => {
    if (approvalInfo?.status) {
      saveToggleStatus(approvalInfo.status);
      saveEnableApproval(approvalInfo.enableApproval);
    }
  }, [approvalInfo]);

  useEffect(() => {
    if (!open) {
      clearErrors();
      saveComment('');
    }
  }, [open, clearErrors]);

  const onSubmit = useCallback(async () => {
    saveOpen(false);

    if (status === 'CANCEL') {
      const res = await cancelTargetingDraft(projectKey, environmentKey, toggleKey);
      if (res.success) {
        message.success(intl.formatMessage({id: 'targeting.approval.cancel.success'}));
        initTargeting();
      } else {
        message.success(intl.formatMessage({id: 'targeting.approval.cancel.error'}));
      }
    } else {
      const res = await updateApprovalStatus(projectKey, environmentKey, toggleKey, {
        status,
        comment,
      });

      if (res.success) {
        message.success(intl.formatMessage({id: 'targeting.approval.operate.success'}));
        if (status === 'REVOKE' && isReEdit) {
          if (approvalInfo) {
            saveApprovalInfo({
              ...approvalInfo,
              status: 'RELEASE',
            });
          }
        } else {
          initTargeting();
        }
      } else {
        message.success(intl.formatMessage({id: 'targeting.approval.operate.error'}));
      }
    }
  }, [status, comment, approvalInfo, projectKey, environmentKey, toggleKey]);

  const handleAbandon = useCallback(async () => {
    const res = await cancelTargetingDraft(projectKey, environmentKey, toggleKey);
    if (res.success) {
      initTargeting();
      message.success(intl.formatMessage({id: 'targeting.approval.operate.success'}));
    } else {
      message.success(intl.formatMessage({id: 'targeting.approval.operate.error'}));
    }
  }, [projectKey, environmentKey, toggleKey]);

  const handleReEdit = useCallback(async () => {
    const result = await cancelTargetingDraft(projectKey, environmentKey, toggleKey);
    if (result.success) {
      const res = await getTargeting<IContent>(projectKey, environmentKey, toggleKey);
      const { data, success } = res;
      if (success && data) {
        const { content, disabled } = data;
        saveInitTargeting(cloneDeep({
          disabled,
          content,
        }));
      }
      if (approvalInfo) {
          saveApprovalInfo({
          ...approvalInfo,
          status: 'RELEASE',
        });
      }
    }
    
  }, [projectKey, environmentKey, toggleKey, approvalInfo]);

  const handlePublish = useCallback(() => {
    publishTargetingDraft(projectKey, environmentKey, toggleKey).then(res => {
      if (res.success) {
        message.success(intl.formatMessage({id: 'targeting.publish.success.text'}));
        initTargeting();
      } else {
        message.success(intl.formatMessage({id: 'targeting.publish.error.text'}));
      }
    });
  }, [projectKey, environmentKey, toggleKey]);

  const handleShowDiff = useCallback(() => {
    if (targetingDiff) {
      const { currentContent, oldContent, oldDisabled, currentDisabled } = targetingDiff;
      const before = JSONbig.stringify({
        disabled: oldDisabled,
        content: oldContent
      }, null, 2);
      const after = JSONbig.stringify({
        disabled: currentDisabled,
        content: currentContent
      }, null, 2);
      const result = createPatch('content', before.replace(/\\n/g, '\n'), after.replace(/\\n/g, '\n'));

      const content = html(result, {
        matching: 'lines',
        outputFormat: 'side-by-side',
        diffStyle: 'word',
        drawFileList: false,
      });
      setDiffContent(content);
      saveDiffOpen(true);
    }
  }, [targetingDiff]);

  const handleChangeComment = useCallback((e: SyntheticEvent, detail: TextAreaProps) => {
    // @ts-ignore detail value
    saveComment(detail.value);
  }, []);

	return (
    <div className={styles.info}>
      <div className={styles['info-title']}>
        <div className={styles['info-title-left']}>
          <div className={styles['info-toggle-name']}>
            {toggleInfo?.name}
          </div>
          {
            enableApproval && toggleStatus === 'PENDING' && (
              <div className={`${styles['status-pending']} ${styles.status}`}>
                <Icon type='pending' customClass={styles['status-icon']} />
                <FormattedMessage id='approvals.status.todo' />
              </div>
            )
          }
          {
            (enableApproval && toggleStatus === 'PASS' || toggleStatus === 'JUMP') && (
              <div className={`${styles['status-publish']} ${styles.status}`}>
                <Icon type='wait' customClass={styles['status-icon']} />
                <FormattedMessage id='approvals.status.unpublished' />
              </div>
            )
          }
          {
            enableApproval && toggleStatus === 'REJECT' && (
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
            {
              enableApproval && toggleStatus !== 'RELEASE' && (
                <Button secondary className={styles.btn} onClick={handleShowDiff}>
                  <FormattedMessage id='targeting.approval.operation.view.changes' />
                </Button>
              )
            }

            {
              enableApproval && toggleStatus === 'PENDING' && (
                <>
                  {
                    approvalInfo?.submitBy === userInfo.account && (
                      <>
                        <Button 
                          secondary 
                          className={styles.btn} 
                          onClick={() => { 
                            saveOpen(true);
                            saveStatus('JUMP');
                          }}
                        >
                          <FormattedMessage id='targeting.approval.operation.skip.approval' />
                        </Button>
                        <Button 
                          secondary 
                          className={styles['dangerous-btn']}
                          onClick={() => { 
                            saveOpen(true);
                            saveStatus('REVOKE');
                          }}
                        >
                          <FormattedMessage id='targeting.approval.operation.withdraw' />
                        </Button>
                      </>
                    )
                  }
                  
                  {
                    approvalInfo?.reviewers?.includes(userInfo.account) && (
                      <>
                        <Button 
                          secondary 
                          className={styles.btn}
                          onClick={() => { 
                            saveOpen(true);
                            saveStatus('REJECT');
                          }}
                        >
                          <FormattedMessage id='targeting.approval.operation.reject' />
                        </Button>
                        <Button 
                          primary 
                          className={styles.btn}
                          onClick={() => { 
                            saveOpen(true);
                            saveStatus('PASS');
                          }}
                        >
                          <FormattedMessage id='targeting.approval.operation.pass' />
                        </Button>
                      </>
                    )
                  }
                </>
              )
            }

            {
              (enableApproval && (toggleStatus === 'PASS' || toggleStatus === 'JUMP')) && (
                <>
                  <Button 
                    secondary 
                    className={styles.btn}
                    onClick={() => { 
                      saveOpen(true);
                      saveStatus('CANCEL');
                    }}
                  >
                    <FormattedMessage id='targeting.approval.operation.cancel.publish' />
                  </Button>
                  <Button primary className={styles.btn} onClick={handlePublish}>
                    <FormattedMessage id='targeting.approval.operation.publish' />
                  </Button>
                </>
              )
            }

            {
              enableApproval && toggleStatus === 'REJECT' && (
                <>
                  <Button secondary className={styles['dangerous-btn']} onClick={() => { handleAbandon(); }}>
                    <FormattedMessage id='targeting.approval.operation.abandon' />
                  </Button>
                  <Button primary className={styles.btn} onClick={() => { handleReEdit(); }}>
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
                { toggleInfo?.tags.join(',') || '-'}
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
      <Modal 
        open={open}
        width={480}
        footer={null}
      >
        <div>
          <div className={styles['modal-header']}>
            <span className={styles['modal-header-text']}>
              { status === 'PASS' && <FormattedMessage id='targeting.approval.modal.pass' /> }
              { status === 'REVOKE' && <FormattedMessage id='targeting.approval.modal.withdraw' /> }
              { status === 'REJECT' && <FormattedMessage id='targeting.approval.modal.reject' /> }
              { status === 'JUMP' && <FormattedMessage id='targeting.approval.operation.skip.approval' /> }
              { status === 'CANCEL' && <FormattedMessage id='targeting.approval.operation.cancel.publish' /> }
            </span>
            <Icon customClass={styles['modal-header-icon']} type='close' onClick={() => { saveOpen(false); }} />
          </div>
          <div className={styles['modal-content']}>
            <Form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              {
                (status === 'REVOKE' || status === 'CANCEL') && (
                  <div className={styles['modal-continue-edit']}>
                    <FormattedMessage id='targeting.approval.modal.re-edit.text' />
                    <div className={styles['radio-group']}>
                      <Form.Radio
                        name='yes'
                        label={intl.formatMessage({id: 'common.yes.text'})}
                        className={styles['radio-group-item']}
                        checked={isReEdit}
                        onChange={() => { saveIsREdit(!isReEdit); }}
                      />
                      <Form.Radio 
                        name='no'
                        label={intl.formatMessage({id: 'common.no.text'})}
                        className={styles['radio-group-item']}
                        checked={!isReEdit}
                        onChange={() => { saveIsREdit(!isReEdit); }}
                      />
                    </div>
                  </div>
                )
              }
              <Form.Field>
                <label>
                  { status !== 'PASS' && <span className={styles['label-required']}>*</span> }
                  <FormattedMessage id='targeting.approval.modal.reason' />:
                </label>
                
                <Form.TextArea 
                  {
                    ...register('reason', { 
                      required: status !== 'PASS', 
                    })
                  }
                  error={ errors.reason ? true : false }
                  value={comment} 
                  placeholder={intl.formatMessage({id: 'targeting.approval.modal.reason.placeholder'})}
                  className={styles.input}
                  onChange={async (e: SyntheticEvent, detail: TextAreaProps) => {
                    handleChangeComment(e, detail);
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
                <Button size='mini' basic type='reset' onClick={() => { saveOpen(false); }}>
                  <FormattedMessage id='common.cancel.text' />
                </Button>
                <Button size='mini' className={styles['btn']} type='submit' primary>
                  <FormattedMessage id='common.confirm.text' />
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Modal>
      <Modal 
        open={diffOpen}
        width={800}
        handleCancel={() => { saveDiffOpen(false); }}
        handleConfirm={() => { saveDiffOpen(false); }}
      >
        <div>
          <div className={styles['diff-modal-header']}>
            <span className={styles['diff-modal-header-text']}>
              Diff
            </span>
            <Icon customClass={styles['diff-modal-close-icon']} type='close' onClick={() => { saveDiffOpen(false); }} />
          </div>
          <div className={styles['diff-modal-content']}>
            <div className="diff" dangerouslySetInnerHTML={{ __html: diffContent }} />
          </div>
        </div>
      </Modal>
    </div>
	);
};

export default Info;