import { SyntheticEvent, useEffect, useCallback, useState, useMemo, FormEvent } from 'react';
import {
  Checkbox,
  CheckboxProps,
  Dropdown,
  Form,
  FormField,
  InputOnChangeData,
  Popup,
  Select,
  TextAreaProps,
} from 'semantic-ui-react';
import classNames from 'classnames';
import { FormattedMessage, useIntl } from 'react-intl';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import message from 'components/MessageBox';
import Button from 'components/Button';
import Icon from 'components/Icon';
import FormItemName from 'components/FormItem/name';
import FormItemKey from 'components/FormItem/key';
import FormItemDescription from 'components/FormItem/description';
import { addProject, checkProjectExist, editProject } from 'services/project';
import { replaceSpace } from 'utils/tools';
import { CONFLICT } from 'constants/httpCode';
import { useRequestTimeCheck } from 'hooks';

import styles from './index.module.scss';
import { hooksFormContainer, webHookInfoContainer } from 'pages/webhook/provider';
import FormItem from 'components/FormItem';

interface IProps {
  isAdd: boolean;
  visible: boolean;
  setDrawerVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const WebHookDrawer = (props: IProps) => {
  const { isAdd, visible, setDrawerVisible } = props;
  const [isKeyEdit, saveKeyEdit] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const intl = useIntl();

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    trigger,
    setError,
    clearErrors,
    getValues,
    reset,
  } = hooksFormContainer.useContainer();

  const { webHookInfo, handleChange } = webHookInfoContainer.useContainer();

  const drawerCls = classNames(styles['webhook-drawer'], {
    [styles['webhook-drawer-inactive']]: visible,
  });

  const formCls = classNames(styles['webhook-drawer-form'], {
    [styles['webhook-drawer-form-inactive']]: visible,
  });

  const onSubmit = useCallback(() => {
    console.log(webHookInfo);
  }, [webHookInfo]);

  const applicationOptions = [
    { key: 'slack', value: 'slack', text: 'Slack' },
    { key: 'dd', value: 'dd', text: intl.formatMessage({ id: 'common.dingding.text' }) },
    { key: 'wx', value: 'wx', text: intl.formatMessage({ id: 'common.weixin.text' }) },
  ];

  return (
    <div className={drawerCls}>
      <Form onSubmit={handleSubmit(onSubmit)} className={formCls} autoComplete="off">
        <div className={styles.title}>
          <div className={styles['title-left']}>
            {isAdd
              ? intl.formatMessage({ id: 'projects.create.project' })
              : intl.formatMessage({ id: 'projects.edit.project' })}
          </div>
          <Button disabled={Object.keys(errors).length !== 0} loading={submitLoading} size="mini" primary type="submit">
            {isAdd ? intl.formatMessage({ id: 'common.create.text' }) : intl.formatMessage({ id: 'common.save.text' })}
          </Button>
          <div className={styles.divider}></div>
          <Icon
            customclass={styles['title-close']}
            type="close"
            onClick={() => {
              setDrawerVisible(false);
            }}
          />
        </div>
        <div className={styles['webhook-drawer-form-content']}>
          <Form.Field>
            <label>
              <span className={styles['label-required']}>*</span>
              <FormattedMessage id="toggles.filter.status" />
            </label>
            <div className={styles['webhook-info-status']}>
              <Checkbox
                checked={webHookInfo.status}
                toggle
                onChange={(e, detail) => handleChange(e, detail, 'status')}
              />
            </div>
          </Form.Field>
          <FormItem error={errors.name} label={<FormattedMessage id="common.name.text" />} required>
            <Form.Input
              className={styles.input}
              {...register('name', {
                required: {
                  message: intl.formatMessage({ id: 'common.name.required' }),
                  value: true,
                },
              })}
              placeholder={intl.formatMessage({ id: 'common.name.required' })}
              error={errors.name ? true : false}
              onChange={(e, detail) => {
                setValue('name', detail.value);
                handleChange(e, detail, 'name');
                trigger('name');
              }}
            />
          </FormItem>
          <FormItem label={<FormattedMessage id="common.description.text" />}>
            <Form.Input
              name="description"
              className={styles.input}
              placeholder={intl.formatMessage({ id: 'common.description.required' })}
              error={errors.description ? true : false}
              onChange={(e, detail) => {
                handleChange(e, detail, 'description');
              }}
            />
          </FormItem>
          <FormItem
            errorCss={{
              marginTop: 0,
            }}
            error={errors.application}
            label={<FormattedMessage id="webhook.application.text" />}
            required
          >
            <Select
              floating
              {...register('application', {
                required: {
                  value: true,
                  message: intl.formatMessage({ id: 'webhook.application.required' }),
                },
              })}
              placeholder={intl.formatMessage({ id: 'toggles.returntype.placeholder' })}
              className={styles['dropdown']}
              disabled={!isAdd}
              options={applicationOptions}
              error={errors.application ? true : false}
              icon={<Icon customclass={styles['angle-down']} type="angle-down" />}
              onChange={(e, detail) => {
                setValue('application', detail.value);
                handleChange(e, detail, 'application');
                trigger('application');
              }}
            />
          </FormItem>
          <FormItem error={errors.url} label={<FormattedMessage id="webhook.url.text" />} required>
            <Form.Input
              {...register('url', {
                required: {
                  message: intl.formatMessage({ id: 'webhook.url.required' }),
                  value: true,
                },
                pattern: {
                  message: 'test url',
                  value: /^((ht|f)tps?):\/\/[\w-]+(.[\w-]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?$/,
                },
              })}
              className={styles.input}
              placeholder={intl.formatMessage({ id: 'common.description.required' })}
              error={errors.url ? true : false}
              onChange={(e, detail) => {
                setValue('url', detail.value);
                handleChange(e, detail, 'url');
                trigger('url');
              }}
            />
          </FormItem>
          <FormItem label={<FormattedMessage id="common.event.text" />} required>
            <div className={styles['radio-group']}>
              <Form.Radio
                name="webhook-all"
                label={intl.formatMessage({ id: 'webhook.all.text' })}
                className={styles['radio-group-item']}
                checked={webHookInfo.event === 'all'}
                value="all"
                onChange={(e: FormEvent, detail: CheckboxProps) => handleChange(e, detail, 'event')}
              />
              <Form.Radio
                name="webhook-custom"
                label={intl.formatMessage({ id: 'webhook.custom.text' })}
                className={styles['radio-group-item']}
                checked={webHookInfo.event === 'custom'}
                value="custom"
                onChange={(e: FormEvent, detail: CheckboxProps) => handleChange(e, detail, 'event')}
              />
            </div>
          </FormItem>
        </div>
      </Form>
    </div>
  );
};

export default WebHookDrawer;
