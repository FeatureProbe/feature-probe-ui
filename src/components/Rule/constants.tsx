
import { IOption } from 'interfaces/targeting';

export const attributeOptions: IOption[] = [
  { key: 'userId', text: 'userId', value: 'userId' },
]

export const getAttrOptions = (intl: any) => {
  return [
    { key: '1', text: intl.formatMessage({id: 'targeting.rule.condition.isoneof'}), value: 'is one of' },
    { key: '2', text: intl.formatMessage({id: 'targeting.rule.condition.notanyof'}), value: 'is not any of' },
    { key: '3', text: intl.formatMessage({id: 'targeting.rule.condition.startswith'}), value: 'starts with' },
    { key: '4', text: intl.formatMessage({id: 'targeting.rule.condition.notstartwith'}), value: 'does not start with' },
    { key: '5', text: intl.formatMessage({id: 'targeting.rule.condition.endswidth'}), value: 'ends with' },
    { key: '6', text: intl.formatMessage({id: 'targeting.rule.condition.notendwith'}), value: 'does not end with' },
    { key: '7', text: intl.formatMessage({id: 'targeting.rule.condition.contains'}), value: 'contains' },
    { key: '8', text: intl.formatMessage({id: 'targeting.rule.condition.notcontain'}), value: 'does not contain' },
    { key: '9', text: intl.formatMessage({id: 'targeting.rule.condition.matches'}), value: 'matches regex' },
    { key: '10', text: intl.formatMessage({id: 'targeting.rule.condition.notmatch'}), value: 'does not match regex' },
  ];
}