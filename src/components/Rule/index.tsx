import { useState, MouseEvent, useCallback } from 'react';
import { Accordion, AccordionTitleProps } from 'semantic-ui-react'
import { Draggable } from 'react-beautiful-dnd';
import RuleTitle from './RuleTitle';
import RuleContent from './RuleContent';
import Icon from 'components/Icon';
import { IRule } from 'interfaces/targeting';
import { IContainer } from 'interfaces/provider';

import styles from './index.module.scss';

interface IProps {
  rule: IRule,
  index: number;
  variationContainer?: IContainer;
  ruleContainer: IContainer;
  hooksFormContainer: IContainer;
}

const Rule = (props: IProps) => {
  const { 
    rule, 
    index,
    ruleContainer,
    variationContainer,
    hooksFormContainer,
  } = props;

  const [ isHover, setHover ] = useState<boolean>(false);
  const [ active, setActive ] = useState<boolean>(false);

  const handleMouseEnter = useCallback(() => {
    setHover(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHover(false);
  }, []);

  const handleTitleClick = useCallback((e: MouseEvent, data: AccordionTitleProps) => {
    setActive(data.active || false);
  }, []);

	return (
    <Draggable draggableId={`rule_${rule.id}`} index={index}>
      {provided => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className={styles.rule} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Accordion
              defaultActiveIndex={0}
              panels={[{
                title: {
                  className: styles['rule-accordion-title'],
                  icon: (
                    active 
                      ? <Icon customClass={styles['icon-accordion']} type='angle-right' />
                      : <Icon customClass={styles['icon-accordion']} type='angle-down' />
                  ),
                  content: (
                    <RuleTitle
                      rule={rule}
                      index={index}
                      isHover={isHover}
                      ruleContainer={ruleContainer}
                      hooksFormContainer={hooksFormContainer}
                    />
                  ),
                },
                content: {
                  content: (
                    <RuleContent
                      rule={rule}
                      ruleIndex={index}
                      ruleContainer={ruleContainer}
                      variationContainer={variationContainer}
                      hooksFormContainer={hooksFormContainer}
                    />
                  ),
                },
              }]}
              onTitleClick={handleTitleClick}
            >
            </Accordion>
          </div>
        </div>
      )}
    </Draggable>
	)
}

export default Rule;