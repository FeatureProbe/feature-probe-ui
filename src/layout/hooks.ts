import { createContainer } from "unstated-next";
import { useLocalStorage } from "utils/hooks";

export const usePutaway = () => {
  const [ isPutAway, setIsputAway ] = useLocalStorage('sidebarIsPutAway', false);

  return { 
    isPutAway, 
    setIsputAway, 
  };
};

export const SidebarContainer = createContainer(usePutaway);
