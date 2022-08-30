import { SyntheticEvent, useEffect, useState, useCallback, useMemo } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { 
  Pagination, 
  Table, 
  Form, 
  Popup,
  PaginationProps, 
  Dropdown, 
  DropdownItemProps, 
  DropdownProps, 
  InputOnChangeData 
} from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { debounce } from 'lodash';
import ToggleItem from './components/ToggleItem';
import ToggleDrawer from './components/ToggleDrawer';
import ProjectLayout from 'layout/projectLayout';
import message from 'components/MessageBox';
import Button from 'components/Button';
import Icon from 'components/Icon';
import EventTracker from 'components/EventTracker';
import { I18NContainer } from 'hooks';
import { getToggleList, getTags } from 'services/toggle';
import { saveDictionary } from 'services/dictionary';
import { Provider } from './provider';
import { IToggle, IToggleList,  } from 'interfaces/toggle';
import { ITag, ITagOption } from 'interfaces/project';
import { NOT_FOUND } from 'constants/httpCode';
import { LAST_SEEN } from 'constants/dictionary_keys';
import styles from './index.module.scss';

interface IParams {
  projectKey: string;
  environmentKey: string;
}

interface ISearchParams {
  pageIndex: number;
  pageSize: number;
  sortBy?: string;
  environmentKey: string;
  visitFilter?: string;
  disabled?: number;
  tags?: string[];
  keyword?: number;
  archived?: boolean;
}

