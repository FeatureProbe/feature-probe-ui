import { createContainer } from "unstated-next";
import { useLocalStorage } from "utils/hooks";
import { useState } from 'react';

export const usePutaway = () => {
  const [ isPutAway, setIsputAway ] = useLocalStorage('sidebarIsPutAway', false);

  return { 
    isPutAway, 
    setIsputAway, 
  };
};

export const useUserInfo = () => {
  const [ userInfo, saveUserInfo ] = useState({
    account: '',
    role: '',
  });

  return {
    userInfo,
    saveUserInfo,
  }
};

export const SidebarContainer = createContainer(usePutaway);
export const HeaderContainer = createContainer(useUserInfo);
