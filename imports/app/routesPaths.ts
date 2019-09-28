enum Locale {
  en = 'en',
  fr = 'fr',
}

interface PathPart {
  name: string;
  pathPartValues?: {
    [Locale.en]: string;
    [Locale.fr]?: string;
  };
  optional?: boolean;
  variable?: boolean;
  any?: string;
  children?: PathPart[];
}

export const routesPaths: {
  pathTree: PathPart[];
  translatePath: (formerPath: string, newLng: Locale) => string;
  path: (lng: Locale, ...routeParts: string[]) => string;
} = {
  pathTree: [
    {
      name: 'lang',
      optional: true,
      pathPartValues: {
        [Locale.en]: Locale.en,
        [Locale.fr]: Locale.fr,
      },
      children: [
        {
          name: 'home',
          any: '',
        },
        {
          name: 'signin',
          pathPartValues: {
            [Locale.en]: 'signin',
            [Locale.fr]: 'connexion',
          },
        },
        {
          name: 'signup',
          pathPartValues: {
            [Locale.en]: 'signup',
            [Locale.fr]: 'inscription',
          },
        },
        {
          name: 'dashboard',
          pathPartValues: {
            [Locale.en]: 'dashboard',
            [Locale.fr]: 'espace-personnel',
          },
        },
        {
          name: 'search',
          pathPartValues: {
            [Locale.en]: 'search',
            [Locale.fr]: 'recherche',
          },
          children: [
            {
              name: 'songId',
              variable: true,
            },
          ],
        },
      ],
    },
  ],
  path(lng: Locale, ...routeParts: string[]): string {
    const pathParts: string[] = ['', Locale[lng]];
    let branches = this.pathTree[0].children;
    for (let i = 0; i < routeParts.length; i += 1) {
      if (branches === undefined) break;
      const part = routeParts[i];
      const eligiblesBranches = branches.filter((b) => b.name === part || b.variable);
      if (eligiblesBranches.length > 1) console.warn('From routesPaths.path. More than one eligible branches. path part:', part, 'eligibles branches:', eligiblesBranches);
      const branch = eligiblesBranches[0];
      if (branch === undefined) {
        console.error('Error in routesPaths.path. Arguments do not correspond to a route path. arguments:', [lng, ...routeParts]);
        break;
      }
      let newPathPart;
      if (branch.pathPartValues !== undefined) {
        const branchValue = branch.pathPartValues[lng]
          ? branch.pathPartValues[lng]
          : branch.pathPartValues[Locale.en];
        newPathPart = branchValue;
      } else {
        newPathPart = branch.any || branch.variable ? part : '';
      }
      if (newPathPart) pathParts.push(newPathPart);
      branches = branch.children;
    }

    return pathParts.join('/');
  },
  translatePath(formerPath: string, newLng: Locale): string {
    if (!Locale[newLng]) {
      console.error('Impossible to translate path. Unknown language:', newLng);
      return '';
    }
    const splited = formerPath.split('/');
    const lng = splited[1];
    if (lng === newLng) return formerPath;

    const initTranslatedPath = '';
    const initParts = splited.slice(1);
    const initBranches = this.pathTree;

    const translateFurther = (
      translatedPath: string,
      parts: string[],
      branches: PathPart[] | undefined,
    ): string => {
      if (parts.length === 0) return translatedPath;
      if (branches === undefined) return [translatedPath, ...parts].join('/');

      const pathPart = parts[0];
      let translatedPart = '';

      for (let i = 0; i < branches.length; i += 1) {
        const branch = branches[i];
        const { pathPartValues } = branch;
        const containValue = pathPartValues !== undefined
          && Object.values(pathPartValues).includes(pathPart);
        if (containValue || branch.any === pathPart || branch.variable) {
          if (containValue) {
            translatedPart = pathPartValues[Locale[newLng]] || pathPartValues[Locale.en];
          } else {
            translatedPart = pathPart;
          }
          const newTranslatedPart = translatedPart ? [translatedPath, translatedPart].join('/') : translatedPath;
          return translateFurther(newTranslatedPart, parts.slice(1), branch.children);
        }
      }
      return translatedPath;
    };

    return translateFurther(initTranslatedPath, initParts, initBranches);
  },
};

export default routesPaths;
