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
import { FormattedMessage, useIntl } from 'react-intl';
import message from 'components/MessageBox';
import Button from 'components/Button';
import Variations from 'components/Variations';
import Icon from 'components/Icon';
import { variationContainer, toggleInfoContainer, hooksFormContainer } from '../../provider';
import { VariationColors } from 'constants/colors';
import { CONFLICT } from 'constants/httpCode';
import { replaceSpace } from 'utils/tools';
import { initVariations, initBooleanVariations, returnTypeOptions } from './constants';
import { IVariation } from 'interfaces/targeting';
import { ITag, ITagOption } from 'interfaces/project';
import { createToggle, getTags, addTag, editToggle } from 'services/toggle';

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
          <Button size='mini' primary type='submit'>
            {
              isAdd ? <FormattedMessage id='common.create.text' /> : <FormattedMessage id='common.save.text' />
            }
          </Button>
          <div className={styles.divider}></div>
          <Icon customClass={styles['title-close']} type='close' onClick={() => setDrawerVisible(false)} />
        </div>
        <div className={styles['toggle-drawer-form-content']}>
          <Form.Field>
            <label>
              <span className={styles['label-required']}>*</span>
              <FormattedMessage id='common.name.text' />
            </label>
            <Form.Input
              size='mini'
              className={styles.input}
              value={ toggleInfo?.name }
              placeholder={intl.formatMessage({id: 'common.name.required'})}
              error={ errors.name ? true : false }
              {
                ...register('name', { 
                  required: intl.formatMessage({id: 'common.name.required'}),
                })
              }
              onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
                if (detail.value.length > 50 ) return;
                handleChange(e, detail, 'name')
                setValue(detail.name, detail.value);
                await trigger('name');

                if (isKeyEdit) {
                  return;
                }

                const reg = /[^A-Z0-9._-]/gi;
                const keyValue = detail.value.replace(reg, '');
                handleChange(e, {...detail, value: keyValue}, 'key');
                setValue('key', keyValue);
                await trigger('key');
              }}
            />
          </Form.Field>
          { errors.name && <div className={styles['error-text']}>{ errors.name.message }</div> }

          <Form.Field>
            <label>
              <span className={styles['label-required']}>*</span>
              <FormattedMessage id='common.key.text' />
              <Popup
                inverted
                className={styles.popup}
                trigger={
                  <Icon customClass={styles['icon-question']} type='question' />
                }
                content={intl.formatMessage({id: 'toggles.key.tips'})}
                position='top center'
              />
            </label>

            <Form.Input
              size='mini'
              className={styles.input}
              value={toggleInfo?.key}
              placeholder={intl.formatMessage({id: 'common.key.required'})}
              error={ errors.key ? true : false }
              disabled={!isAdd}
              {
                ...register('key', { 
                  required: intl.formatMessage({id: 'common.key.required'}),
                  minLength: {
                    value: 2,
                    message: intl.formatMessage({id: 'common.minimum.two'})
                  },
                  maxLength: {
                    value: 30,
                    message: intl.formatMessage({id: 'common.maximum.thirty'})
                  },
                  pattern: {
                    value: /^[A-Z0-9._-]+$/i,
                    message: intl.formatMessage({id: 'common.key.invalid'})
                  }
                })
              }
              onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
                saveKeyEdit(true);
                handleChange(e, detail, 'key');
                setValue(detail.name, detail.value);
                await trigger('key');
              }}
            />
          </Form.Field>
          { errors.key && <div className={styles['error-text']}>{ errors.key.message }</div> }
          <div className={styles['tip-text']}>
            <FormattedMessage id='common.key.tips' />
          </div>

          <Form.Field>
            <label>
              <FormattedMessage id='common.description.text' />
            </label>
            <Form.TextArea 
              value={toggleInfo?.desc} 
              placeholder={intl.formatMessage({id: 'common.description.required'})}
              className={styles.input}
              onChange={async (e: SyntheticEvent, detail: TextAreaProps) => {
                if (('' + detail.value).length > 500 ) return;
                handleChange(e, detail, 'desc')
                setValue(detail.name, detail.value);
                await trigger('desc');
              }}
            />
          </Form.Field>

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
                label={intl.formatMessage({id: 'toggles.sdk.yes'})}
                className={styles['radio-group-item']}
                checked={!!toggleInfo?.clientAvailability}
                onChange={(e: FormEvent, detail: CheckboxProps) => handleChange(e, detail, 'clientAvailability')} 
              />
              <Form.Radio 
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