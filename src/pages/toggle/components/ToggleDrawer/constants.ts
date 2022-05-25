import { v4 as uuidv4} from 'uuid';

const fisrt_id = uuidv4();
const second_id = uuidv4();
export const initVariations = [
  {
    id: fisrt_id,
    value: '', 
    name: '', 
    description: '',
  },
  {
    id: second_id,
    value: '', 
    name: '', 
    description: '',
  }
];

export const initBooleanVariations = [
  {
    id: fisrt_id,
    value: 'false', 
    name: '', 
    description: '',
  },
  {
    id: second_id,
    value: 'true', 
    name: '', 
    description: '',
  }
];

export const returnTypeOptions = [
  { key: 'boolean', value: 'boolean', text: 'boolean' },
  { key: 'string', value: 'string', text: 'string' },
  { key: 'number', value: 'number', text: 'number' },
  { key: 'json', value: 'json', text: 'json' },
];
