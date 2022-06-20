import { IntlShape } from 'react-intl';
import { IOption } from 'interfaces/targeting';

export const VALUE_IN = 'is in';
export const VALUE_NOT_IN = 'is not in';

export const attributeOptions: IOption[] = [
  { key: 'userId', text: 'userId', value: 'userId' },
];

export const getSubjectSegmentOptions = (intl: IntlShape) => [
  { key: 'userId', text: 'userId', value: 'userId' },
  { key: 'user is in segments', text: intl.formatMessage({id: 'targeting.rule.subject.segment.in'}), value: VALUE_IN },
  { key: 'user is not in segments', text: intl.formatMessage({id: 'targeting.rule.subject.segment.notin'}), value: VALUE_NOT_IN },
];

export const getAttrOptions = (intl: IntlShape) => [
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
