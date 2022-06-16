import { useState, SyntheticEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from "react-hook-form";
import { InputOnChangeData, TextAreaProps } from 'semantic-ui-react';
import { IRule, IServe } from 'interfaces/targeting';

export const useRule = () => {
  const [rules, saveRules] = useState<IRule[]>([]);

  const handleAddRule = () => {
    const rule: IRule = {
      id: uuidv4(),
      name: '',
      serve: undefined,
      conditions: [{
        id: uuidv4(),
        type: 'string',
        subject: '',
        predicate: '',
      }],
    }
    rules.push(rule);
    saveRules([...rules]);
  }

  const handleDeleteRule = (index: number) => {
    rules.splice(index, 1);
    saveRules([...rules]);
  }

  const handleInputRuleName = (ruleIndex: number, name: string) => {
    rules[ruleIndex].name = name;
    saveRules([...rules]);
  }

  const handleAddCondition = (index: number) => {
    rules[index].conditions.push({
      id: uuidv4(),
      type: 'string',
      subject: '',
      predicate: '',
    });

    saveRules([...rules]);
  }

  const handleDeleteCondition = (ruleIndex: number, conditionIndex: number) => {
    rules[ruleIndex].conditions.splice(conditionIndex, 1);
    saveRules([...rules]);
  }

  const handleChangeAttr = (ruleIndex: number, conditionIndex: number, value: string) => {
    rules[ruleIndex].conditions[conditionIndex].subject = value;
    saveRules([...rules]);
  }

  const handleChangeType = (ruleIndex: number, conditionIndex: number, value: string) => {
    rules[ruleIndex].conditions[conditionIndex].type = value;
    saveRules([...rules]);
  }

  const handleChangeOperator = (ruleIndex: number, conditionIndex: number, value: string) => {
    rules[ruleIndex].conditions[conditionIndex].predicate = '' + value;
    saveRules([...rules]);
  }

  const handleChangeValue = (ruleIndex: number, conditionIndex: number, value: string[]) => {
    rules[ruleIndex].conditions[conditionIndex].objects = value;
    saveRules([...rules]);
  }

  const handleChangeServe = (ruleIndex: number, item: IServe) => {
    rules[ruleIndex].serve = item;
    saveRules([...rules]);
  }

  return { 
    rules,
    saveRules,
    handleAddRule, 
    handleDeleteRule, 
    handleInputRuleName,
    handleAddCondition,
    handleDeleteCondition,
    handleChangeAttr,
    handleChangeType,
    handleChangeOperator,
    handleChangeValue,
    handleChangeServe,
  };
}

export const useSegmentInfo = () => {
  const [ segmentInfo, saveSegmentInfo ] = useState({
    name: '',
    key: '',
    description: '',
  });

  const [ originSegmentInfo, saveOriginSegmentInfo ] = useState({
    name: '',
    key: '',
    description: '',
  });

  const handleChange = (e: SyntheticEvent, detail: InputOnChangeData | TextAreaProps , type: string) => {
    const { value } = detail;
    // @ts-ignore
    segmentInfo[type] = value;
    saveSegmentInfo({...segmentInfo});
  }

  return {
    segmentInfo,
    originSegmentInfo,
    handleChange,
    saveSegmentInfo,
    saveOriginSegmentInfo,
  }
}

export const useReactHookForm = () => {
  return {
    ...useForm(),
  }
}