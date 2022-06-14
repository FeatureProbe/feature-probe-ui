import { SyntheticEvent, useState, useCallback, useEffect } from 'react';
import { Form, Button, InputOnChangeData, TextAreaProps, PaginationProps } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory, useParams, Prompt, useRouteMatch } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import cloneDeep from 'lodash/cloneDeep';
import { v4 as uuidv4 } from 'uuid';
import FormItemName from 'components/FormItem/name';
import FormItemKey from 'components/FormItem/key';
import FormItemDescription from 'components/FormItem/description';
import message from 'components/MessageBox';
import Rules from 'pages/targeting/components/Rules';
import { useBeforeUnload } from 'pages/targeting/hooks';
import ConfirmModal from '../Modal';
import { ruleContainer, hooksFormContainer, segmentContainer } from '../../provider';
import { CONFLICT } from 'constants/httpCode';
import { checkSegmentExist, getSegmentDetail, addSegment, editSegment, getSegmentUsingToggles } from 'services/segment';
import { ISegmentInfo, IToggleList, IToggle } from 'interfaces/segment';
import { SEGMENT_ADD_PATH, SEGMENT_EDIT_PATH } from 'router/routes';
import { IRule, ICondition } from 'interfaces/targeting';

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
  const intl = useIntl();
  const history = useHistory();
  const match = useRouteMatch();
  const { segmentInfo, saveSegmentInfo, handleChange } = segmentContainer.useContainer();
  const { rules, saveRules } = ruleContainer.useContainer();

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
      getSegmentDetail<ISegmentInfo>(projectKey, segmentKey).then(res => {
        const { data, success } = res;
        if (success && data) {
          saveInitialSegment({
            name: data.name,
            key: data.key,
            description: data.description,
            rules: cloneDeep(data.rules),
          });
          saveSegmentInfo(data);
          const targetRule = cloneDeep(data.rules);
          targetRule.forEach((rule: IRule) => {
            rule.conditions.forEach((condition: ICondition) => {
              condition.id = uuidv4();
            });
            rule.id = uuidv4();
          });

          saveRules(targetRule);
        } else {
          message.error(res.message || intl.formatMessage({id: 'toggles.targeting.error.text'}));
      }
      })
    }
  }, [match.path, projectKey, segmentKey, intl, saveSegmentInfo, saveRules]);

  useEffect(() => {
    const requestRules = cloneDeep(rules);
    requestRules?.forEach((rule: IRule) => {
      rule?.conditions?.forEach((condition: ICondition) => {
        // @ts-ignore
        delete condition.id;
      });
      // @ts-ignore
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
        setValue(`rule_${rule.id}_condition_${condition.id}_objects`, condition.objects);
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
        message.success(intl.formatMessage({id: 'segments.edit.error'}));
      }
    });
  }, [intl, projectKey, segmentKey, publishSegment]);

  const onSubmit = useCallback(() => {
    if (match.path === SEGMENT_ADD_PATH) {
      addSegment(projectKey, publishSegment).then(res => {
        if (res.success) {
          message.success(intl.formatMessage({id: 'segments.create.success'}));
          setPublishDisabled(true);
          handleGoBack();
        } else {
          message.success(intl.formatMessage({id: 'segments.create.error'}));
        }
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
          message.error(intl.formatMessage({id: 'toggles.list.error.text'}));
        }
      })
    }
  }, [match.path, publishSegment, projectKey, segmentKey, searchParams, intl, handleGoBack, confirmEditSegment]);

  const onError = useCallback(() => {
    console.log(errors);
  }, [errors]);

  const checkExist = debounce(useCallback(async (type: string, value: string) => {
    const res = await checkSegmentExist(projectKey, {
      type,
      value
    });

    if (res.code === CONFLICT) {
      setError(type.toLocaleLowerCase(), {
        message: res.message,
      });
      return;
    }
  }, [projectKey, setError]), 300);

  const handlePageChange = useCallback((e: SyntheticEvent, data: PaginationProps) => {
    setSearchParams({
      ...searchParams,
      pageIndex: Number(data.activePage) - 1
    });
  }, [searchParams]);

	return (
    <Form className={styles['filter-form']} autoComplete='off' onSubmit={handleSubmit(onSubmit, onError)}>
      <div className={styles['form-item']}>
        <FormItemName
          className={styles['form-item-name']}
          value={segmentInfo?.name}
          errors={errors}
          register={register}
          onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
            if (detail.value.length > 50 ) return;
            checkExist('NAME', detail.value);
            handleChange(e, detail, 'name')
            setValue(detail.name, detail.value);
            await trigger('name');
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
            checkExist('KEY', detail.value);
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
            handleChange(e, detail, 'description')
            setValue(detail.name, detail.value);
            await trigger('description');
          }}
        />
      </div>

      <div className={styles.rules}>
        <Rules
          ruleContainer={ruleContainer}
          hooksFormContainer={hooksFormContainer}
        />
      </div>

      <div id='footer' className={styles.footer}>
        <Button primary type='submit' className={styles['publish-btn']} disabled={publishDisabled}>
          <FormattedMessage id='common.publish.text' />
        </Button>
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

export default Info;
