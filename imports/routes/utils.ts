import { Locale } from '../i18n';
import routesTree from './routesTree';
import {
  IRouteProps,
  IRouteBranch,
  IRouteBranchName,
} from '../types/routeTypes';

const getPathPart = (
  lng: Locale,
  routeBranch: IRouteBranch,
): string => {
  if (routeBranch.pathPartValues) {
    return routeBranch.pathPartValues[lng] || routeBranch.pathPartValues[Locale.en];
  }
  return typeof routeBranch.any === 'string'
    ? routeBranch.any
    : `:${routeBranch.name}`;
};

const getRouteProps = (
  lng: Locale,
  currentPath: string,
  routeBranch: IRouteBranch,
): IRouteProps & {
  exact: boolean;
  path: string;
} => ({
  exact: !routeBranch.subbranches,
  path: `${currentPath}/${getPathPart(lng, routeBranch)}`,
  ...routeBranch,
});

export const getRoute = (
  language: string,
  routeName: IRouteBranchName,
): IRouteProps | undefined => {
  const lng = language in Locale ? Locale[language as Locale] : Locale.en;

  const checkRoutesInBranch = (
    routeBranch: IRouteBranch,
    currentPath: string,
  ): IRouteProps | undefined => {
    const routeProps = getRouteProps(lng, currentPath, routeBranch);

    if (routeBranch.name === routeName && routeBranch.componentName) {
      return routeProps;
    }
    if (routeBranch.subbranches) {
      // eslint-disable-next-line no-restricted-syntax
      for (const child of routeBranch.subbranches) {
        const checkResult = checkRoutesInBranch(child, routeProps.path);
        if (checkResult) {
          return checkResult;
        }
      }
    }
    return undefined;
  };
  return checkRoutesInBranch(routesTree[0], '');
};

export const getAllRoutes = (
  language: string,
  options?: {
    depth?: number;
    withComponent?: boolean;
  },
): IRouteProps[] => {
  const lng = language in Locale ? Locale[language as Locale] : Locale.en;
  const { depth, withComponent } = options || {};

  const getRoutesInBranch = (
    routeBranch: IRouteBranch,
    currentPath: string,
    currentDepth?: number,
  ): IRouteProps[] => {
    const routeProps = getRouteProps(lng, currentPath, routeBranch);
    const currentRouteBranch = !withComponent || routeBranch.componentName
      ? [routeProps] as IRouteProps[]
      : [];

    if (depth && currentDepth === depth) {
      return currentRouteBranch;
    }

    return (routeBranch.subbranches || []).reduce(
      (result, child) => [
        ...result,
        ...getRoutesInBranch(child, routeProps.path, (currentDepth || 0) + 1),
      ],
      currentRouteBranch,
    );
  };
  return getRoutesInBranch(routesTree[0], '');
};

export const getPath = (language: string, ...routeParts: string[]): string => {
  const lng = language in Locale ? Locale[language as Locale] : Locale.en;

  const pathParts: string[] = ['', Locale[lng]];
  let branches = routesTree[0].subbranches;

  for (let i = 0; i < routeParts.length; i += 1) {
    if (branches === undefined) break;

    const part = routeParts[i];
    const branch = branches.find((b) => b.name === part)
      || branches.find((b) => typeof b.any === 'string' || !b.pathPartValues);

    if (branch === undefined) {
      console.error(
        'Error in routesPaths.path. Arguments do not correspond to a route path.',
        '\nArguments:', [lng, ...routeParts],
        '\nUnknown part:', part, 'in branches:', branches,
      );
      return `/${lng}`;
    }

    const newPathPart = getPathPart(lng, branch);

    pathParts.push(newPathPart.slice(0, 1) === ':' ? part : newPathPart);
    branches = branch.subbranches;
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
      ...branch.subbranches
        ? translateFurther(parts.slice(1), branch.subbranches)
        : [],
    ];
  };

  return [''].concat(translateFurther(initParts, initBranches)).join('/');
};
