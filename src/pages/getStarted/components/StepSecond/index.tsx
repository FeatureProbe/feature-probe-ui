import { Form, Dropdown } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from 'components/Button';
import Icon from 'components/Icon';
import java from 'images/java.svg';
import rust from 'images/rust.svg';
import go from 'images/go.svg';
import python from 'images/python.svg';
import javascript from 'images/javascript.svg';
import android from 'images/android.svg';
import swift from 'images/swift.svg';
// import objc from 'images/objective-c.svg';
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
        <div className={styles['step-title']}>
          <FormattedMessage id='connect.second.title' />
        </div>
        <div className={styles['step-detail']}>
          <Form>
            <Form.Field>
              <label>
                <span className={styles['label-required']}>*</span>
                <FormattedMessage id='connect.second.sdk' />
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
              >
                <Dropdown.Menu>
                  <Dropdown.Header content='Server-side SDKs' />
                  <Dropdown.Divider />
                  <Dropdown.Item>
                    <img src={java} alt='java logo' />
                    Java
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <img src={rust} alt='rust logo' />
                    Rust
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <img src={go} alt='go logo' />
                    Go
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <img src={python} alt='python logo' />
                    Python
                  </Dropdown.Item>
                  <Dropdown.Header content='Client-side SDKs' />
                  <Dropdown.Divider />
                  <Dropdown.Item>
                    <img src={javascript} alt='js logo' />
                    JavaScript
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <img src={android} alt='android logo' />
                    Android
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <img src={swift} alt='swift logo' />
                    Swift
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <img src={swift} alt='objc logo' />
                    Objective-C
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Form.Field>
            <Button primary type='submit'>
              <FormattedMessage id='connect.save.continue.button' />
            </Button>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default StepSecond;