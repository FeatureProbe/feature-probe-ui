import { SyntheticEvent, useState, useCallback, useEffect, useMemo } from 'react';
import { Form, Button, InputOnChangeData, TextAreaProps, PaginationProps, Loader, Dimmer } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory, useParams, Prompt, useRouteMatch } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import cloneDeep from 'lodash/cloneDeep';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import FormItemName from 'components/FormItem/name';
import FormItemKey from 'components/FormItem/key';
import FormItemDescription from 'components/FormItem/description';
import message from 'components/MessageBox';
import EventTracker from 'components/EventTracker';
import Rules from 'pages/targeting/components/Rules';
import { useBeforeUnload } from 'pages/targeting/hooks';
import ConfirmModal from '../Modal';
import { ruleContainer, hooksFormContainer, segmentContainer } from '../../provider';
import { CONFLICT } from 'constants/httpCode';
import { checkSegmentExist, getSegmentDetail, addSegment, editSegment, getSegmentUsingToggles } from 'services/segment';
import { ISegmentInfo, IToggleList, IToggle } from 'interfaces/segment';
import { SEGMENT_ADD_PATH, SEGMENT_EDIT_PATH } from 'router/routes';
import { IRule, ICondition } from 'interfaces/targeting';
import { DATETIME_TYPE } from 'components/Rule/constants';
import { useRequestTimeCheck } from 'hooks';
import styles from './index.module.scss';

interface IParams {
  projectKey: string;
  environmentKey: string;
  segmentKey: string;
}

interface ISearchParams {
  pageIndex: number;
  pageSize: number;
  sortBy?: string;
}

