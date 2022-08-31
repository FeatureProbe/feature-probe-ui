import { SyntheticEvent, useEffect, useState, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { 
  Pagination, 
  Table, 
  Form, 
  PaginationProps, 
  InputOnChangeData 
} from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { debounce } from 'lodash';
import SegmentItem from './components/SegmentItem';
import ProjectLayout from 'layout/projectLayout';
import message from 'components/MessageBox';
import Button from 'components/Button';
import Icon from 'components/Icon';
import EventTracker from 'components/EventTracker';
import { getSegmentList } from 'services/segment';
import { saveDictionary } from 'services/dictionary';
import { ISegment, ISegmentList } from 'interfaces/segment';
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
  disabled?: number;
  tags?: string[];
  keyword?: number;
}

const Segment = () => {
  const { projectKey, environmentKey } = useParams<IParams>();
  const [segmentList, setSegmentList] = useState<ISegment[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    totalPages: 1,
  });
  const [ total, setTotal ] = useState<number>(0);
  const [ searchParams, setSearchParams ] = useState<ISearchParams>({
    pageIndex: 0,
    pageSize: 10,
  });
  const history = useHistory();
  const intl = useIntl();

  const fetchSegmentLists = useCallback(() => {
    getSegmentList<ISegmentList>(projectKey, searchParams).then(async (res) => {
      const { success, data, code } = res;
        if (success && data) {
          const { content, pageable, totalPages, totalElements } = data;
          setSegmentList(content || []);
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
          setSegmentList([]);
          setPagination({
            pageIndex: 1,
            totalPages: 1,
          });

          message.error(intl.formatMessage({id: 'segments.list.error.text'}));
        }
    });
  }, [projectKey, searchParams, intl, history]);

  useEffect(() => {
    fetchSegmentLists();
  }, [fetchSegmentLists]);

  const handleAddSegment = useCallback(() => {
    history.push(`/${projectKey}/${environmentKey}/segments/new`);
  }, [history, projectKey, environmentKey]);

  const handlePageChange = useCallback((e: SyntheticEvent, data: PaginationProps) => {
    setSearchParams({
      ...searchParams,
      pageIndex: Number(data.activePage) - 1
    });
  }, [searchParams]);

  const handleSearch = debounce(useCallback((e: SyntheticEvent, data: InputOnChangeData) => {
    setSearchParams({
      ...searchParams,
      // @ts-ignore detail value
      keyword: data.value,
    });
  }, [searchParams]), 300);

	return (
    <ProjectLayout>
      <div className={styles.segments}>
        <div className={styles.card}>
          <div className={styles.heading}>
            <FormattedMessage id='common.segments.text' />
          </div>
          <div className={styles.add}>
            <Form className={styles['filter-form']}>
              <Form.Field className={styles['keywords-field']}>
                <Form.Input 
                  placeholder={intl.formatMessage({id: 'toggles.filter.search.placeholder'})} 
                  icon={<Icon customClass={styles['icon-search']} type='search' />}
                  onChange={handleSearch}
                />
              </Form.Field>
            </Form>
            <EventTracker category='segment' action='create-segment'>
              <Button primary className={styles['add-button']} onClick={handleAddSegment}>
                <Icon customClass={styles['iconfont']} type='add' />
                <FormattedMessage id='common.segment.text' />
              </Button>
            </EventTracker>
          </div>
          <div className={styles.lists}>
            <Table basic='very' unstackable>
              <Table.Header className={styles['table-header']}>
                <Table.Row>
                  <Table.HeaderCell className={styles['column-name']}>
                    <FormattedMessage id='common.name.text' />
                  </Table.HeaderCell>
                  <Table.HeaderCell className={styles['column-modify-by']}>
                    <FormattedMessage id='common.modified.by.text' />
                  </Table.HeaderCell>
                  <Table.HeaderCell className={styles['column-modify-time']}>
                    <FormattedMessage id='common.modified.time.text' />
                  </Table.HeaderCell>
                  <Table.HeaderCell className={styles['column-operation']}>
                    <FormattedMessage id='common.operation.text' />
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              {
                segmentList.length !== 0 && (
                  <Table.Body>
                    {
                      segmentList?.map((segment: ISegment) => {
                        return (
                          <SegmentItem 
                            key={segment.key}
                            segment={segment}
                            fetchSegmentLists={fetchSegmentLists}
                          />
                        );
                      })
                    }
                  </Table.Body>
                )
              }
            </Table>
            {
              segmentList.length === 0 && (
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
            segmentList.length !== 0 && (
              <div className={styles.pagination}>
                <div className={styles['total']}>
                  <span className={styles['total-count']}>{total} </span>
                  <FormattedMessage id='segments.total' />
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
      </div>
    </ProjectLayout>
	);
};

export default Segment;
