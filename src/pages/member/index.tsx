import { useCallback, useEffect, useState, SyntheticEvent } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Table, Pagination, PaginationProps } from 'semantic-ui-react';
import SettingLayout from 'layout/settingLayout';
import Button from 'components/Button';
import Icon from 'components/Icon';
import message from 'components/MessageBox';
import MemberDrawer from './components/MemberDrawer';
import MemberItem from './components/MemberItem';
import { getMemberList } from 'services/member';
import { getUserInfo } from 'services/user';
import { IMemberList, IMember, IUserInfo } from 'interfaces/member';
import styles from './index.module.scss';

const Member = () => {
  const [memberList, setMemberList] = useState<IMember[]>();
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    totalPages: 1,
  });
  const [ total, setTotal ] = useState<number>(0);
  const [ drawerVisible, setDrawerVisible ] = useState<boolean>(false);
  const [ isAdd, setIsAdd ] = useState<boolean>(false);
  const [ userInfo, setUserInfo ] = useState<IUserInfo>();
  const [ editUser, setEditUser ] = useState<IUserInfo>();
  const intl = useIntl();

  const fetchMemberList = useCallback(async (pageIndex: number) => {
    const res = await getMemberList<IMemberList>({
      pageIndex,
      pageSize: 10,
    });

    const { success, data } = res;
    if (success && data) {
      const { content, pageable, totalPages, totalElements } = data;
      setMemberList(content);
      setPagination({
        pageIndex: pageable.pageNumber + 1,
        totalPages,
      });
      setTotal(totalElements);
      return;
    } else {
      if (res.success)
      setMemberList([]);
      setPagination({
        pageIndex: 1,
        totalPages: 1,
      });
      message.error(intl.formatMessage({id: 'members.list.error.text'}));
    }
  }, [intl]);

  const init = useCallback(async() => {
    const userInfo = await getUserInfo<IUserInfo>();
    if (userInfo.success) {
      setUserInfo(userInfo.data);
    }

    await fetchMemberList(0);
    
  }, [fetchMemberList]);

  useEffect(() => {
    init();
  }, [init]);

  const handlePageChange = useCallback((e: SyntheticEvent, data: PaginationProps) => {
    fetchMemberList(Number(data.activePage) - 1);
  }, [fetchMemberList]);

	return (
    <SettingLayout>
      <>
        <div className={styles.member}>
          <div className={styles.heading}>
            <FormattedMessage id='common.members.text' />
          </div>
          {
            userInfo?.role === 'ADMIN' && (
              <div className={styles.add}>
                <Button primary className={styles['add-button']} onClick={() => { 
                  setIsAdd(true);
                  setDrawerVisible(true);
                }}>
                  <Icon customClass={styles['iconfont']} type='add' />
                  <FormattedMessage id='common.member.text' />
                </Button>
              </div>
            )
          }
          <div className={styles.lists}>
            <Table basic='very' unstackable>
              <Table.Header className={styles['table-header']}>
                <Table.Row>
                  <Table.HeaderCell className={styles['column-members']}>
                    <FormattedMessage id='common.account.text' />
                  </Table.HeaderCell>
                  <Table.HeaderCell className={styles['column-createdby']}>
                    <FormattedMessage id='members.createdby' />
                  </Table.HeaderCell>
                  <Table.HeaderCell className={styles['column-lastseen']}>
                    <FormattedMessage id='members.lastseen' />
                  </Table.HeaderCell>
                  <Table.HeaderCell className={styles['column-operation']}>
                    <FormattedMessage id='common.operation.text' />
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              {
                memberList?.length !== 0 && (
                  <Table.Body>
                    {
                      memberList?.map((member: IMember, index: number) => {
                        return (
                          <MemberItem 
                            key={member.account}
                            member={member} 
                            userInfo={userInfo}
                            setIsAdd={setIsAdd}
                            setEditUser={setEditUser}
                            setDrawerVisible={setDrawerVisible}
                            refreshMemberList={fetchMemberList}
                          />
                        )
                      })
                    }
                  </Table.Body>
                )
              }
            </Table>
            {
              memberList?.length === 0 && (
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
          </div>
          {
            memberList?.length !== 0 && (
              <div className={styles.pagination}>
                <div className={styles['total']}>
                  <span className={styles['total-count']}>{total} </span>
                  <FormattedMessage id='members.total' />
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
        <MemberDrawer 
          isAdd={isAdd}
          visible={drawerVisible}
          editUser={editUser}
          setDrawerVisible={setDrawerVisible}
          refreshMemberList={fetchMemberList}
        />
      </>
    </SettingLayout>
  )
}

export default Member;
