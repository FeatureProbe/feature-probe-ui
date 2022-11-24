import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Dimmer, Form, Loader, Pagination, PaginationProps, Table } from 'semantic-ui-react';

import Icon from 'components/Icon';
import WebHookLayout from 'layout/webHookLayout';
import styles from './index.module.scss';
import WebHookItem from './components/webHookItem';
import { cloneDeep } from 'lodash';
import { IWebHook, IWebHookListResponse } from 'interfaces/webhook';
import WebHookDrawer from './components/WebHookDrawer';
import { Provider } from './provider';
import { getWebHookList } from 'services/webhook';
import message from 'components/MessageBox';

const WebHook = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [list, saveList] = useState<IWebHook[]>([]);
  const [isDrawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [isAdd, setIsAdd] = useState<boolean>(true);
  const [drawerValue, saveDrawerValue] = useState<IWebHook>();
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

  const fetchWebHookList = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getWebHookList<IWebHookListResponse>();
      if (res.success && res.data) {
        saveList(res.data.content);
        setPagination({
          pageIndex: pagination.pageIndex,
          totalPages: res.data.totalPages,
          totalItems: res.data.totalElements,
        });
      }
    } catch {
      message.error(intl.formatMessage({ id: 'webhook.create.failed' }));
    } finally {
      setIsLoading(false);
    }
  }, [intl, pagination.pageIndex]);

  useEffect(() => {
    fetchWebHookList();
  }, [fetchWebHookList]);

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
                        <FormattedMessage id="webhook.recent.text" />
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
                    {list.map((item, index) => {
                      return (
                        <WebHookItem
                          index={index}
                          saveList={saveList}
                          refresh={fetchWebHookList}
                          handleEdit={() => {
                            saveDrawerValue(item);
                            setDrawerVisible(true);
                            setIsAdd(false);
                          }}
                          key={item.id}
                          webhook={item}
                        />
                      );
                    })}
                  </Table.Body>
                </Table>
              </div>
              <div className={styles.pagination}>
                <div className={styles['total']}>
                  <span className={styles['total-count']}>{pagination.totalItems} </span>
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
          <WebHookDrawer
            refresh={fetchWebHookList}
            onClose={() => {
              setDrawerVisible(false);
              saveDrawerValue(undefined);
            }}
            defaultValue={drawerValue}
            isAdd={isAdd}
            visible={isDrawerVisible}
          />
        </div>
      </Provider>
    </WebHookLayout>
  );
};

export default WebHook;
