import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Form, Table, Pagination, InputOnChangeData, PaginationProps, Dimmer, Loader } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import Icon from 'components/Icon';
import message from 'components/MessageBox';
import ListItem from '../ListItem';
import { IApproval, IApprovalList } from 'interfaces/approval';
import { getApprovalList } from 'services/approval';
import styles from './index.module.scss';
import { debounce } from 'lodash';
import { HeaderContainer } from 'layout/hooks';

const LIST = '/approvals/list';
const MINE = '/approvals/mine';

const Lists = () => {
	const intl = useIntl();
	const [ status, saveStatus ] = useState<string>('PENDING');
	const [ type, saveType ] = useState<string>('APPROVAL');
	const [ keyword, saveKeyword ] = useState<string>('');
  const [ isLoading, saveIsLoading ] = useState<boolean>(true);
  const [ pageIndex, savePageIndex ] = useState<number>(0);
  const [ pagination, setPagination ] = useState({
		pageIndex: 1,
		totalPages: 5,
	});
	const [ approvalList, saveApprovalList ] = useState<IApproval[]>([]);
	const [ total, setTotal ] = useState<number>(0);
  const { userInfo, saveUserInfo } = HeaderContainer.useContainer();

	useEffect(() => {
		if (location.pathname === LIST) {
			saveType('APPROVAL');
		} else if (location.pathname === MINE) {
			saveType('APPLY');
		}
		saveStatus('PENDING');
    savePageIndex(0);
	}, [location.pathname]);

	const init = useCallback(() => {
    saveIsLoading(true);
		getApprovalList<IApprovalList>({
			pageIndex,
      pageSize: 10,
			status,
			type,
			keyword,
		}).then(res => {
      saveIsLoading(false);
			const { success, data } = res;
			if (success && data) {
				const { content, pageable, totalPages, totalElements } = data;
				saveApprovalList(content);
				setPagination({
					pageIndex: pageable.pageNumber + 1,
					totalPages,
				});
				setTotal(totalElements);

        if (status === 'PENDING' && type === 'APPROVAL') {
          saveUserInfo({
            ...userInfo,
            approvalCount: totalElements
          });
        }
			}
      else {
        message.error(intl.formatMessage({id: 'approvals.lists.error'}));
      }
		});
  }, [type, status, keyword, pageIndex]);

  useEffect(() => {
    init();
  }, [init]);

  const handleSearch = debounce(useCallback((e: SyntheticEvent, detail: InputOnChangeData) => {
    saveKeyword(detail.value);
  }, []), 300);

  const handlePageChange = useCallback((e: SyntheticEvent, data: PaginationProps) => {
    savePageIndex(Number(data.activePage) - 1);
  }, []);

  const refreshList = useCallback(() => {
    init();
  }, []);

  return (
    <div className={styles.lists}>
      <div className={styles.header}>
        <div className={styles.tabs}>
          <div 
            className={`${styles['tabs-item']} ${status === 'PENDING' && styles['tabs-item-selected']}`} 
            onClick={() => { 
              saveStatus('PENDING');
              savePageIndex(0);
            }}
          >
              <FormattedMessage id='approvals.status.pending' />
          </div>
          <div 
            className={`${styles['tabs-item']} ${status === 'PASS' && styles['tabs-item-selected']}`} 
            onClick={() => { 
              saveStatus('PASS');
              savePageIndex(0);
            }}
          >
            <FormattedMessage id='approvals.status.unpublished' />
          </div>
          <div 
            className={`${styles['tabs-item']} ${status === 'REJECT' && styles['tabs-item-selected']}`} 
            onClick={() => { 
              saveStatus('REJECT');
            }}
          >
            <FormattedMessage id='approvals.status.declined' />
          </div>
          <div 
            className={`${styles['tabs-item']} ${status === 'JUMP' && styles['tabs-item-selected']}`} 
            onClick={() => { 
              saveStatus('JUMP');
              savePageIndex(0);
            }}
          >
            <FormattedMessage id='approvals.status.skipped' />
          </div>
          <div 
            className={`${styles['tabs-item']} ${status === 'REVOKE' && styles['tabs-item-selected']}`} 
            onClick={() => { 
              saveStatus('REVOKE');
              savePageIndex(0);
            }}
            >
              <FormattedMessage id='approvals.status.withdrawn' />
          </div>
          {
            type === 'APPLY' && (
              <div 
                className={`${styles['tabs-item']} ${status === 'RELEASE' && styles['tabs-item-selected']}`} 
                onClick={() => { 
                  saveStatus('RELEASE');
                  savePageIndex(0);
                }}
              >
                <FormattedMessage id='approvals.status.published' />
              </div>
            )
          }
          {
            type === 'APPLY' && (
              <div 
                className={`${styles['tabs-item']} ${status === 'CANCEL' && styles['tabs-item-selected']}`} 
                onClick={() => { 
                  saveStatus('CANCEL');
                }}
              >
                <FormattedMessage id='approvals.status.cancelled' />
              </div>
            )
          }
        </div>
        <Form className={styles.form}>
          <Form.Field className={styles['keywords-field']}>
            <Form.Input 
              placeholder={intl.formatMessage({id: 'approvals.search.placeholder'})} 
              icon={<Icon customClass={styles['icon-search']} type='search' />}
              onChange={handleSearch}
            />
          </Form.Field>
        </Form>
      </div>
      {
        isLoading ? (
          <div className={styles.content}>
            <Dimmer active inverted>
              <Loader size='small'>
                <FormattedMessage id='common.loading.text' />
              </Loader>
            </Dimmer>
          </div>
        ) : (
          <div className={styles.content}>
            <Table basic='very' unstackable>
              <Table.Header className={styles['table-header']}>
                <Table.Row>
                  <Table.HeaderCell className={styles['column-title']}>
                    <FormattedMessage id='targeting.publish.modal.comment' />
                  </Table.HeaderCell>
                  <Table.HeaderCell className={styles['column-toggle']}>
                    <FormattedMessage id='common.toggle.text' />
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <FormattedMessage id='common.project.text' />
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <FormattedMessage id='common.environment.text' />
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <FormattedMessage id='approvals.table.header.request' />
                  </Table.HeaderCell>
                  {
                    status === 'JUMP' && (
                      <Table.HeaderCell>
                        <FormattedMessage id='approvals.table.header.skipped.time' />
                      </Table.HeaderCell>
                    )
                  }
                  {
                    status === 'REVOKE' && (
                      <Table.HeaderCell>
                        <FormattedMessage id='approvals.table.header.withdrawn.time' />
                      </Table.HeaderCell>
                    )
                  }
                  {
                    (status === 'PASS' || status === 'REJECT' || status === 'RELEASE'|| status === 'CANCEL') && (
                      <Table.HeaderCell>
                        <FormattedMessage id='approvals.table.header.review' />
                      </Table.HeaderCell>
                    )
                  }
                  {
                    status !== 'PENDING' && (
                      <Table.HeaderCell>
                        <FormattedMessage id='approvals.table.header.comment' />
                      </Table.HeaderCell>
                    )
                  }
                  {
                    status === 'RELEASE' && (
                      <Table.HeaderCell>
                        <FormattedMessage id='approvals.table.header.published.time' />
                      </Table.HeaderCell>
                    )
                  }
                  {
                    status === 'CANCEL' && (
                      <Table.HeaderCell>
                        <FormattedMessage id='approvals.table.header.cancelled.time' />
                      </Table.HeaderCell>
                    )
                  }
                  {
                    status === 'PENDING' && type === 'APPROVAL' && (
                      <Table.HeaderCell>
                        <FormattedMessage id='common.operation.text' />
                      </Table.HeaderCell>
                    )
                  }
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  approvalList?.map((approval: IApproval) => {
                    return (
                      <ListItem 
                        type={type}
                        status={status}
                        approval={approval}
                        refreshList={refreshList}
                      />
                    );
                  })
                }
              </Table.Body>
            </Table>
            {
              approvalList.length === 0 && (
                <div className={styles['no-data']}>
                  <div>
                    <img className={styles['no-data-image']} src={require('images/no-data.png')} alt='no-data' />
                  </div>
                  <div>
                    <FormattedMessage id='common.nodata.text' />
                  </div>
                </div>
              )
            }
            {
              approvalList.length !== 0 && (
                <div className={styles.pagination}>
                  <div className={styles['total']}>
                    <span className={styles['total-count']}>{total} </span>
                    <FormattedMessage id='approvals.total' />
                  </div>
                  {
                    pagination.totalPages > 1 && (
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
                    )
                  }
                </div>
              )
            }
          </div>
        )
      }
    </div>
  );
};

export default Lists;