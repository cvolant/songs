import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { IRouteBranchName } from '../types/routeTypes';

type IUsePath = {
  path: (
    pathParts: (IRouteBranchName | undefined)[] | IRouteBranchName,
    params?: Partial<Record<IRouteBranchName, string>>,
  ) => string;
  translatePath: (
    pathParts: (IRouteBranchName | undefined)[] | string,
    lng?: string,
  ) => string;
};

type IGetDataByLanguage = (lng: string) => Record<'translation' | 'paths' | 'texts', {
  [key: string]: string;
}>;

export const usePath = (from?: string): IUsePath => {
  const { t, i18n: { language, languages, getDataByLanguage } } = useTranslation();
  const { state } = useLocation();

  const localPathParts: {
    [index: string]: IRouteBranchName;
  } = useMemo(
    () => languages.reduce((res, lng) => ({
      ...res,
      ...Object.entries((getDataByLanguage as IGetDataByLanguage)(lng).paths).reduce(
        (localRes, entry) => ({
          [entry[1] as string]: entry[0],
          ...localRes,
        }),
        {},
      ),
    }), {}),
    [getDataByLanguage, languages],
  );

  const getPath = useCallback(({ pathParts, lng, params }: {
    pathParts: (IRouteBranchName | undefined)[] | IRouteBranchName;
    lng: string;
    params?: Partial<Record<IRouteBranchName, string>>;
  }) => {
    const pathPartsArray = (typeof pathParts === 'string' ? [pathParts] : pathParts);
    return pathPartsArray.reduce(
      (res, pathPart) => (pathPart ? [
        res,
        pathPart[0] === ':' ? (params && params[pathPart]) || pathPart : t(`paths:${pathPart}`, pathPart, { lng }),
      ].join('/') : res),
      `/${lng}`,
    );
  }, [t]);


  const path: IUsePath['path'] = useCallback(
    (pathParts, params) => getPath({ pathParts, lng: language, params }),
    [getPath, language],
  );

  const translatePath: IUsePath['translatePath'] = useCallback((pathParts, lng = language) => {
    const pathArray: IRouteBranchName[] = [];
    const params: Partial<Record<IRouteBranchName, string>> = {};
    const pathPartsArray = typeof pathParts === 'string'
      ? pathParts.split('/')
      : pathParts as string[];

    for (let i = 0; i < pathPartsArray.length; i += 1) {
      const pathPart = pathPartsArray[i];
      if (i > 2 || !languages.includes(pathPart)) {
        if (state?.params && state.params.includes(i)) {
          const paramName = `:param${i}` as IRouteBranchName;
          pathArray.push(paramName);
          params[paramName] = pathPart;
        } else if (localPathParts[pathPart] !== undefined) {
          pathArray.push(localPathParts[pathPart]);
        } else {
          console.log('From usePath, translatePath. undefined. pathPart:', pathPart, 'pathPartsArray:', pathPartsArray);
          return '';
        }
      }
    }
    return getPath({ pathParts: pathArray, lng, params });
  }, [language, getPath, languages, state, localPathParts]);

  console.log(`From usePath, called${from ? ` from ${from}` : ''}.`, { path, translatePath, getPath }, 'localPathParts:', localPathParts, 'location.state:', state);

  return { path, translatePath };
};

export default usePath;
