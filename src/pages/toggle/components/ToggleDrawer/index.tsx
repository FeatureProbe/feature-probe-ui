import { SyntheticEvent, FormEvent, useEffect, useState, useCallback } from 'react';
import { 
  Form,
  Popup,
  Dropdown,
  Select,
  FormField,
  DropdownProps,
  InputOnChangeData,
  TextAreaProps,
  CheckboxProps,
  DropdownItemProps,
} from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import { FormattedMessage, useIntl } from 'react-intl';
import message from 'components/MessageBox';
import Button from 'components/Button';
import Variations from 'components/Variations';
import Icon from 'components/Icon';
import FormItemName from 'components/FormItem/name';
import FormItemKey from 'components/FormItem/key';
import FormItemDescription from 'components/FormItem/description';
import { variationContainer, toggleInfoContainer, hooksFormContainer } from '../../provider';
import { VariationColors } from 'constants/colors';
import { CONFLICT } from 'constants/httpCode';
import { replaceSpace } from 'utils/tools';
import { initVariations, initBooleanVariations, returnTypeOptions } from './constants';
import { IVariation } from 'interfaces/targeting';
import { ITag, ITagOption } from 'interfaces/project';
import { createToggle, getTags, addTag, editToggle, checkToggleExist } from 'services/toggle';

import styles from './index.module.scss';

interface IParams {
  isAdd: boolean;
  visible: boolean;
  environmentKey?: string;
  setDrawerVisible: (visible: boolean) => void;
  refreshToggleList: () => void
}

interface ILocationParams {
  projectKey: string;
  environmentKey: string;
}

