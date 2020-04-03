import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  Context,
  ReactElement,
} from 'react';

export type IMenuContext = {
  logoMenuDeployed: boolean;
  logoMenuDisabled?: boolean;
  toggleLogoMenu: (open?: boolean) => void;
  enableLogoMenu: () => void;
  disableLogoMenu: () => void;
  handleToggleLogoMenu: (open?: boolean) => () => void;
};

const MenuContext = createContext<IMenuContext | null>(null);

const useMenu = (): IMenuContext => useContext(MenuContext as Context<IMenuContext>);

interface IMenuProviderProps {
  children: ReactElement | ReactElement[];
}

const MenuProvider: React.FC<IMenuProviderProps> = ({ children }) => {
  const [logoMenuDeployed, setLogoMenuDeployed] = useState(true);
  const [logoMenuDisabled, setLogoMenuDisabled] = useState(false);

  const toggleLogoMenu = useCallback((open?: boolean): void => {
    setLogoMenuDeployed((prevLMD: boolean) => (typeof open === 'undefined' ? !prevLMD : open));
  }, []);

  const handleToggleLogoMenu = useCallback(
    (open?: boolean) => (): void => toggleLogoMenu(open),
    [toggleLogoMenu],
  );

  const enableLogoMenu = useCallback((): void => {
    setLogoMenuDisabled(false);
  }, []);

  const disableLogoMenu = useCallback((): void => {
    setLogoMenuDisabled(true);
  }, []);

  return (
    <MenuContext.Provider
      value={{
        logoMenuDeployed,
        logoMenuDisabled,
        toggleLogoMenu,
        enableLogoMenu,
        disableLogoMenu,
        handleToggleLogoMenu,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export { MenuProvider, useMenu };
