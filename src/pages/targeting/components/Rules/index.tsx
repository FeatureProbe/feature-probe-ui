import { useCallback } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { FormattedMessage, useIntl } from 'react-intl';
import cloneDeep from 'lodash/cloneDeep';
import SectionTitle from 'components/SectionTitle';
import Icon from 'components/Icon';
import Rule from 'components/Rule';
import { IRule } from 'interfaces/targeting';
import { IContainer } from 'interfaces/provider';
import styles from './index.module.scss';
import classNames from 'classnames';
const MAX_RULES = 30;

interface IProps {
<<<<<<< HEAD
  disabled?: boolean;
=======
>>>>>>> 959a9b3 (Release 1.1.0 (#2))
  useSegment?: boolean;
  ruleContainer: IContainer;
  variationContainer?: IContainer;
  hooksFormContainer: IContainer;
  segmentContainer?: IContainer;
}

const Rules = (props: IProps) => {
  const intl = useIntl();
  const { useSegment, ruleContainer, variationContainer, hooksFormContainer, segmentContainer } = props;
  const { 
    disabled, 
    useSegment, 
    ruleContainer, 
    variationContainer, 
    hooksFormContainer, 
    segmentContainer 
  } = props;
  const { 
    rules,
    saveRules,
    handleAddRule, 
  } = ruleContainer.useContainer();

  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const copyRules = cloneDeep(rules);
    const [removed] = copyRules.splice(result.source.index, 1);
    copyRules.splice(result.destination.index, 0, removed);
    saveRules([...copyRules]);
  }, [rules, saveRules]);

  const cls = classNames(
    styles.add,
    {
      [styles['add-disabled']]: rules.length >= MAX_RULES || disabled
    }
  );

	return (
		<div className={styles.rules}>
      <SectionTitle
        title={intl.formatMessage({id: 'common.rules.text'})}
        showTooltip={true}
        tooltipText={intl.formatMessage({id: 'targeting.rules.tips'})}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {provided => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <div className={styles['rules-container']}>
                {
                  rules && rules.map((rule: IRule, index: number) => {
                    return (
                      <Rule
                        key={rule.id}
                        rule={rule}
                        index={index}
<<<<<<< HEAD
                        disabled={disabled}
=======
>>>>>>> 959a9b3 (Release 1.1.0 (#2))
                        useSegment={useSegment}
                        ruleContainer={ruleContainer}
                        segmentContainer={segmentContainer}
                        hooksFormContainer={hooksFormContainer}
                        variationContainer={variationContainer}
                      />
                    )
                  })
                }
              </div>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      <div 
        className={cls} 
        onClick={() => {
          if (rules.length >= MAX_RULES || disabled) {
            return;
          }
          handleAddRule();
        }}
      >
        <Icon customClass={styles['iconfont']} type='add' />
        <FormattedMessage id='targeting.rule.add.text'/>
      </div>
		</div>
	)
}

export default Rules;
