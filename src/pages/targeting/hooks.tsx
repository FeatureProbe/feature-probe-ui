import { useState, useEffect, useCallback, SyntheticEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from "react-hook-form";
import { InputOnChangeData, TextAreaProps } from 'semantic-ui-react';
import { IRule, IServe, IVariation } from 'interfaces/targeting';
import { ISegmentList } from 'interfaces/segment';
import { SEGMENT_TYPE } from 'components/Rule/constants';

export const useVarition = () => {
  const [variations, saveVariations] = useState<IVariation[]>([]);

  const handleAdd = () => {
    variations.push({
      id: uuidv4(),
      value: '',
      name: '',
      description: '',
    });
    saveVariations([...variations]);
  }

  const handleDelete = (index: number) => {
    variations.splice(index, 1);
    saveVariations([...variations]);
  }

  const handleInput = (e: SyntheticEvent, detail: InputOnChangeData | TextAreaProps) => {
    const { value, index, customname } = detail;
    if (variations[index]) {
      // @ts-ignore
      variations[index][customname] = value;
    }
    saveVariations([...variations]);
  }

  const handleChangeVariation = (index: number, value: string) => {
    if (variations[index]) {
      variations[index]['value'] = value;
    }

    saveVariations([...variations]);
  }

  return { 
    variations, 
    saveVariations, 
    handleAdd, 
    handleDelete, 
    handleInput,
    handleChangeVariation
  };
}

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

  const handleAddCondition = (index: number, type: string) => {
    rules[index].conditions.push({
      id: uuidv4(),
      type,
      subject: type === SEGMENT_TYPE ? 'user' : '',
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

  const handleChangeOperator = (ruleIndex: number, conditionIndex: number, value: string) => {
    rules[ruleIndex].conditions[conditionIndex].predicate = '' + value;
    saveRules([...rules]);
  }

  const handleChangeValue = (ruleIndex: number, conditionIndex: number, value: string[]) => {
    rules[ruleIndex].conditions[conditionIndex].objects = value;
    saveRules([...rules]);
  }

  const handleChangeDateTime = (ruleIndex: number, conditionIndex: number, value: string) => {
    rules[ruleIndex].conditions[conditionIndex].datetime = value;
    saveRules([...rules]);
  }

  const handleChangeTimeZone = (ruleIndex: number, conditionIndex: number, value: string) => {
    rules[ruleIndex].conditions[conditionIndex].timezone = value;
    saveRules([...rules]);
  }

  const handleChangeType = (ruleIndex: number, conditionIndex: number, value: string) => {
    rules[ruleIndex].conditions[conditionIndex].type = value;
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
    handleChangeDateTime,
    handleChangeTimeZone,
    handleChangeServe,
  };
}

export const useDefaultServe = () => {
  const [defaultServe, saveDefaultServe] = useState<IServe>({});

  return {
    defaultServe,
    saveDefaultServe,
  }
}

export const useDisabledServe = () => {
  const [disabledServe, saveDisabledServe] = useState<IServe>({});

  return {
    disabledServe,
    saveDisabledServe,
  }
}

export const useSegment = () => {
  const [segmentList, saveSegmentList] = useState<ISegmentList>();

  return {
    segmentList,
    saveSegmentList,
  }
}

export const useReactHookForm = () => {
  return {
    ...useForm(),
  }
}

export const useBeforeUnload = (enabled: boolean, message: string) => {
  const handler = useCallback((event: BeforeUnloadEvent) => {
      event.preventDefault();
      if (message) {
        event.returnValue = message;
      }
      return message;
    }, [message]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    window.addEventListener('beforeunload', handler, false)

    return () => {
      window.removeEventListener('beforeunload', handler, false)
    }
  }, [enabled, handler]);
};