const Drawer = (props: IParams) => {
  const { isAdd, visible, setDrawerVisible, refreshToggleList } = props;
  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    trigger,
    setError,
    clearErrors,
    getValues,
  } = hooksFormContainer.useContainer();

  const { projectKey } = useParams<ILocationParams>();
  const { variations, saveVariations } = variationContainer.useContainer();
  const { toggleInfo, handleChange, saveToggleInfo } = toggleInfoContainer.useContainer();
  const [ tagsOptions, saveTagsOptions ] = useState<ITagOption[]>([]);
  const [ isKeyEdit, saveKeyEdit ] = useState<boolean>(false);
  const intl = useIntl();

  const options = variations?.map((item: IVariation, index: number) => {
    const text = item.name || item.value || `variation ${index + 1}`
    return {
      text,
      value: index,
      content: (
        <div>
          <span style={{ background: VariationColors[index % 20] }} className={styles['variation-name-color']}></span>
          <span>{ text }</span>
        </div>
      ),
    }
  });

  const getTagList = useCallback(async () => {
    const res = await getTags<ITag[]>(projectKey);
    const { success, data } = res;
    if (success && data) {
      const tags = data.map((item: ITag) => {
        return {
          key: item.name,
          text: item.name,
          value: item.name,
        }
      });
      saveTagsOptions(tags);
    } else {
      message.error(intl.formatMessage({id: 'tags.list.error'}));
    }
  }, [intl, projectKey]);

  useEffect(() => {
    if (visible) {
      clearErrors();
      getTagList();
      saveKeyEdit(false);
    } else {
      saveToggleInfo({
        name: '',
        key: '',
        desc: '',
        tags: [],
        clientAvailability: false,
        returnType: 'boolean',
        disabledServe: 0
      });
    }
  }, [visible, clearErrors, getTagList, saveToggleInfo])

  useEffect(() => {
    setValue('name', toggleInfo.name);
    setValue('key', toggleInfo.key);
    setValue('returnType', toggleInfo.returnType);

    if (toggleInfo.disabledServe < variations.length) {
      setValue('disabledServe', toggleInfo.disabledServe);
      clearErrors('disabledServe');
    } else {
      setError('disabledServe', {
        message: intl.formatMessage({id: 'targeting.disabled.return.value.required'})
      });
      setValue('disabledServe', null);
    }

    variations.forEach((variation: IVariation) => {
      setValue(`variation_${variation.id}`, variation.value);
    });

  }, [intl, toggleInfo, variations, setValue, setError, clearErrors]);

  useEffect(() => {
    if (isAdd) {
      if (toggleInfo.returnType === 'boolean') {
        saveVariations(cloneDeep(initBooleanVariations));
      } else {
        saveVariations(cloneDeep(initVariations));
      }
    }
  }, [isAdd, toggleInfo.returnType, saveVariations]);

  const onSubmit = useCallback(async () => {
    let res;
    const params = replaceSpace(cloneDeep(toggleInfo));
    const clonevariations = cloneDeep(variations);
    clonevariations.forEach((variation: IVariation) => {
      // @ts-ignore
      delete variation.id;
    })

    if (isAdd) {
      res = await createToggle(projectKey, {
        variations: clonevariations,
        ...params
      });
    } else {
      res = await editToggle(projectKey, toggleInfo.key, {
        variations: clonevariations,
        ...params
      });
    }

    if (res.success) {
      message.success(
        isAdd ? intl.formatMessage({id: 'toggles.create.success'}) : intl.formatMessage({id: 'toggles.edit.success'})
      );
      setDrawerVisible(false);
      refreshToggleList();
    } else {
      if (res.code === CONFLICT) {
        setError('key', {
          message: res.message
        });
        return;
      }
      message.error(
        isAdd ? intl.formatMessage({id: 'toggles.create.error'}) : intl.formatMessage({id: 'toggles.edit.error'})
      );
    }
  }, [intl, isAdd, projectKey, refreshToggleList, setDrawerVisible, setError, toggleInfo, variations]);

  const handleAddTag = useCallback(async (e: SyntheticEvent, detail: DropdownProps) => {
    const res = await addTag(projectKey, {
      name: detail.value?.toString() || '',
    });
    
    if (res.success) {
      getTagList();
    } else {
      message.error(intl.formatMessage({id: 'tags.add.error'}));
    }
  }, [intl, projectKey, getTagList]);

  const renderLabel = useCallback((label: DropdownItemProps) => {
    return ({
      content: label.text,
      removeIcon: <Icon customClass={styles['dropdown-remove-icon']} type='close' />,
    });
  }, []);

  const onError = useCallback(() => {
    console.log(errors);
  }, [errors]);

  const clearVariationErrors = useCallback(() => {
   for(let key in getValues()) {
      if (key.startsWith(`variation_`)) {
        clearErrors(key);
      }
    }
  }, [getValues, clearErrors]);

  const checkExist = debounce(useCallback(async (type: string, value: string) => {
    const res = await checkToggleExist(projectKey, {
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

	return (
    <div className={`${styles['toggle-drawer']} ${visible && styles['toggle-drawer-inactive']}`}>
      <Form 
        autoComplete='off'
        onSubmit={handleSubmit(onSubmit, onError)} 
        className={`${styles['toggle-drawer-form']} ${visible && styles['toggle-drawer-form-inactive']}`}
      >
        <div className={styles.title}>
          <div className={styles['title-left']}>
            { isAdd ? <FormattedMessage id='toggles.create.toggle' /> : <FormattedMessage id='toggles.edit.toggle' /> }
          </div>
          <Button 
            basic 
            size='mini' 
            type='reset' 
            className={styles['btn-cancel']} 
            onClick={() => {setDrawerVisible(false)}}
          >
            <FormattedMessage id='common.cancel.text' />
          </Button>
          <Button size='mini' primary type='submit' disabled={Object.keys(errors).length !== 0}>
            {
              isAdd ? <FormattedMessage id='common.create.text' /> : <FormattedMessage id='common.save.text' />
            }
          </Button>
          <div className={styles.divider}></div>
          <Icon customClass={styles['title-close']} type='close' onClick={() => setDrawerVisible(false)} />
        </div>
        <div className={styles['toggle-drawer-form-content']}>

          <FormItemName
            className={styles.input}
            value={toggleInfo?.name}
            errors={errors}
            register={register}
            size='mini'
            onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
              if (detail.value.length > 50 ) return;
              if (isAdd) {
                checkExist('NAME', detail.value);
              }
              handleChange(e, detail, 'name')
              setValue(detail.name, detail.value);
              await trigger('name');

              if (isKeyEdit || !isAdd) {
                return;
              }

              const reg = /[^A-Z0-9._-]+/gi;
              const keyValue = detail.value.replace(reg, '_');
              handleChange(e, {...detail, value: keyValue}, 'key');
              setValue('key', keyValue);
              await trigger('key');
            }}
          />

          <FormItemKey
            size='mini'
            className={styles.input}
            value={toggleInfo?.key}
            errors={errors}
            disabled={!isAdd}
            register={register}
            showPopup={true}
            popupText={intl.formatMessage({id: 'toggles.key.tips'})}
            onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
              saveKeyEdit(true);
              if (isAdd) {
                checkExist('KEY', detail.value);
              }
              handleChange(e, detail, 'key');
              setValue(detail.name, detail.value);
              await trigger('key');
            }}
          />

          <FormItemDescription
            size='mini'
            className={styles.input}
            value={toggleInfo?.desc}
            disabled={!isAdd}
            onChange={async (e: SyntheticEvent, detail: TextAreaProps) => {
              if (('' + detail.value).length > 500 ) return;
              handleChange(e, detail, 'desc')
              setValue(detail.name, detail.value);
              await trigger('desc');
            }}
          />

          <Form.Field>
            <label>
              <FormattedMessage id='common.tags.text' />
            </label>
            <Dropdown
              fluid
              search
              multiple
              selection
              floating
              allowAdditions
              size='mini'
              className={`${styles['dropdown']} ${styles['input']}`}
              placeholder={intl.formatMessage({id: 'common.tags.placeholder'})}
              options={tagsOptions}
              value={toggleInfo?.tags}
              icon={
                <Icon customClass={styles['angle-down']} type='angle-down' />
              }
              onAddItem={handleAddTag}
              onChange={(e: SyntheticEvent, detail: DropdownProps) => handleChange(e, detail, 'tags')}
              renderLabel={renderLabel}
            />
          </Form.Field>

          <Form.Field>
            <label>
              <FormattedMessage id='toggles.sdk.type' />
            </label>
            <div className={styles['radio-group']}>
              <Form.Radio
                name="yes"
                label={intl.formatMessage({id: 'toggles.sdk.yes'})}
                className={styles['radio-group-item']}
                checked={!!toggleInfo?.clientAvailability}
                onChange={(e: FormEvent, detail: CheckboxProps) => handleChange(e, detail, 'clientAvailability')} 
              />
              <Form.Radio 
                name="no"
                label={intl.formatMessage({id: 'toggles.sdk.no'})}
                className={styles['radio-group-item']}
                checked={!toggleInfo?.clientAvailability}
                onChange={(e: FormEvent, detail: CheckboxProps) => handleChange(e, detail, 'clientAvailability')} 
              />
            </div>
          </Form.Field>
          
          <Form.Field>
            <label>
              <span className={styles['label-required']}>*</span>
              <FormattedMessage id='toggles.returntype' />
              <Popup
                inverted
                trigger={
                  <Icon customClass={styles['icon-question']} type='question' />
                }
                content={intl.formatMessage({id: 'toggles.returntype.tips'})}
                position='top center'
                className={styles.popup}
              />
            </label>
            <Select 
              floating
              placeholder={intl.formatMessage({id: 'toggles.returntype.placeholder'})}
              {
                ...register('returnType', { 
                  required: true, 
                })
              }
              className={styles['dropdown']}
              disabled={!isAdd}
              error={ errors.returnType ? true : false }
              onChange={async (e: SyntheticEvent, detail: DropdownProps) => {
                clearVariationErrors();
                handleChange(e, detail, 'returnType');
                setValue(detail.name, detail.value);
                await trigger('returnType');
              }}
              value={toggleInfo?.returnType}
              options={returnTypeOptions} 
              icon={
                <Icon customClass={styles['angle-down']} type='angle-down' />
              }
            />
          </Form.Field>
          { 
            errors.returnType && (
              <div className={styles['error-text']}>
                <FormattedMessage id='toggles.returntype.errortext' />
              </div> 
            )
          }

          <FormField>
            <label>
              <span className={styles['label-required']}>*</span>
              <FormattedMessage id='common.variations.text' />
              <Popup
                inverted
                trigger={
                  <Icon customClass={styles['icon-question']} type='question' />
                }
                content={intl.formatMessage({id: 'toggles.variations.tips'})}
                position='top center'
                className={styles.popup}
              />
            </label>
            <Variations
              prefix='drawer'
              returnType={toggleInfo?.returnType}
              variationContainer={variationContainer}
              hooksFormContainer={hooksFormContainer}
            />
          </FormField>

          <Form.Field>
            <label>
              <span className={styles['label-required']}>*</span>
              <FormattedMessage id='common.disabled.return.type.text' />
              <Popup
                inverted
                trigger={<Icon customClass={styles['icon-question']} type='question' />}
                content={intl.formatMessage({id: 'toggles.disabled.return.type.tips'})}
                position='top center'
                className={styles.popup}
              />
            </label>
            <Dropdown
              floating
              selection
              value={toggleInfo?.disabledServe}
              error={ errors.disabledServe ? true : false }
              {
                ...register('disabledServe', { 
                  required: true, 
                })
              }
              onChange={async (e: SyntheticEvent, detail: DropdownProps) => {
                handleChange(e, detail, 'disabledServe');
                setValue(detail.name, detail.value);
                await trigger('disabledServe');
              }}
              className={styles['dropdown']}
              options={options} 
              placeholder={intl.formatMessage({id: 'common.dropdown.placeholder'})}
              icon={
                <Icon customClass={styles['angle-down']} type='angle-down' />
              }
            />
          </Form.Field>
          { 
            errors.disabledServe && (
              <div className={styles['error-text']}>
                <FormattedMessage id='toggles.disabled.return.type.errortext' />
              </div> 
            )
          }
        </div>
      </Form>
    </div>
	)
}

export default Drawer;