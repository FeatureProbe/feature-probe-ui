import { SyntheticEvent, useCallback, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { FormattedMessage, useIntl } from 'react-intl';
import { Table, Button } from 'semantic-ui-react';
import Modal from 'components/Modal';
import Icon from 'components/Icon';
import styles from './index.module.scss';
import { ISegment, IToggleList } from 'interfaces/segment';
import { deleteSegment, getSegmentUsingToggles } from 'services/segment';
import message from 'components/MessageBox';

interface ILocationParams {
  projectKey: string;
  environmentKey: string;
}

interface IProps {
  segment: ISegment;
  fetchSegmentLists(): void
}

const ToggleItem = (props: IProps) => {
  const { segment, fetchSegmentLists } = props;
  const [ open, setOpen ] = useState<boolean>(false);
  const [ canDelete, setCanDelete ] = useState<boolean>(false);
  const { projectKey, environmentKey } = useParams<ILocationParams>();
  const intl = useIntl();
  const history = useHistory();

  const gotoEditing = useCallback((segmentKey: string) => {
    history.push(`/${projectKey}/${environmentKey}/segments/${segmentKey}/targeting`);
  }, [projectKey, environmentKey, history]);

  const checkSegmentDelete = useCallback((segmentKey: string) => {
    getSegmentUsingToggles<IToggleList>(projectKey, segmentKey, {
      pageIndex: 0,
      pageSize: 10,
    }).then((res) => {
      const { success, data } = res;
      if (success && data) {
        const { totalElements } = data;
        if (totalElements > 0) {
          setCanDelete(false);
        } else {
          setCanDelete(true);
        }
        setOpen(true);
      }
    })
  }, [projectKey]);

  const confirmDeleteSegment = useCallback((segmentKey: string) => {
    deleteSegment(projectKey, segmentKey).then(res => {
      if (res.success) {
        message.success(intl.formatMessage({id: 'segments.delete.success'}));
        fetchSegmentLists();
      } else {
        message.success(intl.formatMessage({id: 'segments.delete.error'}));
      }
      setOpen(false);
    })
  }, [intl, projectKey, fetchSegmentLists]);

	return (
    <Table.Row
      className={styles['list-item']}
      onClick={() => gotoEditing(segment.key)}
    >
      <Table.Cell>
        <div className={styles['toggle-info']}>
          <div className={styles['toggle-info-name']}>
            {segment.name}
          </div>
        </div>
        {
          segment.description && (
            <div className={styles['toggle-info-description']}>
              {segment.description}
            </div>
          )
        }
      </Table.Cell>
      <Table.Cell>
        <div className={styles['toggle-modified-by']}>
          {segment.modifiedBy}
        </div>
      </Table.Cell>
      <Table.Cell>
        <div className={styles['toggle-modified-time']}>
          <FormattedMessage id='toggles.updated.text' />
          {dayjs(segment?.modifiedTime).fromNow()}
        </div>
      </Table.Cell>
      <Table.Cell>
        <div className={styles['toggle-operation']}>
          <div className={styles['toggle-operation-item']} onClick={() => gotoEditing(segment.key)}>
            <FormattedMessage id='common.edit.text' />
          </div>
          <div 
            className={styles['toggle-operation-item']} 
            onClick={(e: SyntheticEvent) => {
              e.stopPropagation();
              checkSegmentDelete(segment?.key);
            }}
          >
            <FormattedMessage id='common.delete.text' />
          </div>
        </div>
      </Table.Cell>

      <Modal 
        open={open}
        width={400}
        handleCancel={(e: SyntheticEvent) => {
          e.stopPropagation();
          setOpen(false);
        }}
        handleConfirm={(e: SyntheticEvent) => {
          e.stopPropagation();
          setOpen(false);
        }}
        footer={null}
      >
        <div>
          <div className={styles['modal-header']}>
            <Icon customClass={styles['warning-circle']} type='warning-circle' />
            <span className={styles['modal-header-text']}>
              {
                canDelete ? <FormattedMessage id='segments.modal.delete.title' /> : <FormattedMessage id='segments.modal.cannot.delete.title' />
              }
            </span>
          </div>
          <div className={styles['modal-content']}>
            { !canDelete && <FormattedMessage id='segments.modal.cannot.delete.text' /> }
          </div>
          <div className={styles['footer']}>
            {
              canDelete ? <>
                <Button size='mini' className={styles['btn']} type='reset' basic onClick={(e: SyntheticEvent) => {
                  e.stopPropagation();
                  setOpen(false);
                }}>
                  <FormattedMessage id='common.cancel.text' />
                </Button>
                <Button size='mini' type='submit' primary onClick={(e: SyntheticEvent) => {
                  e.stopPropagation();
                  confirmDeleteSegment(segment.key);
                }}>
                  <FormattedMessage id='common.confirm.text' />
                </Button>
              </> : 
              <Button size='mini' type='submit' primary onClick={(e: SyntheticEvent) => {
                e.stopPropagation();
                setOpen(false);
              }}>
                <FormattedMessage id='common.confirm.text' />
              </Button>
            }
          </div>
        </div>
      </Modal>
    </Table.Row>
	)
}

export default ToggleItem;