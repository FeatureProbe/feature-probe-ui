import { useCallback, useRef } from "react";
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
  let searchTime = useRef(0);

  const saveSearchTime = (time: number) => {
    searchTime.current = time;
  }

  const setSearchTime = useCallback(saveSearchTime, []);

  const check = useCallback((time: number) => {
    return time === searchTime.current;
  }, [searchTime]);

  return {
    setSearchTime,
    check
  }
}