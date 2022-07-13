import { Form, Dropdown } from 'semantic-ui-react';
import { useIntl } from 'react-intl';
import Button from 'components/Button';
import Icon from 'components/Icon';
import styles from '../Steps/index.module.scss';

const StepSecond = () => {
  const intl = useIntl();

  return (
    <div className={styles.step}>
      <div className={styles['step-left']}>
        <div className={styles.circle}>2</div>
        <div className={styles.line}></div>
      </div>
      <div className={styles['step-right']}>
        <div className={styles['step-title']}>Select SDK</div>
        <div className={styles['step-detail']}>
          <Form>
            <Form.Field>
              <label>
                <span className={styles['label-required']}>*</span>
                Select your SDK
              </label>
              <Dropdown
                fluid 
                selection
                floating
                clearable
                selectOnBlur={false}
                className={styles['dropdown']}
                placeholder={intl.formatMessage({id: 'common.dropdown.placeholder'})} 
                options={[]} 
                icon={
                  true
                    ? <Icon customClass={styles['angle-down']} type='remove-circle' />
                    : <Icon customClass={styles['angle-down']} type='angle-down' />
                }
                onChange={() => {}}
              />
            </Form.Field>
            <Button primary type='submit'>Save and continue</Button>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default StepSecond;