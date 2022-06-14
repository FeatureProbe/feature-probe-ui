import { SyntheticEvent } from 'react';
import { Table, Pagination, PaginationProps } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import Modal from 'components/Modal';
import Icon from 'components/Icon';
import { IToggle } from 'interfaces/segment';

import styles from './index.module.scss';

interface IPagination {
  pageIndex: number;
  totalPages: number;
}

interface IProps {
  open: boolean;
  total: number;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleList: IToggle[];
  pagination: IPagination;
  handlePageChange(e: SyntheticEvent, data: PaginationProps): void;
  confirmEditSegment(): void;
}

const ConfirmModal = (props: IProps) => {
  const { open, total, toggleList, pagination, setOpen, handlePageChange, confirmEditSegment } = props;
  const intl = useIntl();

	return (
    <Modal 
      open={open}
      width={560}
      handleCancel={(e: SyntheticEvent) => {
        e.stopPropagation();
        setOpen(false);
      }}
      handleConfirm={(e: SyntheticEvent) => {
        e.stopPropagation();
        setOpen(false);
        confirmEditSegment();
      }}
    >
      <div>
        <div className={styles['modal-header']}>
          <span>
            <FormattedMessage id='segments.modal.delete.header' />
          </span>
          <Icon customClass={styles['modal-header-icon']} type='close' onClick={(e: SyntheticEvent) => {
            e.stopPropagation();
            setOpen(false);
          }} />
        </div>
        <div className={styles['modal-tips']}>
          <Icon type='info-circle' customClass={styles['modal-info-circle']} />
          {
            intl.formatMessage({
              id: 'segments.modal.delete.tips',
            }, {
              count: total
            })
          }
        </div>
        <div className={styles['modal-content']}>
          <Table basic='very' unstackable>
            <Table.Header className={styles['table-header']}>
              <Table.Row>
                <Table.HeaderCell className={styles['column-toggle']}>
                  <FormattedMessage id='common.toggle.text' />
                </Table.HeaderCell>
                <Table.HeaderCell className={styles['column-environment']}>
                  <FormattedMessage id='common.environment.text' />
                </Table.HeaderCell>
                <Table.HeaderCell className={styles['column-status']}>
                  <FormattedMessage id='toggles.table.status' />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {
                toggleList?.map((toggle: IToggle) => {
                  return (
                    <Table.Row className={styles['list-item']}>
                      <Table.Cell>
                        <div className={styles['toggle-info']}>
                          <div className={styles['toggle-info-name']}>
                            {toggle?.name}
                          </div>
                        </div>
                        {
                          toggle?.description && (
                            <div className={styles['toggle-info-description']}>
                              {toggle?.description}
                            </div>
                          )
                        }
                      </Table.Cell>
                      <Table.Cell>
                        <div className={styles['toggle-modified']}>
                          {toggle?.environment}
                          </div>
                      </Table.Cell>
                      <Table.Cell>
                        {
                          toggle?.disabled ? (
                            <div className={styles['toggle-status']}>
                              <div className={`${styles['toggle-status-icon']} ${styles['toggle-status-icon-disabled']}`}></div>
                              <div className={`${styles['toggle-status-text']} ${styles['toggle-status-text-disabled']}`}>
                                <FormattedMessage id='common.disabled.text' />
                              </div>
                            </div>
                          ) : (
                            <div className={styles['toggle-status']}>
                              <div className={`${styles['toggle-status-icon']} ${styles['toggle-status-icon-enabled']}`}></div>
                              <div className={`${styles['toggle-status-text']} ${styles['toggle-status-text-enabled']}`}>
                                <FormattedMessage id='common.enabled.text' />
                              </div>
                            </div>
                          ) 
                        }
                      </Table.Cell>
                    </Table.Row>
                  )
                })
              }
            </Table.Body>
          </Table>
          {
            pagination.totalPages > 1 && (
              <div className={styles.pagination}>
                 <Pagination 
                  activePage={pagination.pageIndex} 
                  totalPages={pagination.totalPages} 
                  onPageChange={handlePageChange}
                  firstItem={null}
                  lastItem={null}
                  prevItem={{
                    content: (<Icon type='angle-left' />)
                  }}
                  nextItem={{
                    content: (<Icon type='angle-right' />)
                  }}
                />
              </div>
            )
          }
        </div>
      </div>
    </Modal>
	)
}

export default ConfirmModal;