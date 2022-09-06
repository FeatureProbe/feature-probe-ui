import { useCallback, useEffect, useState } from 'react';
import { Form, Table, Popup, Checkbox, Pagination, Dimmer, Loader } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import Icon from 'components/Icon';
import ListItem from '../ListItem';
import { IApproval, IApprovalList } from 'interfaces/approval';
import { getApprovalList } from 'services/approval';
import styles from './index.module.scss';

const LIST = '/approvals/list';
const MINE = '/approvals/mine';

const Lists = () => {
	const intl = useIntl();
	const [ status, saveStatus ] = useState<string>('PENDING');
  const [ type, saveType ] = useState<string>('APPROVAL');
  const [ isLoading, saveLoading ] = useState<boolean>(false);
	const [ pagination, setPagination ] = useState({
    pageIndex: 1,
    totalPages: 5,
  });
  const [ approvalList, saveApprovalList ] = useState<IApproval[]>([]);
  const [ total, setTotal ] = useState<number>(0);

  useEffect(() => {
    if (location.pathname === LIST) {
      saveType('APPROVAL');
    } else if (location.pathname === MINE) {
      saveType('APPLY');
    }
    saveStatus('PENDING');
  }, [location.pathname]);

  const init = useCallback(() => {
    saveLoading(true);
    getApprovalList<IApprovalList>({
      pageIndex: 0,
      status,
      type,
    }).then(res => {
      const { success, data } = res;
      if (success && data) {
        const { content, pageable, totalPages, totalElements } = data;
        saveApprovalList(content);
        setPagination({
          pageIndex: pageable.pageNumber + 1,
          totalPages,
        });
        setTotal(totalElements);
      } 
      saveLoading(false);
    });
  }, [type, status]);

  useEffect(() => {
    init();
  }, [init]);

	return (
		<div className={styles.lists}>
			<div className={styles.header}>
				<div className={styles.tabs}>
					<div 
						className={`${styles['tabs-item']} ${status === 'PENDING' && styles['tabs-item-selected']}`} 
						onClick={() => { 
              saveStatus('PENDING');
            }}
					>
						<FormattedMessage id='approvals.status.todo' />
					</div>
					<div 
						className={`${styles['tabs-item']} ${status === 'PASS' && styles['tabs-item-selected']}`} 
						onClick={() => { 
              saveStatus('PASS');
            }}
					>
						<FormattedMessage id='approvals.status.passed' />
					</div>
					<div 
						className={`${styles['tabs-item']} ${status === 'REJECT' && styles['tabs-item-selected']}`} 
						onClick={() => { 
              saveStatus('REJECT');
            }}
					>
						<FormattedMessage id='approvals.status.rejected' />
					</div>
					<div 
						className={`${styles['tabs-item']} ${status === 'JUMP' && styles['tabs-item-selected']}`} 
						onClick={() => { 
              saveStatus('JUMP');
            }}
					>
						<FormattedMessage id='approvals.status.skipped' />
					</div>
					<div 
						className={`${styles['tabs-item']} ${status === 'REVOKE' && styles['tabs-item-selected']}`} 
						onClick={() => { 
              saveStatus('REVOKE');
            }}
					>
						<FormattedMessage id='approvals.status.withdrawed' />
					</div>
				</div>
				<Form className={styles.form}>
					<Form.Field className={styles['keywords-field']}>
						<Form.Input 
							placeholder={intl.formatMessage({id: '关键字搜索'})} 
							icon={<Icon customClass={styles['icon-search']} type='search' />}
							onChange={() => { console.log(1); }}
						/>
					</Form.Field>
				</Form>
			</div>
			<div className={styles.content}>
        {
          isLoading && (
            <Dimmer active inverted>
              <Loader size='medium'>Loading</Loader>
            </Dimmer>
          )
        }

				<Table basic='very' unstackable>
					<Table.Header className={styles['table-header']}>
						<Table.Row>
							<Table.HeaderCell className={styles['column-title']}>
								<FormattedMessage id='approvals.table.header.title' />
							</Table.HeaderCell>
							<Table.HeaderCell className={styles['column-toggle']}>
								<FormattedMessage id='common.toggle.text' />
							</Table.HeaderCell>
							{
								(status === 'PASS' || status === 'JUMP') && (
									<Table.HeaderCell className={styles['column-publish-status']}>
										<span>
											<FormattedMessage id='approvals.table.header.status' />
										</span>
										<Popup
											basic
											position='bottom right'
											className={styles.popup}
          						on='click'
											trigger={
												<Icon type='filter' customClass={styles['icon-filter']} />
											}
										>
											<div className={styles['filter-menu']}>
												<div className={styles['filter-menu-content']}>
													<div className={styles['filter-item']}>
														<Checkbox 
															checked={ true } 
														/>
														<div className={styles['filter-item-text']}>
															<FormattedMessage id='approvals.table.header.status.published' />
														</div>
													</div>
													<div className={styles['filter-item']}>
														<Checkbox 
															checked={ true } 
														/>
														<div className={styles['filter-item-text']}>
															<FormattedMessage id='approvals.table.header.status.unpublished' />
														</div>
													</div>
													<div className={styles['filter-item']}>
														<Checkbox 
															checked={ true } 
														/>
														<div className={styles['filter-item-text']}>
															<FormattedMessage id='approvals.table.header.status.cancelled' />
														</div>
													</div>
												</div>
												<div className={styles['filter-menu-footer']}>
													<span className={styles['filter-btn-clear']}>
														<FormattedMessage id='common.clear.text' />
													</span>
													<span className={styles['filter-btn-confirm']}>
														<FormattedMessage id='common.confirm.text' />
													</span>
												</div>
											</div>
										</Popup>
									</Table.HeaderCell>
								)
							}
							<Table.HeaderCell className={styles['column-project']}>
								<FormattedMessage id='common.project.text' />
							</Table.HeaderCell>
							<Table.HeaderCell className={styles['column-environment']}>
								<FormattedMessage id='common.environment.text' />
							</Table.HeaderCell>
							<Table.HeaderCell className={styles['column-applicant']}>
								<FormattedMessage id='approvals.table.header.application' />
							</Table.HeaderCell>
							{
								status === 'JUMP' && (
									<Table.HeaderCell className={styles['column-skip-time']}>
										<FormattedMessage id='approvals.table.header.skip.time' />
									</Table.HeaderCell>
								)
							}
							{
								status === 'JUMP' && (
									<Table.HeaderCell className={styles['column-skip-reason']}>
										<FormattedMessage id='approvals.table.header.skip.reason' />
									</Table.HeaderCell>
								)
							}
							{
								(status === 'PASS' || status === 'REJECT') && (
									<Table.HeaderCell className={styles['column-approver']}>
										<FormattedMessage id='approvals.table.header.approval' />
									</Table.HeaderCell>
								)
							}
							{
								status === 'PASS' && (
									<Table.HeaderCell className={styles['column-approve-reason']}>
										<FormattedMessage id='approvals.table.header.pass.reason' />
									</Table.HeaderCell>
								)
							}
							{
								status === 'REJECT' && (
									<Table.HeaderCell className={styles['column-refuse-reason']}>
										<FormattedMessage id='approvals.table.header.reject.reason' />
									</Table.HeaderCell>
								)
							}
							{
								status === 'REVOKE' && (
									<Table.HeaderCell className={styles['column-withdraw-time']}>
										<FormattedMessage id='approvals.table.header.withdraw.time' />
									</Table.HeaderCell>
								)
							}
							{
								status === 'REVOKE' && (
									<Table.HeaderCell className={styles['column-withdraw-reasson']}>
										<FormattedMessage id='approvals.table.header.withdraw.reason' />
									</Table.HeaderCell>
								)
							}
							{
								(status === 'PASS' || status === 'JUMP') && (
									<Table.HeaderCell className={styles['column-publish-time']}>
										<FormattedMessage id='approvals.table.header.publish.time' />
									</Table.HeaderCell>
								)
							}
							{
								status === 'PENDING' && (
									<Table.HeaderCell className={styles['column-operation']}>
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
										status={status}
                    approval={approval}
                    type={type}
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
								个审批
							</div>
							{
								pagination.totalPages > 1 && (
									<Pagination 
										activePage={pagination.pageIndex} 
										totalPages={pagination.totalPages} 
										onPageChange={() => {console.log(1); }}
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
		</div>
	);
};

export default Lists;