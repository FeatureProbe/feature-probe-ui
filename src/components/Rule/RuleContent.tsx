import { SyntheticEvent, useCallback } from 'react';
import { Form, Select, Dropdown, DropdownProps, DropdownItemProps } from 'semantic-ui-react';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from 'components/Button';
import Serve from 'components/Serve';
import Icon from 'components/Icon';
import { IRule, ICondition } from 'interfaces/targeting';
import { IContainer } from 'interfaces/provider';
import { attributeOptions, getAttrOptions } from './constants';
import styles from './index.module.scss';

interface IProps {
  rule: IRule;
  ruleIndex: number;
  variationContainer: IContainer;
  ruleContainer: IContainer;
  hooksFormContainer: IContainer;
}

const RuleContent = (props: IProps) => {
  const { 
    rule,
    ruleIndex,
    variationContainer, 
    ruleContainer, 
    hooksFormContainer, 
  } = props;

  const intl = useIntl();

  const {
    variations
  } = variationContainer.useContainer();

  const {
    handleChangeAttr,
    handleChangeOperator,
    handleChangeValue,
    handleDeleteCondition,
    handleAddCondition,
    handleChangeServe,
  } = ruleContainer.useContainer()

  const {
    formState: { errors },
    register,
    unregister,
    setValue,
    trigger,
    getValues,
    clearErrors,
  } = hooksFormContainer.useContainer();

  const handleDelete = useCallback(async (ruleIndex: number, conditionIndex: number, ruleId: string, conditionId: string) => {
    for(let key in getValues()) {
      if (key.startsWith(`rule_${ruleId}_condition`)) {
        unregister(key);
        clearErrors(key);
      }
    }
    await handleDeleteCondition(ruleIndex, conditionIndex);
  }, [unregister, clearErrors, getValues, handleDeleteCondition]);

  const renderLabel = useCallback((label: DropdownItemProps) => {
    return ({
      content: label.text,
      removeIcon: <Icon customClass={styles['dropdown-remove-icon']} type='close' />,
    })
  }, []);

	return (
    <div className={styles['rule-content']}>
      {
        rule.conditions?.map((condition: ICondition, index: number) => {
          const valuesOptions = condition.objects?.map((val: string) => {
            return {
              key: val,
              text: val,
              value: val,
            }
          });

          const subjectIndex = attributeOptions.findIndex((attr) => {
            return attr.value === condition.subject;
          });

          if (subjectIndex === -1 && condition.subject) {
            attributeOptions.push({
              key: condition.subject,
              text: condition.subject,
              value: condition.subject,
            })
          }

          return (
            <div className={styles['rule-item']} key={condition.id}>
              {
                index === 0 ? (
                  <span className={`${styles['rule-item-prefix']} ${styles['rule-item-first']}`}>
                    <span className={styles['rule-item-text']}>if</span>
                  </span>
                ) : (
                  <span className={styles['rule-item-prefix']}>
                    <span className={styles['rule-item-text']}>and</span>
                  </span>
                ) 
              }
              <Form.Group className={styles['rule-item-left']} widths='equal'>
                <Form.Field className={styles['rule-item-subject']}>
                  <Dropdown
                    className={styles['rule-item-subject-dropdown']}
                    placeholder={intl.formatMessage({id: 'targeting.rule.subject.placeholder'})}
                    search
                    selection
                    floating
                    allowAdditions
                    options={attributeOptions}
                    value={condition.subject}
                    openOnFocus={false}
                    selectOnBlur={false}
                    closeOnChange={true}
                    icon={<Icon customClass={styles['angle-down']} type='angle-down' />}
                    error={ errors[`rule_${rule.id}_condition_${condition.id}_subject`] ? true : false }
                    {
                      ...register(`rule_${rule.id}_condition_${condition.id}_subject`, { 
                        required: {
                          value: true,
                          message: intl.formatMessage({id: 'targeting.rule.subject.required'})
                        }, 
                      })
                    }
                    onChange={async (e: SyntheticEvent, detail: DropdownProps) => {
                      handleChangeAttr(ruleIndex, index, detail.value);
                      setValue(detail.name, detail.value);
                      await trigger(`rule_${rule.id}_condition_${condition.id}_subject`);
                    }}
                  />
                  { 
                    errors[`rule_${rule.id}_condition_${condition.id}_subject`] && <div className={styles['error-text']}>
                      { intl.formatMessage({id: 'targeting.rule.subject.required'}) }
                    </div>
                  }
                </Form.Field>

                <Form.Field className={styles['rule-item-operator']}>
                  <Select 
                    floating
                    className={styles['rule-item-operator-dropdown']}
                    value={condition.predicate}
                    options={getAttrOptions(intl)}
                    placeholder={intl.formatMessage({id: 'targeting.rule.operator.placeholder'})}
                    openOnFocus={false}
                    icon={<Icon customClass={styles['angle-down']} type='angle-down' />}
                    error={ errors[`rule_${rule.id}_condition_${condition.id}_predicate`] ? true : false }
                    {
                      ...register(`rule_${rule.id}_condition_${condition.id}_predicate`, { 
                        required: true, 
                      })
                    }
                    onChange={async (e: SyntheticEvent, detail: DropdownProps) => {
                      handleChangeOperator(ruleIndex, index, detail);
                      setValue(detail.name, detail.value);
                      await trigger(`rule_${rule.id}_condition_${condition.id}_predicate`);
                    }}
                  />
                  { errors[`rule_${rule.id}_condition_${condition.id}_predicate`] && <div className={styles['error-text']}>
                    { intl.formatMessage({id: 'targeting.rule.operator.required'}) }
                    </div> }
                </Form.Field>

                <Form.Field width={6}>
                  <Dropdown
                    placeholder={intl.formatMessage({id: 'targeting.rule.values.placeholder'})}
                    search
                    selection
                    multiple
                    floating
                    allowAdditions
                    options={valuesOptions}
                    value={condition.objects}
                    openOnFocus={false}
                    renderLabel={renderLabel}
                    icon={<Icon customClass={styles['angle-down']} type='angle-down' />}
                    error={ errors[`rule_${rule.id}_condition_${condition.id}_objects`] ? true : false }
                    noResultsMessage={null}
                    {
                      ...register(`rule_${rule.id}_condition_${condition.id}_objects`, { 
                        required: true, 
                      })
                    }
                    onChange={async (e: SyntheticEvent, detail: DropdownProps) => {
                      handleChangeValue(ruleIndex, index, detail.value);
                      setValue(detail.name, detail.value);
                      await trigger(`rule_${rule.id}_condition_${condition.id}_objects`);
                    }}
                  />
                  { errors[`rule_${rule.id}_condition_${condition.id}_objects`] && <div className={styles['error-text']}>
                    { intl.formatMessage({id: 'targeting.rule.values.placeholder'}) }
                    </div> }
                </Form.Field>
              </Form.Group>
              <Icon 
                style={{visibility: `${rule.conditions.length > 1 ? 'visible' : 'hidden'}`}} 
                customClass={styles['icon-minus']} type='minus'
                onClick={() => handleDelete(ruleIndex, index, rule.id,  condition.id)}
              />
            </div>
          )
        })
      }

      <div className={styles['rule-add']}>
        <Button type='button' secondary className={styles['rule-add-btn']} onClick={() => handleAddCondition(ruleIndex)}>
          <Icon type='add' customClass={styles.iconfont} />
          <FormattedMessage id='common.add.text' />
        </Button>
      </div>
     
      <Serve
        index={ruleIndex}
        id={rule.id}
        serve={rule.serve}
        variations={variations}
        customStyle={{width: '308px'}}
        handleChangeServe={(item) => handleChangeServe(ruleIndex, item)}
        hooksFormContainer={hooksFormContainer}
      />
    </div>
	)
}

export default RuleContent;