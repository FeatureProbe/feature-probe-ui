import { useCallback, SyntheticEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, InputOnChangeData } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import Button from 'components/Button';
import Icon from 'components/Icon';
import message from 'components/MessageBox';
import { login } from 'services/user';
import { getRedirectUrl } from 'utils/getRedirectUrl';
import { FORBIDDEN } from 'constants/httpCode';
import logo from 'images/logo_large.svg';
import styles from './index.module.scss';

const Login = () => {
  const history = useHistory();
  const intl = useIntl();

  const {
    formState: { errors },
    register,
    handleSubmit,
    setValue,
    trigger,
  } = useForm();

  const gotoHome = useCallback(async () => {
    const redirectUrl = await getRedirectUrl('/notfound');
    history.push(redirectUrl);
  }, [history]);

  const onSubmit = useCallback(async (data) => {
    const res = await login(data);
    const { success } = res;
    if (success) {
      gotoHome();
      // @ts-ignore
      localStorage.setItem('token', res.data.token);
      // @ts-ignore
      localStorage.setItem('organizeId', res.data.organizeId);
    } 
    else if (res.code === FORBIDDEN) {
      message.error(intl.formatMessage({id: 'login.error.text'}));
    }
    else {
      message.error(intl.formatMessage({id: 'login.error.message'}));
    }
  }, [intl, gotoHome]);

	return (
		<div className={styles.login}>
      <div className={`${styles['login-card']} login-card`}>
        <div className={styles.product}>
          <img className={styles.logo} src={logo} alt='logo' />
        </div>
        <div className={styles.form}>
          <Form 
            autoComplete='off'
            onSubmit={handleSubmit(onSubmit)} 
          >
            <Form.Field className={styles.field}>
              <label className={styles.label}>
                <Icon type='avatar' />
                <span className={styles['label-text']}>
                  <FormattedMessage id='common.account.text' />
                </span>
              </label>
              <Form.Input
                placeholder={intl.formatMessage({id: 'login.account.required'})}
                error={ errors.account ? true : false }
                {
                  ...register('account', { 
                    required: {
                      value: true,
                      message: intl.formatMessage({id: 'login.account.required'})
                    },
                    maxLength: {
                      value: 30,
                      message: intl.formatMessage({id: 'login.account.maxlength'})
                    },
                  })
                }
                onChange={async (e: SyntheticEvent, detail: InputOnChangeData) => {
                  setValue(detail.name, detail.value);
                  await trigger('account');
                }}
              />
              { errors.account && <div className={styles['error-text']}>{ errors.account.message }</div> }
            </Form.Field>

            <Form.Field className={styles.field}>
              <label className={styles.label}>
                <Icon type='password' />
                <span className={styles['label-text']}>
                  <FormattedMessage id='common.password.text' />
                </span>
              </label>
              <Form.Input
                placeholder={intl.formatMessage({id: 'login.password.required'})}
                type='password'
                error={ errors.password ? true : false }
                {
                  ...register('password', { 
                    required: {
                      value: true,
                      message: intl.formatMessage({id: 'login.password.required'})
                    },
                    minLength: {
                      value: 4,
                      message: intl.formatMessage({id: 'login.password.minlength'})
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
              { errors.password && <div className={styles['error-text']}>{ errors.password.message }</div> }
              <div className={styles['tip-text']}>
                <FormattedMessage id='login.password.tips' />
              </div>
            </Form.Field>

            <div className={styles.footer}>
              <Button className={styles.btn} type='submit' primary disabled={!!errors.account || !!errors.password}>
                <FormattedMessage id='login.signin' />
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Login;
