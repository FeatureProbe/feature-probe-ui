import { useCallback, SyntheticEvent, useEffect } from 'react';
import { Form, InputOnChangeData } from 'semantic-ui-react';
import cloneDeep from 'lodash/cloneDeep';
import { FormattedMessage, useIntl } from 'react-intl';
import debounce from 'lodash/debounce';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import Button from 'components/Button';
import message from 'components/MessageBox';
import FormItemName from 'components/FormItem/name';
import FormItemKey from 'components/FormItem/key';
import { hooksFormContainer, environmentContainer } from '../../provider';
import { addEnvironment, editEnvironment } from 'services/project';
import { checkEnvironmentExist } from 'services/toggle';
import { CONFLICT } from 'constants/httpCode';
import { replaceSpace } from 'utils/tools';
import styles from './index.module.scss';

interface IProps {
  open: boolean;
  isAdd: boolean;
  projectKey: string;
  handleCancel(): void;
  handleConfirm(): void;
}

const EnvironmentModal = (props: IProps) => {
  const { open, isAdd, projectKey, handleCancel, handleConfirm } = props;
  const intl = useIntl();

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    trigger,
    setError,
    clearErrors,
  } = hooksFormContainer.useContainer();

  const {
    environmentInfo,
    handleChange,
    saveEnvironmentInfo
  } = environmentContainer.useContainer();

  useEffect(() => {
    if (open) {
      clearErrors();
    } else {
      saveEnvironmentInfo({
        key: '',
        name: '',
      });
    }
  }, [open, clearErrors, saveEnvironmentInfo]);

  useEffect(() => {
    setValue('name', environmentInfo.name);
    setValue('key', environmentInfo.key);
  }, [environmentInfo, setValue]);

  const checkExist = debounce(useCallback(async (type: string, value: string) => {
    const res = await checkEnvironmentExist(projectKey, {
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

  const onSubmit = useCallback(async () => {
    let res; 

    const params = replaceSpace(cloneDeep(environmentInfo));
    if (params.name === '') {
      setError('name', {
        message: intl.formatMessage({id: 'projects.environment.name.required'})
      });
      return;
    }

    if (isAdd) {
      res = await addEnvironment(projectKey, params);
    } else {
      res = await editEnvironment(projectKey, environmentInfo.key, params);
    }

    if (res.success) {
      message.success(
        isAdd 
        ? intl.formatMessage({id: 'projects.create.environment.success'})
        : intl.formatMessage({id: 'projects.edit.environment.success'})
      );
      handleConfirm();
    } else {
      if (res.code === CONFLICT) {
        setError('key', {
          message: res.message,
        });
        return;
      }
      message.error(
        isAdd 
          ? intl.formatMessage({id: 'projects.create.environment.error'})
          : intl.formatMessage({id: 'projects.edit.environment.error'})
      );
    }
  }, [isAdd, intl, projectKey, setError, environmentInfo, handleConfirm]);

	return (
    <Modal
      open={open}
      width={480}
      footer={null}
      handleCancel={handleCancel}
      handleConfirm={() => {}}
    >
      <div className={styles.modal}>
        <div className={styles['modal-header']}>
          <span className={styles['modal-header-text']}>
            {isAdd ? intl.formatMessage({id: 'projects.create.environment'}) : intl.formatMessage({id: 'projects.edit.environment'})} 
          </span>
          <Icon customClass={styles['modal-close-icon']} type='close' onClick={handleCancel} />
        </div>
        <div className={styles['modal-content']}>
          <Form 
            autoComplete='off'
            onSubmit={handleSubmit(onSubmit)} 
          >
            <FormItemName
              className={styles.field}
              value={environmentInfo?.name}
              errors={errors}
              register={register}
              onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
                if (detail.value.length > 15 ) return;
                checkExist('NAME', detail.value);
                handleChange(e, detail, 'name');
                setValue(detail.name, detail.value);
                await trigger('name');
              }}
            />

            <FormItemKey
              value={environmentInfo?.key}
              errors={errors}
              disabled={!isAdd}
              register={register}
              showPopup={false}
              onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
                checkExist('KEY', detail.value);
                handleChange(e, detail, 'key');
                setValue(detail.name, detail.value);
                await trigger('key');
              }}
            />

            <div className={styles['footer']}>
              <Button size='mini' className={styles['btn']} type='reset' basic onClick={handleCancel}>
                <FormattedMessage id='common.cancel.text' />
              </Button>
              <Button size='mini' type='submit' primary disabled={errors.name || errors.key}>
                <FormattedMessage id='common.confirm.text' />
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Modal>
	)
}

export default EnvironmentModal;
