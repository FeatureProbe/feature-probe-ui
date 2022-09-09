import { SyntheticEvent, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { Table, Form, TextAreaProps } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import Button from 'components/Button';
import message from 'components/MessageBox';
import styles from './index.module.scss';
import { IApproval } from 'interfaces/approval';
import { updateApprovalStatus } from 'services/approval';

interface IProps {
  type: string;
  status: string;
  approval: IApproval;
  refreshList(): void;
}

const ListItem = (props: IProps) => {
  const { type, status, approval, refreshList } = props;
  const [ operationStatus, saveOperationStatus ] = useState<string>('');
  const [ open, saveOpen ] = useState<boolean>(false);
  const [ comment, saveComment ] = useState<string>('');
  const intl = useIntl();
  const history = useHistory();

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    trigger,
  } = useForm();

  const onSubmit = useCallback(async() => {
    saveOpen(false);
    
    const res = await updateApprovalStatus(approval.projectKey, approval.environmentKey, approval.toggleKey, {
      status: operationStatus,
      comment,
    });

    if (res.success) {
      message.success(intl.formatMessage({id: 'targeting.approval.operate.success'}));
      refreshList();
    } else {
      message.success(intl.formatMessage({id: 'targeting.approval.operate.error'}));
    }
  }, [operationStatus, refreshList]);

  const onCancel = useCallback(() => {
    saveOpen(false);
  }, []);

  const handleChange = useCallback((e: SyntheticEvent, detail: TextAreaProps) => {
    // @ts-ignore detail value
    saveComment(detail.value);
  }, []);

  const gotoToggle = useCallback((projectKey, environmentKey, toggleKey) => {
    history.push(`/${projectKey}/${environmentKey}/${toggleKey}/targeting`);
  }, [history]);

	return (
    <Table.Row className={styles['list-item']}>
      <Table.Cell>
        <div className={styles['list-item-title']}>
          {approval.title}
        </div>
      </Table.Cell>
      <Table.Cell>
        <div 
          className={styles['list-item-toggle']} 
          onClick={() => {
            gotoToggle(approval.projectKey, approval.environmentKey, approval.toggleKey);
          }}
        >
          {approval.toggleName}
        </div>
      </Table.Cell>
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
            {dayjs(approval.createdTime).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        </div>
      </Table.Cell>
      {
        status === 'JUMP' && (
          <Table.Cell>
            <div>
              {approval.approvalTime && dayjs(approval.approvalTime).format('YYYY-MM-DD HH:mm:ss')}
            </div>
          </Table.Cell>
        )
      }
      {
        status === 'REVOKE' && (
          <Table.Cell>
            <div>
              {approval.approvalTime && dayjs(approval.approvalTime).format('YYYY-MM-DD HH:mm:ss')}
            </div>
          </Table.Cell>
        )
      }
      {
        (status === 'PASS' || status === 'REJECT' || status === 'RELEASE' || status === 'CANCEL') && (
          <Table.Cell>
            <div>{approval.approvedBy}</div>
            <div className={styles['list-item-time']}>
              {approval.approvalTime && dayjs(approval.approvalTime).format('YYYY-MM-DD HH:mm:ss')}
            </div>
          </Table.Cell>
        )
      }
      {
        status !== 'PENDING' && (
          <Table.Cell>
            <div className={styles['list-item-reason']}>
              {approval.comment}
            </div>
          </Table.Cell>
        )
      }
      {
        status === 'RELEASE' && (
          <Table.Cell>
            {approval.sketchTime && dayjs(approval.sketchTime).format('YYYY-MM-DD HH:mm:ss')}
          </Table.Cell>
        )
      }
      {
        status === 'CANCEL' && (
          <Table.Cell>
            {approval.sketchTime && dayjs(approval.sketchTime).format('YYYY-MM-DD HH:mm:ss')}
          </Table.Cell>
        )
      }
      {
        status === 'PENDING' && type === 'APPROVAL' && (
          <Table.Cell className={styles['list-operation']}>
            <div>
              <span 
                className={styles['list-operation-btn']} 
                onClick={(e) => { 
                  document.body.click();
                  saveOpen(true);
                  e.stopPropagation();
                  saveOperationStatus('PASS');
                }}
              >
                <FormattedMessage id='targeting.approval.operation.accept' />
              </span>
              <span 
                className={styles['list-operation-btn']} 
                onClick={(e) => { 
                  document.body.click();
                  saveOpen(true);
                  e.stopPropagation();
                  saveOperationStatus('REJECT');
                }}
              >
                <FormattedMessage id='targeting.approval.operation.decline' />
              </span>
            </div>
          </Table.Cell>
        )
      }
      <Modal 
        open={open}
        width={480}
        footer={null}
      >
        <div>
          <div className={styles['modal-header']}>
            <span className={styles['modal-header-text']}>
              { operationStatus === 'PASS' && <FormattedMessage id='targeting.approval.modal.accept' /> }
              { operationStatus === 'REJECT' && <FormattedMessage id='targeting.approval.modal.reject' /> }
            </span>
            <Icon customClass={styles['modal-header-icon']} type='close' onClick={() => { saveOpen(false); }} />
          </div>
          <div className={styles['modal-content']}>
            <Form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <Form.Field>
                <label className={styles.label}>
                  { operationStatus !== 'PASS' && <span className={styles['label-required']}>*</span> }
                  <FormattedMessage id='targeting.approval.modal.reason' />:
                </label>
                <Form.TextArea 
                  {
                    ...register('reason', { 
                      required: operationStatus !== 'PASS', 
                    })
                  }
                  error={ errors.reason ? true : false }
                  value={comment} 
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