const Toggle = () => {
  const { search } = useLocation();
  const { projectKey, environmentKey } = useParams<IParams>();
  const [ toggleList, setToggleList ] = useState<IToggle[]>([]);
  const [ pagination, setPagination ] = useState({
    pageIndex: 1,
    totalPages: 1,
  });
  const [ visible, setDrawerVisible ] = useState<boolean>(false);
  const [ isAdd, setIsAdd ] = useState<boolean>(false);
  const [ total, setTotal ] = useState<number>(0);
  const [ tagOptions, setTagsOptions ] = useState<ITagOption[]>([]);
  const [ searchParams, setSearchParams ] = useState<ISearchParams>({
    pageIndex: 0,
    pageSize: 10,
    environmentKey,
    archived: search.indexOf('isArchived=true') > -1,
  });
  const [ archiveOpen, setArchiveOpen ] = useState<boolean>(false);
  const [ isArchived, setArchived ] = useState<boolean>(search.indexOf('isArchived=true') > -1);
  const history = useHistory();
  const intl = useIntl();
  const { i18n } = I18NContainer.useContainer();

  useEffect(() => {
    const handler = () => {
      if (archiveOpen) {
        setArchiveOpen(false);
      }
    };
    window.addEventListener('click', handler);

    return () => window.removeEventListener('click', handler);
  }, [archiveOpen]);

  const getToggleLists = useCallback(() => {
    searchParams.environmentKey = environmentKey;
    getToggleList<IToggleList>(projectKey, searchParams)
      .then(async (res) => {
        const { success, data, code } = res;
        if (success && data) {
          const { content, pageable, totalPages, totalElements } = data;
          setToggleList(content);
          setPagination({
            pageIndex: pageable.pageNumber + 1,
            totalPages,
          });
          setTotal(totalElements);
          return;
        } else if (!success && code === NOT_FOUND) {
          saveDictionary(LAST_SEEN, {});
          history.push('/notfound');
          return;
        } else {
          if (res.success)
          setToggleList([]);
          setPagination({
            pageIndex: 1,
            totalPages: 1,
          });

          message.error(intl.formatMessage({id: 'toggles.list.error.text'}));
        }
      });
  }, [intl, projectKey, environmentKey, history, searchParams]);

  useEffect(() => {
    getToggleLists();
  }, [getToggleLists]);

  const getTagList = useCallback(async () => {
    const res = await getTags<ITag[]>(projectKey);
    const { success, data } = res;
    if (success && data) {
      const tags = data.map((item: ITag) => {
        return {
          key: item.name,
          text: item.name,
          value: item.name,
        };
      });

      setTagsOptions(tags);
    } else {
      message.error(intl.formatMessage({id: 'tags.list.error'}));
    }
  }, [intl, projectKey]);

  useEffect(() => {
    getTagList();
  }, [getTagList]);

  useEffect(() => {
    if (projectKey && environmentKey) {
      saveDictionary(LAST_SEEN, {
        projectKey,
        environmentKey,
      });
    }
  }, [projectKey, environmentKey]);

  const handleAddToggle = useCallback(() => {
    setDrawerVisible(true);
    setIsAdd(true);
  }, []);

  const evaluationOptions = useMemo(() => {
    return [
      { 
        key: 'in last 7 days', 
        value: 'IN_WEEK_VISITED', 
        text: intl.formatMessage({id: 'toggles.filter.evaluated.last.seven.days'}) 
      },
      { 
        key: 'not in last 7 days', 
        value: 'OUT_WEEK_VISITED', 
        text: intl.formatMessage({id: 'toggles.filter.evaluated.not.last.seven.days'}) 
      },
      { 
        key: 'none', 
        value: 'NOT_VISITED', 
        text: intl.formatMessage({id: 'toggles.filter.evaluated.never'}) 
      },
    ];
  }, [intl]);

  const statusOptions = useMemo(() => {
    return [
      { 
        key: 'enabled', 
        value: false, 
        text: intl.formatMessage({id: 'common.enabled.text'}) 
      },
      { 
        key: 'disabled', 
        value: true, 
        text: intl.formatMessage({id: 'common.disabled.text'}) 
      },
    ];
  }, [intl]);

  const renderLabel = useCallback((label: DropdownItemProps) => {
    return ({
      content: label.text,
      removeIcon: <Icon customClass={styles['dropdown-remove-icon']} type='close' />,
    });
  }, []);

  const handleEvaluationChange = useCallback((e: SyntheticEvent, data: DropdownProps) => {
    setSearchParams({
      ...searchParams,
      // @ts-ignore
      visitFilter: data.value
    });
  }, [searchParams]);

  const handleStatusChange = useCallback((e: SyntheticEvent, data: DropdownProps) => {
    setSearchParams({
      ...searchParams,
      // @ts-ignore
      disabled: data.value
    });
  }, [searchParams]);

  const handlePageChange = useCallback((e: SyntheticEvent, data: PaginationProps) => {
    setSearchParams({
      ...searchParams,
      pageIndex: Number(data.activePage) - 1
    });
  }, [searchParams]);

  const handleTagsChange = useCallback((e: SyntheticEvent, data: DropdownProps) => {
    setSearchParams({
      ...searchParams,
      // @ts-ignore
      tags: data.value,
    });
  }, [searchParams]);

  const handleSearch = debounce(useCallback((e: SyntheticEvent, data: InputOnChangeData) => {
    setSearchParams({
      ...searchParams,
      // @ts-ignore
      keyword: data.value,
    });
  }, [searchParams]), 300);

  const refreshToggleList = useCallback(() => {
    setSearchParams({
      ...searchParams,
      pageIndex: 0,
    });
  }, [searchParams]);

  const handleSearchArchivedList = useCallback((archived: boolean) => {
    setSearchParams({
      ...searchParams,
      pageIndex: 0,
      archived,
    });
  }, [searchParams]);

	return (
    <ProjectLayout>
      <div className={styles.toggle}>
        {
          isArchived && (
            <div className={styles.archive}>
              {
                i18n === 'en-US' 
                  ? <img className={styles['archived-img']} src={require('images/archived-en.png')} alt='archived' />
                  : <img className={styles['archived-img']} src={require('images/archived-zh.png')} alt='archived' />
              }
            </div>
          )
        }
        <Provider>
          <>
            <div className={styles.card}>
              {
                isArchived ? (
                  <div className={styles['heading-archive']}>
                    <Icon 
                      type='back' 
                      customClass={styles['icon-back']} 
                      onClick={() => { 
                        setArchived(false); 
                        handleSearchArchivedList(false);
                      }} 
                    />
                    <span className={styles.divider}></span>
                    <FormattedMessage id='common.archived.toggles.text' />
                  </div>
                ) : (
                  <div className={styles.heading}>
                    <FormattedMessage id='common.toggles.text' />
                  </div>
                )
              }
              <div className={styles.add}>
                <Form className={styles['filter-form']}>
                  <Form.Field className={styles['evaluation-field']}>
                    <label className={styles.label}>
                      <FormattedMessage id='toggles.filter.evaluated' />
                    </label>
                    <Dropdown
                      fluid 
                      selection
                      floating
                      clearable
                      selectOnBlur={false}
                      className={styles['dropdown']}
                      placeholder={intl.formatMessage({id: 'common.dropdown.placeholder'})} 
                      options={evaluationOptions} 
                      icon={
                        searchParams.visitFilter
                          ? <Icon customClass={styles['angle-down']} type='remove-circle' />
                          : <Icon customClass={styles['angle-down']} type='angle-down' />
                      }
                      onChange={handleEvaluationChange}
                    />
                  </Form.Field>
                  <Form.Field className={styles['status-field']}>
                    <label className={styles.label}>
                      <FormattedMessage id='toggles.filter.status' />
                    </label>
                    <Dropdown 
                      fluid 
                      selection 
                      floating
                      clearable
                      className={styles['status-dropdown']}
                      selectOnBlur={false}
                      placeholder={intl.formatMessage({id: 'common.dropdown.placeholder'})} 
                      options={statusOptions} 
                      icon={
                        typeof searchParams.disabled === 'boolean'
                          ? <Icon customClass={styles['angle-down']} type='remove-circle' />
                          : <Icon customClass={styles['angle-down']} type='angle-down' />
                      }
                      onChange={handleStatusChange}
                    />
                  </Form.Field>
                  <Form.Field className={styles['tags-field']}>
                    <label className={styles.label}>
                      <FormattedMessage id='common.tags.text' />
                    </label>
                     <Dropdown 
                      fluid 
                      multiple 
                      selection 
                      floating
                      clearable
                      selectOnBlur={false}
                      className={styles['dropdown']}
                      placeholder={intl.formatMessage({id: 'common.dropdown.placeholder'})} 
                      options={tagOptions} 
                      renderLabel={renderLabel}
                      onChange={handleTagsChange}
                      icon={
                        searchParams.tags && searchParams.tags.length > 0
                          ? <Icon customClass={styles['angle-down']} type='remove-circle' />
                          : <Icon customClass={styles['angle-down']} type='angle-down' />
                      }
                    />
                  </Form.Field>
                  <Form.Field className={styles['keywords-field']}>
                    <Form.Input 
                      placeholder={intl.formatMessage({id: 'toggles.filter.search.placeholder'})} 
                      icon={<Icon customClass={styles['icon-search']} type='search' />}
                      onChange={handleSearch}
                    />
                  </Form.Field>
                </Form>
                {
                  !isArchived && (
                    <EventTracker category='toggle' action='create-toggle'>
                      <Button primary className={styles['add-button']} onClick={handleAddToggle}>
                        <Icon customClass={styles['iconfont']} type='add' />
                        <FormattedMessage id='common.toggle.text' />
                      </Button>
                    </EventTracker>
                  )
                }
                <Popup
                  basic
                  open={archiveOpen}
                  on='click'
                  position='bottom right'
                  className={styles.popup}
                  trigger={
                    <div 
                      onClick={(e: SyntheticEvent) => {
                        document.body.click();
                        e.stopPropagation();
                        setArchiveOpen(true);
                      }}
                      className={styles['toggle-menu']}
                    >
                      <Icon customClass={styles['menu-angle-down']} type='angle-down' />
                    </div>
                  }
                >
                  <div className={styles['menu']} onClick={() => {
                    setArchiveOpen(false);
                  }}>
                    {
                      isArchived ? (
                        <div className={styles['menu-item']} onClick={() => { 
                          document.body.click();
                          setArchived(false); 
                          history.push(`/${projectKey}/${environmentKey}/toggles`);
                          handleSearchArchivedList(false);
                        }}>
                          <FormattedMessage id='toggles.menu.view.active.toggle' />
                        </div>
                      ) : (
                        <div className={styles['menu-item']} onClick={() => { 
                          document.body.click();
                          setArchived(true); 
                          history.push(`/${projectKey}/${environmentKey}/toggles?isArchived=true`);
                          handleSearchArchivedList(true);
                        }}>
                          <FormattedMessage id='toggles.menu.view.archive.toggle' />
                        </div>
                      )
                    }
                  </div>
                </Popup>
              </div>
              <div className={styles.lists}>
                <Table basic='very' unstackable>
                  <Table.Header className={styles['table-header']}>
                    <Table.Row>
                      <Table.HeaderCell className={styles['column-brief']}>
                        <FormattedMessage id='toggles.table.brief' />
                      </Table.HeaderCell>
                      <Table.HeaderCell className={styles['column-status']}>
                        <FormattedMessage id='toggles.table.status' />
                      </Table.HeaderCell>
                      <Table.HeaderCell className={styles['column-type']}>
                        <FormattedMessage id='common.type.text' />
                      </Table.HeaderCell>
                      <Table.HeaderCell className={styles['column-tags']}>
                        <FormattedMessage id='common.tags.text' />
                      </Table.HeaderCell>
                      <Table.HeaderCell className={styles['column-evaluated']}>
                        <FormattedMessage id='toggles.table.evaluation' />
                      </Table.HeaderCell>
                      <Table.HeaderCell className={styles['column-modify']}>
                        <FormattedMessage id='toggles.table.lastmodified' />
                      </Table.HeaderCell>
                      <Table.HeaderCell className={styles['column-operation']}></Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  {
                    toggleList.length !== 0 && (
                      <Table.Body>
                        {
                          toggleList?.map((toggle: IToggle, index: number) => {
                            return (
                              <ToggleItem 
                                key={toggle.key}
                                toggle={toggle} 
                                isArchived={isArchived}
                                setIsAdd={setIsAdd}
                                refreshToggleList={refreshToggleList}
                                setDrawerVisible={setDrawerVisible}
                              />
                            );
                          })
                        }
                      </Table.Body>
                    )
                  }
                </Table>
                {
                  toggleList.length === 0 && (
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
                toggleList.length !== 0 && (
                  <div className={styles.pagination}>
                    <div className={styles['total']}>
                      <span className={styles['total-count']}>{total} </span>
                      <FormattedMessage id='toggles.total' />
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
            <ToggleDrawer 
              isAdd={isAdd}
              visible={visible}
              setDrawerVisible={setDrawerVisible}
              refreshToggleList={refreshToggleList}
            />
          </>
        </Provider>
      </div>
    </ProjectLayout>
	);
};

export default Toggle;
