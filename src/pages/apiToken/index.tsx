import { FormattedMessage, useIntl } from 'react-intl';
import SettingLayout from 'layout/settingLayout';
import styles from './index.module.scss';
import SettingCard from 'layout/settingCard';
import { Button, Form, Table } from 'semantic-ui-react';
import Icon from 'components/Icon';
import { useCallback, useState } from 'react';
import Loading from 'components/Loading';
import Pagination from 'components/Pagination';
import NoData from 'components/NoData';
import TokenItem from './components/TokenItem';
import { IToken } from 'interfaces/token';
import TokenModal from './components/TokenModal';

const ApiToken = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tokenList, saveTokenList] = useState<IToken[]>([{name: 'test'}]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const intl = useIntl();

  const handleAddToken = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleSearch = useCallback(() => {
    //
  }, []);

  const handlePageChange = useCallback(() => {
    //
  }, []);

  const handleCancelAdd = useCallback(() => {
    setModalOpen(false);
  }, []);

  return (
    <SettingLayout>
      <SettingCard title={<FormattedMessage id="token.title.text" />}>
        <div className={styles['action-line']}>
          <Form>
            <Form.Field className={styles['keywords-field']}>
              <Form.Input
                placeholder={intl.formatMessage({ id: 'toggles.filter.search.placeholder' })}
                icon={<Icon customclass={styles['icon-search']} type="search" />}
                onChange={handleSearch}
              />
            </Form.Field>
          </Form>
          <div className={styles.buttons}>
            <Button primary className={styles['add-button']} onClick={handleAddToken}>
              <Icon customclass={styles['iconfont']} type="add" />
              <FormattedMessage id="common.tokens.text" />
            </Button>
          </div>
        </div>
        <div className={styles['table-box']}>
          <Table basic="very" unstackable>
            <Table.Header className={styles['table-header']}>
              <Table.Row>
                <Table.HeaderCell className={styles['column-brief']}>
                  <FormattedMessage id="token.table.brief" />
                </Table.HeaderCell>
                <Table.HeaderCell className={styles['column-role']}>
                  <FormattedMessage id="token.table.role" />
                </Table.HeaderCell>
                <Table.HeaderCell className={styles['column-creator']}>
                  <FormattedMessage id="token.table.creator" />
                </Table.HeaderCell>
                <Table.HeaderCell className={styles['column-last-time']}>
                  <FormattedMessage id="token.table.last.use.time" />
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
                      return <TokenItem token={item} />;
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
                totalPages: 10
              }}
              handlePageChange={handlePageChange}
            />
          ) : (
            <NoData />
          )}
          <TokenModal handleCancel={handleCancelAdd} open={modalOpen} />
        </div>
      </SettingCard>
    </SettingLayout>
  );
};

export default ApiToken;
