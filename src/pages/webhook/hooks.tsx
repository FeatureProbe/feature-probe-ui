import { SyntheticEvent, useState } from 'react';
import { InputOnChangeData, TextAreaProps, DropdownProps, CheckboxProps } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { IWebHookInfo, WebHookStatus } from 'interfaces/webhook';

export const useWebHookInfo = () => {
  const [webHookInfo, saveWebHookInfo] = useState<IWebHookInfo>({
    name: '',
    description: '',
    url: '',
    status: WebHookStatus.ENABLE,
  });

  const [ originWebHookInfo, saveOriginWebHookInfo ] = useState<IWebHookInfo>({
    name: '',
    description: '',
    url: '',
    status: WebHookStatus.ENABLE,
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
