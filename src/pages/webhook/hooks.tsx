import { SyntheticEvent, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { InputOnChangeData, TextAreaProps, DropdownProps, CheckboxProps } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { IVariation } from 'interfaces/targeting';
import { IToggleInfo } from 'interfaces/toggle';
import { getVariationName } from 'utils/tools';
import { IWebHook, IWebHookInfo } from 'interfaces/webhook';

export const useWebHookInfo = () => {
  const [webHookInfo, saveWebHookInfo] = useState<IWebHookInfo>({
    name: '',
    description: '',
    key: 0,
    url: '',
    application: '',
    status: true,
    event: 'all',
  });

  const [ originWebHookInfo, saveOriginWebHookInfo ] = useState<IWebHookInfo>({
    name: '',
    description: '',
    key: 0,
    url: '',
    application: '',
    status: true,
    event: 'all'
  });

  const handleChange = (e: SyntheticEvent, detail: InputOnChangeData | TextAreaProps | DropdownProps | CheckboxProps, type: string) => {
    const value = detail.value;
    // @ts-ignore detail value
    webHookInfo[type] = value;

    saveWebHookInfo({...webHookInfo});
  };

  return {
    webHookInfo,
    originWebHookInfo,
    handleChange,
    saveWebHookInfo,
    saveOriginWebHookInfo,
  };
};

export const useReactHookForm = () => {
  return {
    ...useForm(),
  };
};
