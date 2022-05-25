import { SyntheticEvent, useEffect, useState, useCallback, useMemo } from 'react';
import { 
  Form,
  Checkbox,
  Dropdown,
  FormField,
  DropdownProps,
  InputOnChangeData,
  CheckboxProps,
  DropdownItemProps,
} from 'semantic-ui-react';
import classNames from 'classnames';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import message from 'components/MessageBox';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { IUserInfo, IFormParams } from 'interfaces/member';
import { createMember, updateMember, getMember } from 'services/member';
import styles from './index.module.scss';

interface IParams {
  isAdd: boolean;
  visible: boolean;
  editUser?: IUserInfo
  setDrawerVisible: (visible: boolean) => void;
  refreshMemberList:(pageIndex: number) => void;
}

const DEFAULT_PASSWORD = 'Pass1234';

const MemberDrawer = (props: IParams) => {
  const { isAdd, visible, editUser, setDrawerVisible, refreshMemberList } = props;
  const [ passwordVisible, setPasswordVisible ] = useState<boolean>(false);
  const [ memberValues, setMemberValues ] = useState<string[]>([]);
  const [ dulplicateAccount, setDulplicateAccount ] = useState<string>(); 

  const {
    formState: { errors },
    register,
    unregister,
    handleSubmit,
    setValue,
    trigger,
    clearErrors,
  } = useForm();

  const intl = useIntl();

  useEffect(() => {
    if (visible) {
      clearErrors();
      setMemberValues([]);
    } else {
      setValue('accounts', '');
      setValue('account', '');
      setValue('password', '');
    }
  }, [visible, setValue, clearErrors]);

  useEffect(() => {
    if (isAdd) {
      unregister('account',
        { keepIsValid: true }
      )
    }
  }, [isAdd, unregister]);

  useEffect(() => {
    if (visible && !passwordVisible) {
      unregister('password',
        { keepIsValid: true }
      )
    }
  }, [visible, passwordVisible, unregister]);

  useEffect(() => {
    setValue('account', editUser?.account);
  }, [editUser, setValue]);

  const renderLabel = useCallback((label: DropdownItemProps) => {
    return ({
      content: label.text,
      removeIcon: <Icon customClass={styles['dropdown-remove-icon']} type='close' />,
    });
  }, []);

  const handleChange = useCallback(async (e: SyntheticEvent, detail: DropdownProps) => {
    // @ts-ignore
    setMemberValues(detail.value);
    setValue(detail.name, detail.value);
    await trigger('accounts');
  }, [trigger, setValue]);

  const handleCheckboxChange = useCallback((e: SyntheticEvent, detail: CheckboxProps) => {
    // @ts-ignore
    setPasswordVisible(!detail.checked);
  }, []);

  const onSubmit = async (data: IFormParams) => {
    if (isAdd) {
      const params: IFormParams = {
        accounts: [],
        password: ''
      };
      params.accounts = data.accounts;
      params.password = data.password || DEFAULT_PASSWORD;

      const res = await createMember(params);
      if (res.success) {
        message.success(intl.formatMessage({id: 'members.create.success.text'}));
        refreshMemberList(0);
        setDrawerVisible(false);
      } else {
        message.error(intl.formatMessage({id: 'members.create.error.text'}));
      }
    } else {
      const res = await updateMember(data);
      if (res.success) {
        message.success(intl.formatMessage({id: 'members.update.success.text'}));
        setDrawerVisible(false);
      } else {
        message.error(intl.formatMessage({id: 'members.update.error.text'}));
      }
    }
  };

  const valueOptions = useMemo(() => {
    return memberValues.map((item: string) => {
      return {
        key: item,
        text: item,
        value: item,
      }
    });
  }, [memberValues]);

  const handleAddAccount = useCallback(async(event: SyntheticEvent, data: DropdownProps) => {
    const res = await getMember({
      // @ts-ignore
      account: data.value,
    });

    if (res.success) {
      message.error(intl.formatMessage({id: 'members.add.dulplicate.error.text'}));
      // @ts-ignore
      setDulplicateAccount(data.value);
    }
  }, [intl]);
  
  useEffect(() => {
    const filterMemberValues = memberValues.filter(member => member !== dulplicateAccount);
    if (filterMemberValues.length !== memberValues.length) {
      setMemberValues(filterMemberValues);
      setValue('accounts', filterMemberValues);
    }
  }, [dulplicateAccount, memberValues, setValue]);
 
  const drawerCls = classNames(
    styles['member-drawer'],
    {
      [styles['member-drawer-inactive']]: visible,
    }
  );

  const drawerFormCls = classNames(
    styles['member-drawer-form'],
    {
      [styles['member-drawer-form-inactive']]: visible,
    }
  );

	return (
    <div className={drawerCls}>
      <Form 
        autoComplete='off'
        onSubmit={handleSubmit(onSubmit)} 
        className={drawerFormCls}
      >
        <div className={styles.title}>
          <div className={styles['title-left']}>
            { isAdd ? intl.formatMessage({id: 'members.add.members'}) : intl.formatMessage({id: 'members.edit.member'}) }
          </div>
          <Button size='mini' basic type='reset' className={styles['btn-cancel']} onClick={() => {setDrawerVisible(false)}}>
            <FormattedMessage id='common.cancel.text' />
          </Button>
          <Button size='mini' primary type='submit'>
            {
              isAdd ? intl.formatMessage({id: 'common.add.text'}) : intl.formatMessage({id: 'common.save.text'})
            }
          </Button>
          <div className={styles.divider}></div>
          <Icon customClass={styles['title-close']} type='close' onClick={() => setDrawerVisible(false)} />
        </div>
        <div className={styles['member-drawer-form-content']}>
          {
            isAdd ? (
              <>
                <Form.Field>
                  <label>
                    <span className={styles['label-required']}>*</span>
                    <FormattedMessage id='common.accounts.text' />
                  </label>
                  <Dropdown
                    fluid
                    search
                    multiple
                    selection
                    allowAdditions
                    floating
                    options={valueOptions}
                    size='mini'
                    value={memberValues}
                    error={ errors.accounts ? true : false }
                    {
                      ...register('accounts', { 
                        required: 'please add accounts',
                      })
                    }
                    className={`${styles['dropdown']}`}
                    placeholder='Please add accounts'
                    onChange={(e: SyntheticEvent, detail: DropdownProps) => handleChange(e, detail)}
                    renderLabel={renderLabel}
                    noResultsMessage={null}
                    icon={null}
                    onAddItem={handleAddAccount}
                  />
                </Form.Field>
                { errors.accounts && <div className={styles['error-text']}>{ errors.accounts.message }</div> }

                <FormField>
                  <Checkbox checked={ !passwordVisible } label='Default password' onChange={handleCheckboxChange} />
                  <div>
                    <div className={styles.password}>
                      { DEFAULT_PASSWORD }
                    </div>
                  </div>
                </FormField>
              </>
            ) : (
              <>
                <Form.Field>
                  <label>
                    <span className={styles['label-required']}>*</span>
                    <FormattedMessage id='common.account.text' />
                  </label>
                  <Form.Input
                    disabled
                    className={styles.input}
                    value={ editUser?.account }
                    placeholder={intl.formatMessage({id: 'login.account.required'})}
                    error={ errors.account ? true : false }
                    {
                      ...register('account', { 
                        required: intl.formatMessage({id: 'login.account.required'}),
                      })
                    }
                    onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
                      if (detail.value.length > 50 ) return;
                      setValue(detail.name, detail.value);
                      await trigger('account');
                    }}
                  />
                </Form.Field>
                { errors.account && <div className={styles['error-text']}>{ errors.account.message }</div> }
              </>
            )
          }
          
          {
            (!isAdd || passwordVisible) && (
              <>
                <Form.Field>
                  <label>
                    <span className={styles['label-required']}>*</span>
                    <FormattedMessage id='common.password.text' />
                  </label>

                  <Form.Input
                    className={styles.input}
                    placeholder='Please input password' 
                    error={ errors.password ? true : false }
                    {
                      ...register('password', { 
                        required: intl.formatMessage({id: 'login.password.required'}),
                        minLength: {
                          value: 4,
                          message: intl.formatMessage({id: 'login.password.minlength'}),
                        },
                        maxLength: {
                          value: 20,
                          message: intl.formatMessage({id: 'login.password.maxlength'})
                        },
                        pattern: {
                          value: /^[A-Z0-9._-]+$/i,
                          message: intl.formatMessage({id: 'login.password.invalid'})
                        }
                      })
                    }
                    onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
                      setValue(detail.name, detail.value);
                      await trigger('password');
                    }}
                  />
                </Form.Field>
                { errors.password && <div className={styles['error-text']}>{ errors.password.message }</div> }
                <div className={styles['tip-text']}>
                  <FormattedMessage id='login.password.tips' />
                </div>
              </>
            )
          }
        </div>
      </Form>
    </div>
	)
}

export default MemberDrawer;