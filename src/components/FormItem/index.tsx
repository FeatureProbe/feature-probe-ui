import { CSSProperties, ReactNode } from 'react';
import { FieldErrors } from 'react-hook-form';
import { Form } from 'semantic-ui-react';
import styles from './index.module.scss';

interface FormItemProps {
  label: ReactNode;
  required?: boolean;
  error?: FieldErrors[string];
  errorCss?: CSSProperties
}

const FormItem: React.FC<FormItemProps> = (props) => {
  const { label, children, required, error, errorCss } = props;

  return (
    <Form.Field>
      <label>
        {required && <span className={styles['label-required']}>*</span>}
        {label}
      </label>
      {children}
      {error && <div style={errorCss} className={styles['error-text']}>{error.message}</div>}
    </Form.Field>
  );
};

export default FormItem;
