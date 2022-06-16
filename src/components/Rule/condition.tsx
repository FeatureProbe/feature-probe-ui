import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { Form, Select, Dropdown, DropdownProps, DropdownItemProps } from 'semantic-ui-react';
import { useIntl } from 'react-intl';
import Icon from 'components/Icon';
import { IRule, ICondition, IOption } from 'interfaces/targeting';
import { IContainer } from 'interfaces/provider';
import { getAttrOptions, attributeOptions, getSubjectSegmentOptions } from './constants';
import { ISegment, ISegmentList } from 'interfaces/segment';
import styles from './index.module.scss';

interface IProps {
  rule: IRule;
  ruleIndex: number;
  useSegment?: boolean;
  conditionIndex: number;
  condition: ICondition;
  ruleContainer: IContainer;
  variationContainer?: IContainer;
  segmentContainer?: IContainer;
  hooksFormContainer: IContainer;
}

const RuleContent = (props: IProps) => {
  const { 
    rule,
    ruleIndex,
    useSegment,
    conditionIndex,
    condition,
    ruleContainer, 
    segmentContainer,
    hooksFormContainer, 
  } = props;

  const intl = useIntl();
  const [ showPredicate, setShowPredicate ] = useState<boolean>(true);
  const [ options, setOption ] = useState<IOption[]>();
  let segmentList: ISegmentList = segmentContainer?.useContainer().segmentList;;
  let subjectOptions: IOption[] = attributeOptions;

  const {
    handleChangeAttr,
    handleChangeType,
    handleChangeOperator,
    handleChangeValue,
    handleDeleteCondition,
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

  const handleDelete = useCallback(async (ruleIndex: number, conditionIndex: number, ruleId: string) => {
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

  useEffect(() => {
    if (segmentList) {
      const { content } = segmentList;
      const options = content.map((segment: ISegment) => {
        return ({
          key: segment.key,
          value: segment.key,
          text: segment.name,
        });
      });
      setOption(options);
    }
  }, [segmentList]);

  useEffect(() => {
    if (condition.type === 'segment') {
      setShowPredicate(false);
    }
  }, [condition]);

  const valuesOptions = condition.objects?.map((val: string) => {
    return {
      key: val,
      text: val,
      value: val,
    }
  });

  if (useSegment) {
    subjectOptions = getSubjectSegmentOptions(intl);
  }
  
  const subjectIndex = subjectOptions?.findIndex((attr) => {
    return attr.value === condition.subject;
  });

  if (subjectIndex === -1 && condition.subject) {
    subjectOptions.push({
      key: condition.subject,
      text: condition.subject,
      value: condition.subject,
    });
  }

  return (
    <div className={styles['rule-item']} key={condition.id}>
      {
        conditionIndex === 0 ? (
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
            fluid={false}
            allowAdditions
            options={subjectOptions}
            value={showPredicate ? condition.subject : condition.predicate}
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
              handleChangeAttr(ruleIndex, conditionIndex, detail.value);
              handleChangeValue(ruleIndex, conditionIndex, []);
              if (detail.value === 'in' || detail.value === 'not in') {
                setShowPredicate(false);
                unregister(`rule_${rule.id}_condition_${condition.id}_predicate`);
                handleChangeOperator(ruleIndex, conditionIndex, detail.value);
                handleChangeType(ruleIndex, conditionIndex, 'segment');
              } else {
                setShowPredicate(true);
                handleChangeType(ruleIndex, conditionIndex, 'string');
              }
              setValue(detail.name, detail.value);
              await trigger(`rule_${rule.id}_condition_${condition.id}_subject`);
            }}
          />
          { 
            errors[`rule_${rule.id}_condition_${condition.id}_subject`] &&
              <div className={styles['error-text']}>
                { intl.formatMessage({id: 'targeting.rule.subject.required'}) }
              </div>
          }
        </Form.Field>

        {
          showPredicate && (
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
                  handleChangeOperator(ruleIndex, conditionIndex, detail.value);
                  setValue(detail.name, detail.value);
                  await trigger(`rule_${rule.id}_condition_${condition.id}_predicate`);
                }}
              />
              { 
                errors[`rule_${rule.id}_condition_${condition.id}_predicate`] && 
                  <div className={styles['error-text']}>
                    { intl.formatMessage({id: 'targeting.rule.operator.required'}) }
                  </div> 
              }
            </Form.Field>
          )
        }

        <Form.Field width={6}>
          <Dropdown
            placeholder={intl.formatMessage({id: 'targeting.rule.values.placeholder'})}
            search
            selection
            multiple
            floating
            allowAdditions={showPredicate}
            options={showPredicate ? valuesOptions : options}
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
              handleChangeValue(ruleIndex, conditionIndex, detail.value);
              setValue(detail.name, detail.value);
              await trigger(`rule_${rule.id}_condition_${condition.id}_objects`);
            }}
          />
          { 
            errors[`rule_${rule.id}_condition_${condition.id}_objects`] && 
              <div className={styles['error-text']}>
                { intl.formatMessage({id: 'targeting.rule.values.placeholder'}) }
              </div> 
          }
        </Form.Field>
      </Form.Group>
      <Icon 
        style={{visibility: `${rule.conditions.length > 1 ? 'visible' : 'hidden'}`}} 
        customClass={styles['icon-minus']} type='minus'
        onClick={() => handleDelete(ruleIndex, conditionIndex, rule.id)}
      />
    </div>
  )
}

export default RuleContent;