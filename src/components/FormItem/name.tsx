import { SyntheticEvent } from 'react';
import { Form, FormInputProps, InputOnChangeData } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { UseFormRegister, FieldValues, FieldErrors } from 'react-hook-form';
import styles from './index.module.scss';

interface IProps extends FormInputProps {
  value: string;
  errors: FieldErrors;
  size?: "big" | "small" | "mini" | "large" | "huge" | "massive" | undefined;
  className?: string;
  register: UseFormRegister<FieldValues>;
  onChange(e: SyntheticEvent, detail: InputOnChangeData): void;
}

const FormItemName = (props: IProps) => {
  const intl = useIntl();
  const { value, errors, size, className, register, onChange } = props;

  return (
    <div className={className}>
      <Form.Field>
        <label>
          <span className={styles['label-required']}>*</span>
          <FormattedMessage id='common.name.text' />
        </label>
        <Form.Input
          size={size}
          className={styles.input}
          value={value}
          placeholder={intl.formatMessage({id: 'common.name.required'})}
          error={ errors.name ? true : false }
          {
            ...register('name', { 
              required: intl.formatMessage({id: 'common.name.required'}),
            })
          }
          onChange={onChange}
        />
      </Form.Field>
      { errors.name && <div className={styles['error-text']}>{ errors.name.message }</div> }
    </div>
  )
}

export default FormItemName;