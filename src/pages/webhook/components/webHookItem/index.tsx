import { SyntheticEvent, useState, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';
import { Table, Popup, Checkbox } from 'semantic-ui-react';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import message from 'components/MessageBox';
import CopyToClipboardPopup from 'components/CopyToClipboard';
import TextLimit from 'components/TextLimit';
import TagsList from 'components/TagsList';
import { editToggle, getToggleInfo } from 'services/toggle';
import { IToggle } from 'interfaces/toggle';
import { IToggleInfo, IVariation } from 'interfaces/targeting';
import styles from './index.module.scss';
import { IWebHook } from 'interfaces/webhook';
import DeleteTipsModal from 'components/DeleteTipsModal';

interface ILocationParams {
  projectKey: string;
  environmentKey: string;
}

interface IProps {
  webhook: IWebHook;
  handleEdit: (key: number) => void;
}

const WebHookItem = (props: IProps) => {
  const { webhook, handleEdit } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [ deleteModalOpen, setDeleteModalOpen ] = useState<boolean>(false);
  const intl = useIntl();

  const handleMouseEnter = useCallback(() => {
    setVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <>
      <Table.Row
        className={styles['list-item']}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => ''}
      >
        <Table.Cell>
          <div className={styles['webhook-info-name']}>
            <TextLimit text={webhook.name} maxWidth={226} />
          </div>
        </Table.Cell>
        <Table.Cell>
          <div className={styles['webhook-info-description']}>
            <TextLimit text={webhook.description ? webhook.description : '-'} />
          </div>
        </Table.Cell>
        <Table.Cell>
          <div className={styles['webhook-info-status']}>
            <Checkbox checked={webhook.status} toggle />
          </div>
        </Table.Cell>
        <Table.Cell>
          <div className={styles['webhook-info-application']}>
            <TextLimit text={webhook.application} />
          </div>
        </Table.Cell>
        <Table.Cell>
          <div className={styles['webhook-info-url']}>
            <TextLimit text={webhook.url} />
          </div>
        </Table.Cell>
        <Table.Cell>
          <div className={styles['webhook-info-operate']}>
            <div className={styles['webhook-operation']}>
              <div
                className={styles['webhook-operation-item']}
                onClick={(e) => {
                  handleEdit(webhook.key);
                }}
              >
                <FormattedMessage id="common.edit.text" />
              </div>
              <div
                className={styles['webhook-operation-item']}
                onClick={(e) => {
                  setDeleteModalOpen(true);
                }}
              >
                <FormattedMessage id="common.delete.text" />
              </div>
            </div>
          </div>
        </Table.Cell>
      </Table.Row>
      <DeleteTipsModal
        open={deleteModalOpen}
        content={webhook.key}
        title={webhook.key}
        onCancel={() => {
          setDeleteModalOpen(false);
        }}
        onConfirm={() => {
          setDeleteModalOpen(false);
        }}
      />
    </>
  );
};

export default WebHookItem;
