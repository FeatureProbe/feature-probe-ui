import { useState } from 'react';
import { Form, Table, Popup, Checkbox, Pagination } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import Icon from 'components/Icon';
import ListItem from '../ListItem';
import styles from './index.module.scss';

const Lists = () => {
	const intl = useIntl();
	const [ index, saveIndex ] = useState<number>(1);
	const [ pagination, setPagination ] = useState({
    pageIndex: 1,
    totalPages: 5,
  });

	return (
		<div className={styles.lists}>
			<div className={styles.header}>
				<div className={styles.tabs}>
					<div 
						className={`${styles['tabs-item']} ${index === 1 && styles['tabs-item-selected']}`} 
						onClick={() => { saveIndex(1); }}
					>
						<FormattedMessage id='approvals.status.todo' />
					</div>
					<div 
						className={`${styles['tabs-item']} ${index === 2 && styles['tabs-item-selected']}`} 
						onClick={() => { saveIndex(2); }}
					>
						<FormattedMessage id='approvals.status.passed' />
					</div>
					<div 
						className={`${styles['tabs-item']} ${index === 3 && styles['tabs-item-selected']}`} 
						onClick={() => { saveIndex(3); }}
					>
						<FormattedMessage id='approvals.status.rejected' />
					</div>
					<div 
						className={`${styles['tabs-item']} ${index === 4 && styles['tabs-item-selected']}`} 
						onClick={() => { saveIndex(4); }}
					>
						<FormattedMessage id='approvals.status.skipped' />
					</div>
					<div 
						className={`${styles['tabs-item']} ${index === 5 && styles['tabs-item-selected']}`} 
						onClick={() => { saveIndex(5); }}
					>
						<FormattedMessage id='approvals.status.withdrawed' />
					</div>
				</div>
				<Form className={styles.form}>
					<Form.Field className={styles['keywords-field']}>
						<Form.Input 
							placeholder={intl.formatMessage({id: 'toggles.filter.search.placeholder'})} 
							icon={<Icon customClass={styles['icon-search']} type='search' />}
							onChange={() => { console.log(1); }}
						/>
					</Form.Field>
				</Form>
			</div>
			<div className={styles.content}>
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
								(index === 2 || index === 4) && (
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
								index === 4 && (
									<Table.HeaderCell className={styles['column-skip-time']}>
										<FormattedMessage id='approvals.table.header.skip.time' />
									</Table.HeaderCell>
								)
							}
							{
								index === 4 && (
									<Table.HeaderCell className={styles['column-skip-reason']}>
										<FormattedMessage id='approvals.table.header.skip.reason' />
									</Table.HeaderCell>
								)
							}
							{
								(index === 2 || index === 3) && (
									<Table.HeaderCell className={styles['column-approver']}>
										<FormattedMessage id='approvals.table.header.approval' />
									</Table.HeaderCell>
								)
							}
							{
								index === 2 && (
									<Table.HeaderCell className={styles['column-approve-reason']}>
										<FormattedMessage id='approvals.table.header.pass.reason' />
									</Table.HeaderCell>
								)
							}
							{
								index === 3 && (
									<Table.HeaderCell className={styles['column-refuse-reason']}>
										<FormattedMessage id='approvals.table.header.reject.reason' />
									</Table.HeaderCell>
								)
							}
							{
								index === 5 && (
									<Table.HeaderCell className={styles['column-withdraw-time']}>
										<FormattedMessage id='approvals.table.header.withdraw.time' />
									</Table.HeaderCell>
								)
							}
							{
								index === 5 && (
									<Table.HeaderCell className={styles['column-withdraw-reasson']}>
										<FormattedMessage id='approvals.table.header.withdraw.reason' />
									</Table.HeaderCell>
								)
							}
							{
								(index === 2 || index === 4) && (
									<Table.HeaderCell className={styles['column-publish-time']}>
										<FormattedMessage id='approvals.table.header.publish.time' />
									</Table.HeaderCell>
								)
							}
							{
								index === 1 && (
									<Table.HeaderCell className={styles['column-operation']}>
										<FormattedMessage id='common.operation.text' />
									</Table.HeaderCell>
								)
							}
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{
							[1, 2, 3]?.map(() => {
								return (
									<ListItem 
										index={index}
									/>
								);
							})
						}
					</Table.Body>
				</Table>
				{
					[1, 2, 3].length !== 0 && (
						<div className={styles.pagination}>
							<div className={styles['total']}>
								<span className={styles['total-count']}>111 </span>
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