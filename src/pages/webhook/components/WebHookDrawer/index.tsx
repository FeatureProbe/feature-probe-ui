import { useEffect, useCallback, useState } from 'react';
import {
  Checkbox,
  Form,
} from 'semantic-ui-react';
import classNames from 'classnames';
import { FormattedMessage, useIntl } from 'react-intl';
import message from 'components/MessageBox';
import Button from 'components/Button';
import Icon from 'components/Icon';

import styles from './index.module.scss';
import { hooksFormContainer, webHookInfoContainer } from 'pages/webhook/provider';
import FormItem from 'components/FormItem';
import { IWebHook, WebHookStatus } from 'interfaces/webhook';
import { createWebHook, updateWebHook } from 'services/webhook';

interface IProps {
  defaultValue?: IWebHook;
  isAdd: boolean;
  visible: boolean;
  onClose: () => void;
  refresh: () => void;
}

const WebHookDrawer = (props: IProps) => {
  const { isAdd, visible, onClose, defaultValue, refresh } = props;
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const intl = useIntl();

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    trigger,
    clearErrors
  } = hooksFormContainer.useContainer();

  const { webHookInfo, handleChange, saveWebHookInfo, saveOriginWebHookInfo } = webHookInfoContainer.useContainer();

  useEffect(() => {
    register('url', {
      required: {
        message: intl.formatMessage({ id: 'webhook.url.required' }),
        value: true,
      },
      pattern: {
        message: intl.formatMessage({ id: 'webhook.url.error.text' }),
        value: /^((ht|f)tps?):\/\/[\w-]+(.[\w-]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?$/,
      },
    });
    register('name', {
      required: {
        message: intl.formatMessage({ id: 'common.name.required' }),
        value: true,
      },
    });
  }, [register, intl]);

  const drawerCls = classNames(styles['webhook-drawer'], {
    [styles['webhook-drawer-inactive']]: visible,
  });

  const formCls = classNames(styles['webhook-drawer-form'], {
    [styles['webhook-drawer-form-inactive']]: visible,
  });

  const onSubmit = useCallback(() => {
    (async () => {
      try {
        let res;
        setSubmitLoading(true);
        if(isAdd) {
          res = await createWebHook(webHookInfo);
        } else {
          res = await updateWebHook('' + defaultValue?.id, webHookInfo);
        }
        if(res.success) {
          message.success(intl.formatMessage({id: 'webhook.create.success'}));
          refresh();
          onClose();
        } else {
          message.error(res.message || intl.formatMessage({id: 'webhook.create.failed'}));
        }
      } catch(err) {
        message.error(intl.formatMessage({id: 'webhook.create.failed'}));
      } finally {
        setSubmitLoading(false);
      }
    })();
  }, [isAdd, webHookInfo, defaultValue?.id, intl, refresh, onClose]);

  useEffect(() => {
    if(visible && defaultValue) {
      saveOriginWebHookInfo(defaultValue);
      saveWebHookInfo(defaultValue);
      setValue('name', defaultValue.name);
      setValue('description', defaultValue.description);
      setValue('application', defaultValue.application);
      setValue('url', defaultValue.url);
    }
  }, [visible, webHookInfo, defaultValue, saveOriginWebHookInfo, saveWebHookInfo, setValue]);

  return (
    <div className={drawerCls}>
      <Form onSubmit={handleSubmit(onSubmit)} className={formCls} autoComplete="off">
        <div className={styles.title}>
          <div className={styles['title-left']}>
            {isAdd
              ? intl.formatMessage({ id: 'projects.create.project' })
              : intl.formatMessage({ id: 'projects.edit.project' })}
          </div>
          <Button disabled={Object.keys(errors).length !== 0 || submitLoading} loading={submitLoading} size="mini" primary type="submit">
            {isAdd ? intl.formatMessage({ id: 'common.create.text' }) : intl.formatMessage({ id: 'common.save.text' })}
          </Button>
          <div className={styles.divider}></div>
          <Icon
            customclass={styles['title-close']}
            type="close"
            onClick={() => {
              clearErrors();
              onClose();
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
                checked={webHookInfo.status === WebHookStatus.ENABLE}
                toggle
                onChange={(e, detail) => handleChange(e, detail, 'status')}
              />
            </div>
          </Form.Field>
          <FormItem error={errors.name} label={<FormattedMessage id="common.name.text" />} required>
            <Form.Input
              className={styles.input}
              name="name"
              value={webHookInfo.name}
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
              value={webHookInfo.description}
              placeholder={intl.formatMessage({ id: 'common.description.required' })}
              error={errors.description ? true : false}
              onChange={(e, detail) => {
                handleChange(e, detail, 'description');
              }}
            />
          </FormItem>
          <FormItem error={errors.url} label={<FormattedMessage id="webhook.url.text" />} required>
            <Form.Input
              name="url"
              className={styles.input}
              value={webHookInfo.url}
              placeholder={intl.formatMessage({ id: 'common.description.required' })}
              error={errors.url ? true : false}
              onChange={(e, detail) => {
                setValue('url', detail.value);
                handleChange(e, detail, 'url');
                trigger('url');
              }}
            />
          </FormItem>
          <div className={styles['url-normal-tips']}>
              <FormattedMessage id='webhook.url.normal.text' />
            </div>
        </div>
      </Form>
    </div>
  );
};

export default WebHookDrawer;
