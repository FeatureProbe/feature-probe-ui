import { ReactElement } from 'react';
import { IntlProvider } from 'react-intl';
import zh_CN from './zh-CN.json';
import en_US from './en-US.json';

interface IProps {
  children: ReactElement
}

const Intl = (props: IProps) => {
  const { children } = props;
  
  const chooseLocale = (val: string) => { 
    let _val = val || navigator.language.split('_')[0];
    switch (_val) {
      case 'en':
        return en_US;
      case 'zh':
        return zh_CN;
      default:
        return en_US;
    }
  }
  
  return (
    <IntlProvider
      locale='en'
      messages={chooseLocale('en')}
    >
      {children}
    </IntlProvider>
  )
}

export default Intl;