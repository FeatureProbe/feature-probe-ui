import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Table } from 'semantic-ui-react';
import SettingCard from 'layout/settingCard';
import Icon from 'components/Icon';
import Loading from 'components/Loading';
import Pagination from 'components/Pagination';
import NoData from 'components/NoData';
import { ITokenListItem, TOKENTYPE } from 'interfaces/token';
import { Provider } from './provider';
import { getTokenList } from 'services/tokens';
import message from 'components/MessageBox';
import TokenItem from './components/TokenItem';
import TokenModal from './components/TokenModal';
import styles from './index.module.scss';
import UserSettingLayout from 'layout/userSettingLayout';

const ApiToken = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tokenList, saveTokenList] = useState<ITokenListItem[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const intl = useIntl();

  const handleAddToken = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handlePageChange = useCallback(() => {
    //
  }, []);

  const handleCancelAdd = useCallback(() => {
    setModalOpen(false);
  }, []);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getTokenList<ITokenListItem[]>(TOKENTYPE.PERSON);
      if (res.success && res.data) {
        saveTokenList(res.data);
      } else {
        message.error(intl.formatMessage({ id: 'token.list.error' }));
      }
    } catch {
      message.error(intl.formatMessage({ id: 'token.list.error' }));
    } finally {
      setIsLoading(false);
    }
  }, [intl]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <UserSettingLayout>
      <Provider>
        <SettingCard title={<FormattedMessage id="token.personal.title" />}>
          <div className={styles['action-line']}>
            <div className={styles.buttons}>
              <Button primary className={styles['add-button']} onClick={handleAddToken}>
                <Icon customclass={styles['iconfont']} type="add" />
                Token
              </Button>
            </div>
          </div>
          <div className={styles['table-box']}>
            <Table basic="very" unstackable>
              <Table.Header className={styles['table-header']}>
                <Table.Row>
                  <Table.HeaderCell className={styles['column-brief']}>
                    <FormattedMessage id="common.name.text" />
                  </Table.HeaderCell>
                  <Table.HeaderCell className={styles['column-last-time']}>
                    <FormattedMessage id="token.visitied.time" />
                  </Table.HeaderCell>
                  <Table.HeaderCell className={styles['column-opt']}>
                    <FormattedMessage id="common.operation.text" />
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              {isLoading ? (
                <div className={styles.lists}>{isLoading && <Loading />}</div>
              ) : (
                <>
                  {tokenList.length !== 0 && (
                    <Table.Body className={styles['table-body']}>
                      {tokenList.map((item) => {
                        return <TokenItem token={item} refresh={load} />;
                      })}
                    </Table.Body>
                  )}
                </>
              )}
            </Table>
            {tokenList.length !== 0 ? (
              <Pagination
                total={10}
                pagination={{
                  pageIndex: 1,
                  totalPages: 10,
                }}
                handlePageChange={handlePageChange}
              />
            ) : (
              <NoData />
            )}
            <TokenModal refresh={load} handleCancel={handleCancelAdd} open={modalOpen} />
          </div>
        </SettingCard>
      </Provider>
    </UserSettingLayout>
  );
};

export default ApiToken;
