import { SyntheticEvent, useState, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { Table, Popup, Form, TextAreaProps } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import Button from 'components/Button';
import message from 'components/MessageBox';
import styles from './index.module.scss';
import { IApproval } from 'interfaces/approval';

interface ILocationParams {
  projectKey: string;
  environmentKey: string;
}

interface IProps {
  type: string;
  status: string;
  approval: IApproval
}

const ListItem = (props: IProps) => {
  const { type, status, approval } = props;
  const [ toggleStatus, saveToggleStatus ] = useState<number>(2);
  const [ open, saveOpen ] = useState<boolean>(false);
  const [ reason, saveReason ] = useState<string>('');
  const intl = useIntl();
  const history = useHistory();

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    trigger,
  } = useForm();

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

  const gotoToggle = useCallback((projectKey, environmentKey, toggleKey) => {
    history.push(`/${projectKey}/${environmentKey}/${toggleKey}/targeting`);
  }, [history]);

	return (
    <Table.Row
      className={styles['list-item']}
    >
      <Table.Cell>
        <div className={styles['list-item-title']}>
          {approval.title}
        </div>
      </Table.Cell>
      <Table.Cell>
        <div className={styles['list-item-toggle']} onClick={() => {
          gotoToggle(approval.projectKey, approval.environmentKey, approval.toggleKey);
        }}>
          {approval.toggleName}
        </div>
      </Table.Cell>
      {
        (status === 'PASS' || status === 'JUMP') && (
          <Table.Cell>
            {
              toggleStatus === 0 && (
                <div className={styles['list-status']}>
                  <span className={`${styles['list-status-icon']} ${styles['list-status-icon-published']}`}></span>
                  <span>已发布</span>
                </div>
              )
            }
            {
              toggleStatus === 1 && (
                <div className={styles['list-status']}>
                  <span className={`${styles['list-status-icon']} ${styles['list-status-icon-unpublished']}`}></span>
                  <span>未发布</span>
                </div>
              )
            }
            {
              toggleStatus === 2 && (
                <div className={styles['list-status']}>
                  <span className={`${styles['list-status-icon']} ${styles['list-status-icon-canceled']}`}></span>
                  <span className={styles['list-status-canceled-text']}>已取消</span>
                  <Popup
                    inverted
                    trigger={
                      <Icon customClass={styles['icon-info']} type='info' />
                    }
                    content={'22222'}
                    position='top center'
                    className={styles.popup}
                  />
                </div>
              )
            }
          </Table.Cell>
        )
      }
      <Table.Cell>
        <div className={styles['list-item-project']}>
          {approval.projectName}
        </div>
      </Table.Cell>
      <Table.Cell>
        <div>
          {approval.environmentName}
        </div>
      </Table.Cell>
      <Table.Cell>
        <div>
          <div>{approval.submitBy}</div>
          <div className={styles['list-item-time']}>
            {dayjs(approval.createdTime).fromNow()}
          </div>
        </div>
      </Table.Cell>
      {
        status === 'JUMP' && (
          <Table.Cell>
            <div>跳过时间</div>
          </Table.Cell>
        )
      }
      {
        status === 'JUMP' && (
          <Table.Cell >
            <div className={styles['list-item-reason']}>
              跳过理由跳过理由跳过理由跳过理由跳过理由跳过理由跳过理由
            </div>
          </Table.Cell>
        )
      }
      {
        (status === 'PASS' || status === 'REJECT') && (
          <Table.Cell>
            <div>审批人</div>
            <div className={styles['list-item-time']}>审批时间</div>
          </Table.Cell>
        )
      }
      {
        status === 'PASS' && (
          <Table.Cell>
            <div className={styles['list-item-reason']}>
              通过理由通过理由通过理由通过理由通过理由通过理由通过理由
            </div>
          </Table.Cell>
        )
      }
      {
        status === 'REJECT' && (
          <Table.Cell>
            <div className={styles['list-item-reason']}>
              拒绝理由拒绝理由拒绝理由拒绝理由拒绝理由拒绝理由拒绝理由
            </div>
          </Table.Cell>
        )
      }
      {
        status === 'REVOKE' && (
          <Table.Cell>
            撤回时间
          </Table.Cell>
        )
      }
      {
        status === 'REVOKE' && (
          <Table.Cell>
            <div className={styles['list-item-reason']}>
              撤回理由撤回理由撤回理由撤回理由撤回理由撤回理由撤回理由撤回理由
            </div>
          </Table.Cell>
        )
      }
      {
        (status === 'PASS' || status === 'JUMP') && (
          <Table.Cell>
            发布时间
          </Table.Cell>
        )
      }
      {
        status === 'PENDING' && (
          <Table.Cell className={styles['list-operation']}>
            <div>
              {
                type === 'APPLY' && (
                  <span 
                    className={styles['list-operation-btn']} 
                    onClick={(e) => { 
                      document.body.click();
                      e.stopPropagation();
                      saveOpen(true);
                    }}
                  >
                    撤回
                  </span>
                )
              }
              {
                type === 'APPROVAL' && (
                  <span 
                    className={styles['list-operation-btn']} 
                    onClick={(e) => { 
                      document.body.click();
                      e.stopPropagation();
                      saveOpen(true);
                    }}
                  >
                    通过
                  </span>
                )
              }
              {
                type === 'APPROVAL' && (
                  <span 
                    className={styles['list-operation-btn']} 
                    onClick={(e) => { 
                      document.body.click();
                      e.stopPropagation();
                      saveOpen(true);
                    }}
                  >
                    拒绝
                  </span>
                )
              }
            </div>
          </Table.Cell>
        )
      }

      <Modal 
        open={open}
        width={400}
        footer={null}
      >
        <div>
          <div className={styles['modal-header']}>
            <span className={styles['modal-header-text']}>
              {
                status === 'PASS' && (
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
    </Table.Row>
	);
};

export default ListItem;
