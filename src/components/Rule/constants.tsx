
import { IOption } from 'interfaces/targeting';

export const attributeOptions: IOption[] = [
  { key: 'userId', text: 'userId', value: 'userId' },
]

export const operatorOptions: IOption[] = [
  { key: '1', text: 'is one of', value: 'is one of' },
  { key: '2', text: 'is not any of', value: 'is not any of' },
  { key: '3', text: 'starts with', value: 'starts with' },
  { key: '4', text: 'does not start with', value: 'does not start with' },
  { key: '5', text: 'ends with', value: 'ends with' },
  { key: '6', text: 'does not end with', value: 'does not end with' },
  { key: '7', text: 'contains', value: 'contains' },
  { key: '8', text: 'does not contain', value: 'does not contain' },
  { key: '9', text: 'matches regex', value: 'matches regex' },
  { key: '10', text: 'does not match regex', value: 'does not match regex' },
]