import { Locale } from '../i18n';
import routesTree from './routesTree';
import { IRouteBranch, IRouteBranchName, IRouteProps } from '../types/routeTypes';

const newPathPart = (routeBranch: IRouteBranch, lng: Locale): string => {
  if (routeBranch.pathPartValues) {
    return routeBranch.pathPartValues[lng] || routeBranch.pathPartValues[Locale.en];
  }
  return typeof routeBranch.any === 'string'
    ? routeBranch.any
    : `:${routeBranch.name}`;
};

export const getRoute = (
  language: Locale,
  routeName: IRouteBranchName,
): IRouteProps | undefined => {
  const lng = language in Locale ? Locale[language as Locale] : Locale.en;

  const checkRoutesInBranch = (
    routeBranch: IRouteBranch,
    currentPath: string,
  ): IRouteProps | undefined => {
    const path = `${currentPath}/${newPathPart(routeBranch, lng)}`;

    if (routeBranch.name === routeName && routeBranch.componentName) {
      return {
        exact: true,
        path,
        ...routeBranch,
      } as IRouteProps;
    }
    if (routeBranch.children) {
      // eslint-disable-next-line no-restricted-syntax
      for (const child of routeBranch.children) {
        const checkResult = checkRoutesInBranch(child, path);
        if (checkResult) {
          return checkResult;
        }
      }
    }
    return undefined;
  };
  return checkRoutesInBranch(routesTree[0], '');
};

export const getAllRoutes = (language: string): IRouteProps[] => {
  const lng = language in Locale ? Locale[language as Locale] : Locale.en;

  const getRoutesInBranch = (
    routeBranch: IRouteBranch,
    currentPath: string,
  ): IRouteProps[] => {
    const path = `${currentPath}/${newPathPart(routeBranch, lng)}`;

    return (routeBranch.children || []).reduce(
      (result, child) => [
        ...result,
        ...getRoutesInBranch(child, path),
      ],
      routeBranch.componentName ? [{
        exact: true,
        path,
        ...routeBranch,
      }] as IRouteProps[] : [],
    );
  };
  return getRoutesInBranch(routesTree[0], '');
};

export const getPath = (language: string, ...routeParts: string[]): string => {
  const lng = language in Locale ? Locale[language as Locale] : Locale.en;

  const pathParts: string[] = ['', Locale[lng]];
  let branches = routesTree[0].children;

  for (let i = 0; i < routeParts.length; i += 1) {
    if (branches === undefined) break;

    const part = routeParts[i];
    const branch = branches.find((b) => b.name === part)
      || branches.find((b) => typeof b.any === 'string' || !b.pathPartValues);

    if (branch === undefined) {
      console.error('Error in routesPaths.path. Arguments do not correspond to a route path. arguments:', [lng, ...routeParts]);
      return `/${lng}`;
    }

    pathParts.push(newPathPart(branch, lng));
    branches = branch.children;
  }

  return pathParts.join('/');
};

export const translatePath = (formerPath: string, language: string): string => {
  const newLng = language in Locale ? Locale[language as Locale] : Locale.en;

  const splited = formerPath.split('/');
  const lng = splited[1];
  if (lng === newLng) return formerPath;

  const initParts = splited.slice(1);
  const initBranches = routesTree;

  const translateFurther = (
    parts: string[],
    branches: IRouteBranch[] | undefined,
  ): string[] => {
    if (branches === undefined) {
      return [...parts];
    }

    const pathPart = parts[0];

    let branch = branches.find((b) => b.pathPartValues
      && Object.values(b.pathPartValues).includes(pathPart));
    if (!branch) {
      branch = branches.find((b) => typeof b.any === 'string' || !b.pathPartValues);
    }
    if (!branch) {
      return [...parts];
    }

    const translatedPart = branch.pathPartValues
      ? branch.pathPartValues[Locale[newLng]] || branch.pathPartValues[Locale.en]
      : pathPart;

    return [
      translatedPart,
      ...branch.children
        ? translateFurther(parts.slice(1), branch.children)
        : [],
    ];
  };

  return [''].concat(translateFurther(initParts, initBranches)).join('/');
};
