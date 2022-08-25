import { createContainer } from "unstated-next";
import { useLocalStorage } from "utils/hooks";

export const useI18N = () => {
  const [ i18n, setI18n ] = useLocalStorage('i18n', 'en-US');

  return { 
    i18n, 
    setI18n, 
  };
};

export const I18NContainer = createContainer(useI18N);

export const useSearchTime = () => {
  let searchTime: number = 0;
  return {
    searchTime,
    setSearchTime: (time: number) => {
      searchTime = time;
    },
    check: (time: number) => {
      return time === searchTime;
    }
  }
}