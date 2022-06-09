import { SyntheticEvent, useEffect, useCallback } from 'react';
import { 
  Form,
  InputOnChangeData,
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
import { projectContainer, hooksFormContainer } from '../../provider';
import { replaceSpace } from 'utils/tools';
import { CONFLICT } from 'constants/httpCode';

import styles from './index.module.scss';

interface IProps {
  isAdd: boolean;
  visible: boolean;
  projectKey: string;
  setDrawerVisible(visible: boolean): void;
  refreshProjectsList(): void;
}

const ProjectDrawer = (props: IProps) => {
  const { isAdd, visible, projectKey, setDrawerVisible, refreshProjectsList } = props;
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

  const { projectInfo, handleChange, saveProjectInfo } = projectContainer.useContainer();

  const drawerCls = classNames(
    styles['project-drawer'], {
      [styles['project-drawer-inactive']]: visible
    }
  );

  const formCls = classNames(
    styles['project-drawer-form'], {
      [styles['project-drawer-form-inactive']]: visible
    }
  )

  useEffect(() => {
    if (visible) {
      clearErrors();
    } else {
      saveProjectInfo({
        key: '',
        name: '',
        description: ''
      })
    }
  }, [visible, clearErrors, saveProjectInfo])

  useEffect(() => {
    setValue('name', projectInfo.name);
    setValue('key', projectInfo.key);
  }, [projectInfo, setValue]);

  const checkExist = useCallback(debounce(async (type: string, value: string) => {
    const res = await checkProjectExist({
      type,
      value
    });

    if (res.code === CONFLICT) {
      setError(type.toLocaleLowerCase(), {
        message: res.message,
      });
      return;
    }
  }, 300), []);

  const onSubmit = useCallback(async () => {
    let res;
    const params = replaceSpace(cloneDeep(projectInfo));
    if (params.name === '') {
      setError('name', {
        message: intl.formatMessage({id: 'projects.name.required'}),
      });
      return;
    }

    if (isAdd) {
      res = await addProject(params);
    } else {
      res = await editProject(projectKey, params);
    }

    if (res.success) {
      message.success(isAdd 
        ? intl.formatMessage({id: 'projects.create.success'}) 
        : intl.formatMessage({id: 'projects.edit.success'})
      );
      refreshProjectsList();
      setDrawerVisible(false);
    } else {
      if (res.code === CONFLICT) {
        setError('key', {
          message: res.message,
        });
        return;
      }
      message.error(isAdd 
        ? intl.formatMessage({id: 'projects.create.error'}) 
        : intl.formatMessage({id: 'projects.edit.error'})
      );
    }
  }, [isAdd, projectInfo, projectKey, setError, intl, setDrawerVisible, refreshProjectsList]);

	return (
    <div className={drawerCls}>
      <Form 
        className={formCls}
        autoComplete='off'
        onSubmit={handleSubmit(onSubmit)} 
      >
        <div className={styles.title}>
          <div className={styles['title-left']}>
            { isAdd ? intl.formatMessage({id: 'projects.create.project'}) : intl.formatMessage({id: 'projects.edit.project'}) }
          </div>
          <Button size='mini' basic type='reset' className={styles['btn-cancel']} onClick={() => {setDrawerVisible(false)}}>
            <FormattedMessage id='common.cancel.text' />
          </Button>
          <Button size='mini' primary type='submit' disabled={errors.name || errors.key}>
            {
              isAdd ? intl.formatMessage({id: 'common.create.text'}) : intl.formatMessage({id: 'common.save.text'})
            }
          </Button>
          <div className={styles.divider}></div>
          <Icon customClass={styles['title-close']} type='close' onClick={() => setDrawerVisible(false)} />
        </div>
        <div className={styles['project-drawer-form-content']}>
          <FormItemName
            className={styles.formItem}
            value={projectInfo?.name}
            errors={errors}
            register={register}
            onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
              if (detail.value.length > 50 ) return;
              if (isAdd) {
                checkExist('NAME', detail.value);
              }
              handleChange(e, detail, 'name')
              setValue(detail.name, detail.value);
              await trigger('name');
            }}
          />

          <FormItemKey
            className={styles.formItem}
            value={projectInfo?.key}
            errors={errors}
            disabled={!isAdd}
            register={register}
            showPopup={false}
            onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
              if (isAdd) {
                checkExist('KEY', detail.value);
              }
              handleChange(e, detail, 'key');
              setValue(detail.name, detail.value);
              await trigger('key');
            }}
          />

          <FormItemDescription
            className={styles.formItem}
            value={projectInfo?.desc}
            disabled={!isAdd}
            onChange={async (e: SyntheticEvent, detail: TextAreaProps) => {
              if (('' + detail.value).length > 500 ) return;
              handleChange(e, detail, 'description')
              setValue(detail.name, detail.value);
              await trigger('description');
            }}
          />
        </div>
      </Form>
    </div>
	)
}

export default ProjectDrawer;