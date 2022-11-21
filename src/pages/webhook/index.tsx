import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Dimmer, Form, Loader, Pagination, PaginationProps, Table } from 'semantic-ui-react';

import Icon from 'components/Icon';
import WebHookLayout from 'layout/webHookLayout';
import styles from './index.module.scss';
import WebHookItem from './components/WebHookItem';
import { cloneDeep } from 'lodash';
import { IWebHook } from 'interfaces/webhook';
import sleep from 'utils/sleep';
import WebHookDrawer from './components/WebHookDrawer';
import { Provider } from './provider';

const webHookItemData: IWebHook = {
  key: 1,
  name: '这是名字',
  description: '这是描述',
  status: true,
  application: '这是应用',
  url: 'http://localhost:3000/webHook/list',
};

const webHookList = new Array(112).fill(webHookItemData).map((item, index) => {
  const cloneObj = cloneDeep<IWebHook>(item);
  cloneObj.key += index;
  cloneObj.name += cloneObj.key;
  cloneObj.status = index % 2 === 0;
  cloneObj.description = index % 2 ? '' : cloneObj.description + 'long long long long long';
  return cloneObj;
});

const WebHook = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    totalPages: Math.ceil(webHookList.length / 10),
  });
  const [list, saveList] = useState<IWebHook[]>([]);
  const [isDrawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [isAdd, setIsAdd] = useState<boolean>(true);
  const intl = useIntl();

  const handleSearch = useCallback(() => {
    //do something
  }, []);

  const handleAddWebHook = useCallback(() => {
    setIsAdd(true);
    setDrawerVisible(true);
  }, []);

  const handlePageChange = useCallback((e, data: PaginationProps) => {
    setPagination((pagination) => {
      pagination.pageIndex = typeof data.activePage == 'number' ? data.activePage : 0;
      return cloneDeep(pagination);
    });
  }, []);

  const mockWebHookList = async (page: number) => {
    setIsLoading(true);
    await sleep(1000);
    setIsLoading(false);
    return webHookList.slice((page - 1) * 10, page * 10);
  };

  useEffect(() => {
    (async () => {
      saveList(await mockWebHookList(pagination.pageIndex));
    })();
  }, [pagination.pageIndex]);

  return (
    <WebHookLayout>
      <Provider>
        <div className={styles.card}>
          <div className={styles.title}>
            <FormattedMessage id="common.webhook.text" />
          </div>
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
              <Button primary className={styles['add-button']} onClick={handleAddWebHook}>
                <Icon customclass={styles['iconfont']} type="add" />
                <FormattedMessage id="common.webhook.text" />
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className={styles.load}>
              {isLoading && (
                <Dimmer active inverted>
                  <Loader size="small">
                    <FormattedMessage id="common.loading.text" />
                  </Loader>
                </Dimmer>
              )}
            </div>
          ) : (
            <>
              <div className={styles['table-box']}>
                <Table basic="very" unstackable>
                  <Table.Header className={styles['table-header']}>
                    <Table.Row>
                      <Table.HeaderCell className={styles['column-brief']}>
                        <FormattedMessage id="common.name.text" />
                      </Table.HeaderCell>
                      <Table.HeaderCell className={styles['column-description']}>
                        <FormattedMessage id="common.description.text" />
                      </Table.HeaderCell>
                      <Table.HeaderCell className={styles['column-type']}>
                        <FormattedMessage id="toggles.filter.status" />
                      </Table.HeaderCell>
                      <Table.HeaderCell className={styles['column-tags']}>
                        <FormattedMessage id="webhook.application.text" />
                      </Table.HeaderCell>
                      <Table.HeaderCell className={styles['column-url']}>
                        <FormattedMessage id="webhook.url.text" />
                      </Table.HeaderCell>
                      <Table.HeaderCell className={styles['column-operation']}>
                        <FormattedMessage id="common.operation.text" />
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body className={styles['table-body']}>
                    {list.map((item) => {
                      return (
                        <WebHookItem
                          handleEdit={() => {
                            setDrawerVisible(true);
                            setIsAdd(false);
                          }}
                          key={item.key}
                          webhook={item}
                        />
                      );
                    })}
                  </Table.Body>
                </Table>
              </div>
              <div className={styles.pagination}>
                <div className={styles['total']}>
                  <span className={styles['total-count']}>{webHookList.length} </span>
                  <FormattedMessage id="toggles.total" />
                </div>
                {
                  <Pagination
                    activePage={pagination.pageIndex}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                    firstItem={null}
                    lastItem={null}
                    prevItem={{
                      content: <Icon type="angle-left" />,
                    }}
                    nextItem={{
                      content: <Icon type="angle-right" />,
                    }}
                  />
                }
              </div>
            </>
          )}
          <WebHookDrawer setDrawerVisible={setDrawerVisible} isAdd={isAdd} visible={isDrawerVisible} />
        </div>
      </Provider>
    </WebHookLayout>
  );
};

export default WebHook;
