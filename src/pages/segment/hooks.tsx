/*
 * @Author: mayinlong
 * @Date: 2022-10-28 10:13:19
 * @LastEditTime: 2022-10-28 11:00:32
 * @FilePath: /fp-ui/src/pages/segment/hooks.tsx
 * @Description: 
 */
import { SyntheticEvent, useState } from 'react';
import { InputOnChangeData, TextAreaProps } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';

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
    // @ts-ignore detail value
    segmentInfo[type] = value;
    saveSegmentInfo({...segmentInfo});
  };

  return {
    segmentInfo,
    originSegmentInfo,
    handleChange,
    saveSegmentInfo,
    saveOriginSegmentInfo,
  };
};

export const useEnvironmentInfo = () => {
  const [ environmentInfo, saveEnvironmentInfo ] = useState({
    name: '',
    key: '',
  });

  const [ originEnvironmentInfo, saveOriginEnvironmentInfo ] = useState({
    name: '',
    key: '',
  });

  const handleChange = (e: SyntheticEvent, detail: InputOnChangeData | TextAreaProps , type: string) => {
    const { value } = detail;
    // @ts-ignore detail value
    environmentInfo[type] = value;
    saveEnvironmentInfo({...environmentInfo});
  };

  return {
    environmentInfo,
    originEnvironmentInfo,
    handleChange,
    saveEnvironmentInfo,
    saveOriginEnvironmentInfo,
  };
};

export const useReactHookForm = () => {
  return {
    ...useForm(),
  };
};