const Info = () => {
  const [ open, setOpen ] = useState<boolean>(false);
  const [ initialSegment, saveInitialSegment ] = useState<ISegmentInfo>();
  const [ publishSegment, savePublishSegment ] = useState<ISegmentInfo>();
  const [ publishDisabled, setPublishDisabled ] = useState<boolean>(true);
  const { projectKey, environmentKey, segmentKey } = useParams<IParams>();
  const [ searchParams, setSearchParams ] = useState<ISearchParams>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [toggleList, setToggleList] = useState<IToggle[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    totalPages: 1,
  });
  const [ total, setTotal ] = useState<number>(0);
  const [ isLoading, setLoading ] = useState<boolean>(false);
  const [ isPageLoading, saveIsLoading ] = useState<boolean>(false);
  const [ isKeyEdit, saveKeyEdit ] = useState<boolean>(false);
  const intl = useIntl();
  const history = useHistory();
  const match = useRouteMatch();
  const { rules, saveRules } = ruleContainer.useContainer();
  const { 
    segmentInfo,
    originSegmentInfo,
    saveSegmentInfo, 
    saveOriginSegmentInfo, 
    handleChange 
  } = segmentContainer.useContainer();

  const {
    formState: { errors },
    register,
    setValue,
    trigger,
    setError,
    handleSubmit,
  } = hooksFormContainer.useContainer();

  useBeforeUnload(!publishDisabled, intl.formatMessage({id: 'targeting.page.leave.text'}));

  useEffect(() => {
    if (match.path === SEGMENT_EDIT_PATH) {
      saveIsLoading(true);
      getSegmentDetail<ISegmentInfo>(projectKey, segmentKey).then(res => {
        const { data, success } = res;
        saveIsLoading(false);
        if (success && data) {
          saveInitialSegment({
            name: data.name,
            key: data.key,
            description: data.description,
            rules: cloneDeep(data.rules),
          });
          saveSegmentInfo(cloneDeep(data));
          saveOriginSegmentInfo(cloneDeep(data));
          const targetRule = cloneDeep(data.rules);
          targetRule.forEach((rule: IRule) => {
            rule.id = uuidv4();
            rule.conditions.forEach((condition: ICondition) => {
              condition.id = uuidv4();
              if (condition.type === DATETIME_TYPE && condition.objects) {
                condition.datetime = condition.objects[0].slice(0, 19);
                condition.timezone = condition.objects[0].slice(19);
              }
            });
          });

          saveRules(targetRule);
        } else {
          message.error(res.message || intl.formatMessage({id: 'toggles.targeting.error.text'}));
      }
      });
    }
  }, [match.path, projectKey, segmentKey, intl, saveSegmentInfo, saveOriginSegmentInfo, saveRules]);

  useEffect(() => {
    const requestRules = cloneDeep(rules);
    requestRules?.forEach((rule: IRule) => {
      rule?.conditions?.forEach((condition: ICondition) => {
        delete condition.id;

        if (condition.type === DATETIME_TYPE) {
          const result = [];
          result.push('' + condition.datetime + condition.timezone);
          condition.objects = result;
          delete condition.datetime;
          delete condition.timezone;
        }
      });
      delete rule.id;
    });

    savePublishSegment({
      name: segmentInfo.name,
      key: segmentInfo.key,
      description: segmentInfo.description,
      rules: requestRules
    });
  }, [segmentInfo, rules]);

  useEffect(() => {
    setValue('name', segmentInfo?.name);
    setValue('key', segmentInfo?.key);

    rules.forEach((rule: IRule) => {
      rule.conditions?.forEach((condition: ICondition) => {
        setValue(`rule_${rule.id}_condition_${condition.id}_subject`, condition.subject);
        setValue(`rule_${rule.id}_condition_${condition.id}_predicate`, condition.predicate);
        if (condition.type === DATETIME_TYPE) {
          if (condition.objects) {
            setValue(`rule_${rule.id}_condition_${condition.id}_datetime`, condition.objects[0].slice(0, 19));
            setValue(`rule_${rule.id}_condition_${condition.id}_timezone`, condition.objects[0].slice(19));
          } else {
            setValue(`rule_${rule.id}_condition_${condition.id}_datetime`, moment().format().slice(0, 19));
            setValue(`rule_${rule.id}_condition_${condition.id}_timezone`, moment().format().slice(19));
          }
        } else {
          setValue(`rule_${rule.id}_condition_${condition.id}_objects`, condition.objects);
        }
      });
    });

  }, [rules, segmentInfo, setValue]);

  useEffect(() => {
    const isSame = isEqual(initialSegment, publishSegment);
    setPublishDisabled(isSame);
  }, [initialSegment, publishSegment]);

  const handleGoBack = useCallback(() => {
    history.push(`/${projectKey}/${environmentKey}/segments`);
  }, [history, projectKey, environmentKey]);

  const confirmEditSegment = useCallback(() => {
    editSegment(projectKey, segmentKey, publishSegment).then(res => {
      if (res.success) {
        message.success(intl.formatMessage({id: 'segments.edit.success'}));
        setPublishDisabled(true);
      } else {
        message.error(intl.formatMessage({id: 'segments.edit.error'}));
      }
    });
  }, [intl, projectKey, segmentKey, publishSegment]);

  const onSubmit = useCallback(() => {
    setLoading(true);
    if (match.path === SEGMENT_ADD_PATH) {
      addSegment(projectKey, publishSegment).then(res => {
        if (res.success) {
          message.success(intl.formatMessage({id: 'segments.create.success'}));
          setPublishDisabled(true);
          handleGoBack();
        } else {
          message.error(intl.formatMessage({id: 'segments.create.error'}));
        }
        setLoading(false);
      });
    } else {
      getSegmentUsingToggles<IToggleList>(projectKey, segmentKey, searchParams).then((res) => {
        const { success, data } = res;
        if (success && data) {
          const { content, pageable, totalPages, totalElements } = data;
          setToggleList(content);
          setPagination({
            pageIndex: pageable.pageNumber + 1,
            totalPages,
          });
          setTotal(totalElements);
          if (totalElements > 0) {
            setOpen(true);
          } else {
            confirmEditSegment();
          }
        } else {
          setToggleList([]);
          setPagination({
            pageIndex: 1,
            totalPages: 1,
          });
          setTotal(0);
          message.error(intl.formatMessage({id: 'toggles.list.error.text'}));
        }
        setLoading(false);
      });
    }
  }, [match.path, publishSegment, projectKey, segmentKey, searchParams, intl, handleGoBack, confirmEditSegment]);

  const creatRequestTimeCheck = useRequestTimeCheck();
  
  const debounceNameExist = useMemo(() => {
    return debounce(async (type:string, value: string) => {
      const check = creatRequestTimeCheck('name');
      const res = await checkSegmentExist(projectKey, {
        type,
        value
      });

      if(!check()) {
        return;
      }

      if (res.code === CONFLICT) {
        setError(type.toLocaleLowerCase(), {
          message: res.message,
        });
      }

    }, 500);
  }, [creatRequestTimeCheck, projectKey, setError]);

  const debounceKeyExist = useMemo(() => {
    return debounce(async (type:string, value: string) => {
      const check = creatRequestTimeCheck('key');
      const res = await checkSegmentExist(projectKey, {
        type,
        value
      });

      if(!check()) {
        return;
      }

      if (res.code === CONFLICT) {
        setError(type.toLocaleLowerCase(), {
          message: res.message,
        });
      }
    }, 500);
  }, [creatRequestTimeCheck, projectKey, setError]);

  const checkNameExist = useCallback(async (type: string, value: string) => {
    await debounceNameExist(type, value);
  }, [debounceNameExist]);

  const checkKeyExist = useCallback(async (type: string, value: string) => {
    await debounceKeyExist(type, value);
  }, [debounceKeyExist]);

  const handlePageChange = useCallback((e: SyntheticEvent, data: PaginationProps) => {
    setSearchParams({
      ...searchParams,
      pageIndex: Number(data.activePage) - 1
    });
  }, [searchParams]);

	return (
    <>
      {
        isPageLoading ? (
          <Dimmer Dimmer active inverted>
            <Loader size='small'>
              <FormattedMessage id='common.loading.text' />
            </Loader>
          </Dimmer>
        ) : (
          <Form className={styles['filter-form']} autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <div className={styles['form-item']}>
              <FormItemName
                className={styles['form-item-name']}
                value={segmentInfo?.name}
                errors={errors}
                register={register}
                onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
                  if (detail.value.length > 50 ) return;
                  if (detail.value !== originSegmentInfo.name) {
                    checkNameExist('NAME', detail.value);
                  }
                  handleChange(e, detail, 'name');
                  setValue(detail.name, detail.value);
                  await trigger('name');
                  
                  if (isKeyEdit || match.path === SEGMENT_EDIT_PATH) {
                    return;
                  }

                  const reg = /[^A-Z0-9._-]+/gi;
                  const keyValue = detail.value.replace(reg, '_');
                  handleChange(e, {...detail, value: keyValue}, 'key');
                  checkKeyExist('KEY', keyValue);
                  setValue('key', keyValue);
                  await trigger('key');
                }}
              />

              <FormItemKey
                className={styles['form-item-key']}
                value={segmentInfo?.key}
                errors={errors}
                disabled={match.path === SEGMENT_EDIT_PATH}
                register={register}
                showPopup={false}
                onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
                  saveKeyEdit(true);
                  checkKeyExist('KEY', detail.value);
                  handleChange(e, detail, 'key');
                  setValue(detail.name, detail.value);
                  await trigger('key');
                }}
              />
            </div>
            
            <div className={styles['form-item-description']}>
              <FormItemDescription
                value={segmentInfo?.description}
                disabled={false}
                onChange={async (e: SyntheticEvent, detail: TextAreaProps) => {
                  if (('' + detail.value).length > 500 ) return;
                  handleChange(e, detail, 'description');
                  setValue(detail.name, detail.value);
                  await trigger('description');
                }}
              />
            </div>

            <div className={styles.rules}>
              <Rules
                useSegment={false}
                ruleContainer={ruleContainer}
                hooksFormContainer={hooksFormContainer}
              />
            </div>

            <div id='footer' className={styles.footer}>
              <EventTracker category='segment' action='publish-segment'>
                <Button primary type='submit' className={styles['publish-btn']} disabled={publishDisabled || Object.keys(errors).length !== 0}>
                  {
                    isLoading && <Loader inverted active inline size='tiny' className={styles['publish-btn-loader']} />
                  }
                  <FormattedMessage id='common.publish.text' />
                </Button>
              </EventTracker>
              
              <Button basic type='reset' onClick={handleGoBack}>
                <FormattedMessage id='common.cancel.text' />
              </Button>
            </div>

            <ConfirmModal 
              open={open}
              total={total}
              setOpen={setOpen}
              toggleList={toggleList}
              pagination={pagination}
              handlePageChange={handlePageChange}
              confirmEditSegment={confirmEditSegment}
            />

            <Prompt
              when={!publishDisabled}
              message={intl.formatMessage({id: 'targeting.page.leave.text'})}
            />
          </Form>
        )
      }
    </>
    
	);
};

export default Info;
