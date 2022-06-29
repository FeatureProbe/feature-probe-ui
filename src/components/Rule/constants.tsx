import { IntlShape } from 'react-intl';
import { IOption } from 'interfaces/targeting';

export const VALUE_IN = 'is in';
export const VALUE_NOT_IN = 'is not in';

export const STRING_TYPE = 'string';
export const NUMBER_TYPE = 'number';
export const DATETIME_TYPE = 'datetime';
export const SEMVER_TYPE = 'semver';
export const SEGMENT_TYPE = 'segment';

export const attributeOptions: IOption[] = [
  { key: 'userId', text: 'userId', value: 'userId' },
];

export const getSubjectSegmentOptions = (intl: IntlShape) => [
  { key: 'userId', text: 'userId', value: 'userId' },
];

export const getAttrOptions = (intl: IntlShape, type?:string) => {
  if (type === 'string') {
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
  } else if (type === 'segment') {
    return [
      { key: '1', text: intl.formatMessage({id: 'targeting.rule.subject.segment.in'}), value: 'is in' },
      { key: '2', text: intl.formatMessage({id: 'targeting.rule.subject.segment.notin'}), value: 'is not in' },
    ];
  } else if (type === 'number' || type === 'semver') {
    return [
      { key: '1', text: '=', value: '=' },
      { key: '2', text: '!=', value: '!=' },
      { key: '3', text: intl.formatMessage({id: 'targeting.rule.condition.anyof'}, { type: '<' }), value: '<' },
      { key: '4', text: intl.formatMessage({id: 'targeting.rule.condition.anyof'}, { type: '<=' }), value: '<=' },
      { key: '5', text: intl.formatMessage({id: 'targeting.rule.condition.anyof'}, { type: '>' }), value: '>' },
      { key: '6', text: intl.formatMessage({id: 'targeting.rule.condition.anyof'}, { type: '>=' }), value: '>=' },
    ];
  } else if (type === 'datetime') {
    return [
      { key: '1', text: 'before', value: 'before' },
      { key: '2', text: 'after', value: 'after' },
    ];
  }
};

export const timezoneOptions = (intl: IntlShape) => {
  return [
    {key: 1, text: intl.formatMessage({id: 'targeting.rule.timezone.zero'}), value: '+00:00'},
    {key: 2, text: intl.formatMessage({id: 'targeting.rule.timezone.east.one'}), value: '+01:00'},
    {key: 3, text: intl.formatMessage({id: 'targeting.rule.timezone.east.two'}), value: '+02:00'},
    {key: 4, text: intl.formatMessage({id: 'targeting.rule.timezone.east.three'}), value: '+03:00'},
    {key: 5, text: intl.formatMessage({id: 'targeting.rule.timezone.east.four'}), value: '+04:00'},
    {key: 6, text: intl.formatMessage({id: 'targeting.rule.timezone.east.five'}), value: '+05:00'},
    {key: 7, text: intl.formatMessage({id: 'targeting.rule.timezone.east.six'}), value: '+06:00'},
    {key: 8, text: intl.formatMessage({id: 'targeting.rule.timezone.east.seven'}), value: '+07:00'},
    {key: 9, text: intl.formatMessage({id: 'targeting.rule.timezone.east.eight'}), value: '+08:00'},
    {key: 10, text: intl.formatMessage({id: 'targeting.rule.timezone.east.nine'}), value: '+09:00'},
    {key: 11, text: intl.formatMessage({id: 'targeting.rule.timezone.east.ten'}), value: '+10:00'},
    {key: 12, text: intl.formatMessage({id: 'targeting.rule.timezone.east.eleven'}), value: '+11:00'},
    {key: 13, text: intl.formatMessage({id: 'targeting.rule.timezone.east.twelve'}), value: '+12:00'},
    {key: 14, text: intl.formatMessage({id: 'targeting.rule.timezone.east.twelve'}), value: '-12:00'},
    {key: 15, text: intl.formatMessage({id: 'targeting.rule.timezone.west.eleven'}), value: '-11:00'},
    {key: 16, text: intl.formatMessage({id: 'targeting.rule.timezone.west.ten'}), value: '-10:00'},
    {key: 17, text: intl.formatMessage({id: 'targeting.rule.timezone.west.nine'}), value: '-09:00'},
    {key: 18, text: intl.formatMessage({id: 'targeting.rule.timezone.west.eight'}), value: '-08:00'},
    {key: 19, text: intl.formatMessage({id: 'targeting.rule.timezone.west.seven'}), value: '-07:00'},
    {key: 20, text: intl.formatMessage({id: 'targeting.rule.timezone.west.six'}), value: '-06:00'},
    {key: 21, text: intl.formatMessage({id: 'targeting.rule.timezone.west.five'}), value: '-05:00'},
    {key: 22, text: intl.formatMessage({id: 'targeting.rule.timezone.west.four'}), value: '-04:00'},
    {key: 23, text: intl.formatMessage({id: 'targeting.rule.timezone.west.three'}), value: '-03:00'},
    {key: 24, text: intl.formatMessage({id: 'targeting.rule.timezone.west.two'}), value: '-02:00'},
    {key: 25, text: intl.formatMessage({id: 'targeting.rule.timezone.west.one'}), value: '-01:00'},
  ]
};
