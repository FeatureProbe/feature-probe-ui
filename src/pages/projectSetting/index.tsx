
import { SyntheticEvent, useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import  { Radio, CheckboxProps, Form, Input, Dropdown, DropdownProps } from 'semantic-ui-react';
import ProjectLayout from 'layout/projectLayout';
import Icon from 'components/Icon';
import Button from 'components/Button';
import styles from './index.module.scss';

const ProjectSetting = () => {
  const intl = useIntl();

  const saveToggleDisable = useCallback((checked: boolean) => {
    console.log(checked);
  }, []);

  return (
    <ProjectLayout>
      <div className={styles.setting}>
        <div className={styles.content}>
          <div className={styles.title}>
            <FormattedMessage id='common.toggle.settings.text' />
          </div>
          <div className={styles.tips}>
            <Icon type='warning-circle' customClass={styles['warning-circle']}></Icon>
            <FormattedMessage id='toggles.settings.tips' />
          </div>
          <div className={styles.approval}>
            <FormattedMessage id='toggles.settings.pulbish.approval' />
            <Radio
              size='mini'
              toggle 
              checked={false} 
              onChange={(e: SyntheticEvent, data: CheckboxProps) => saveToggleDisable(!data.checked || false)} 
              className={styles['approval-status']} 
            />
          </div>
          <div>
            <Form className={styles['approval-form']}>
              <Form.Group>
                <Form.Field width={4}>
                  <label className={styles.label}>
                    <FormattedMessage id='common.environment.text' />:
                  </label>
                  <Input value={'online'} />
                </Form.Field>
                <Form.Field width={12}>
                  <label className={styles.label}>
                    <FormattedMessage id='toggles.settings.approver' />:
                  </label>
                  <Dropdown
                    placeholder={intl.formatMessage({id: '请选择审批人'})}
                    search
                    selection
                    multiple
                    floating
                    // allowAdditions={ true }
                    // options={options}
                    // value={condition.objects}
                    openOnFocus={false}
                    // renderLabel={renderLabel}
                    icon={<Icon customClass={styles['angle-down']} type='angle-down' />}
                    // error={ errors[`rule_${rule.id}_condition_${condition.id}_objects`] ? true : false }
                    noResultsMessage={null}
                    // {
                    //   ...register(`rule_${rule.id}_condition_${condition.id}_objects`, { 
                    //     required: true, 
                    //   })
                    // }
                    onChange={async (e: SyntheticEvent, detail: DropdownProps) => {
                      console.log(e);
                      console.log(detail);
                    }}
                  />
                </Form.Field>
              </Form.Group>
            </Form>
          </div>
        </div>
        <div className={styles.footer}>
          <Button basic type='reset'>
            <FormattedMessage id='common.cancel.text' />
          </Button>
          <Button className={styles['publish-btn']} primary type="submit">
            <span className={styles['publish-btn-text']}>
              <FormattedMessage id='common.save.text' />
            </span>
          </Button>
        </div>
      </div>
    </ProjectLayout>

  );
};

export default ProjectSetting;