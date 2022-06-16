import { SyntheticEvent, useState } from 'react';
import { InputOnChangeData, TextAreaProps } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';

export const useProjectInfo = () => {
  const [ projectInfo, saveProjectInfo ] = useState({
    name: '',
    key: '',
    description: '',
  });

  const [ originProjectInfo, saveOriginProjectInfo ] = useState({
    name: '',
    key: '',
    description: '',
  });

  const handleChange = (e: SyntheticEvent, detail: InputOnChangeData | TextAreaProps , type: string) => {
    const { value } = detail;
    // @ts-ignore
    projectInfo[type] = value;
    saveProjectInfo({...projectInfo});
  }

  return {
    projectInfo,
    originProjectInfo,
    handleChange,
    saveProjectInfo,
    saveOriginProjectInfo,
  }
}

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
    // @ts-ignore
    environmentInfo[type] = value;
    saveEnvironmentInfo({...environmentInfo});
  }

  return {
    environmentInfo,
    originEnvironmentInfo,
    handleChange,
    saveEnvironmentInfo,
    saveOriginEnvironmentInfo,
  }
}

export const useReactHookForm = () => {
  return {
    ...useForm(),
  }
}