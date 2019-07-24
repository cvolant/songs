export const routesPaths = {
  lang: {
    en: '/en',
    fr: '/fr',
  },
  home: {
    any: '/',
  },
  signin: {
    en: '/signin',
    fr: 'connexion',
  },
  signup: {
    en: '/signup',
    fr: '/inscription',
  },
  dashboard: {
    en: '/dashboard',
    fr: '/espace-personnel',
  },
  search: {
    en: '/search',
    fr: '/recherche',
    ":id": {
      variable: '/:id',
    },
  },
  translatePath: function (formerPath, newLng) {
    if (!this.lang[newLng]) {
      console.error('Impossible to translate path. Unknown language:', newLng);
      return;
    }
    const splited = formerPath.split('/');
    const lng = splited[1];
    if (lng == newLng) return formerPath;

    const initTranslatedPath = this.lang[newLng];
    const initParts = splited.slice(2);
    const initPlace = this;

    const translateFurther = (translatedPath, parts, place) => {
      if (parts.length === 0) return translatedPath;

      const pathPart = '/' + parts[0];
      let translatedPart;
      let newPlace;

      for (let key in place) {
        const value = place[key];
        if (value.constructor.name == 'Object' && value.any == pathPart || value[lng] == pathPart || value.variable) {
          translatedPart = value.any || value[newLng] || value.variable && pathPart;
          newPlace = value;
          break;
        }
      }
      
      if (translatedPart)
        return translateFurther(translatedPath + translatedPart, parts.slice(1), newPlace);
      else
        return translatedPath;
    };

    return translateFurther(initTranslatedPath, initParts, initPlace);
  },
  path: function (lng, ...routeParts) {
    const pathParts = [this.lang[lng]];
    let currentPlace = this;
    routeParts.forEach(part => {
      currentPlace = currentPlace[part];
      pathParts.push(currentPlace.any || currentPlace[lng] || currentPlace.variable);
    });
    return pathParts.join('');
  },
};

/* 
  getPaths: function (lang) {
    const paths = {};
    Object.entries(this).forEach(([key, value]) => {
      if (value.constructor.name == 'Object') {
        const keyPaths = [];
        Object.values(value).forEach(subValue => {
          if (typeof subValue == 'string') this.lang[lang] + subValue;
          if (subValue.constructor.name == 'Object') this.lang[lang] + subValue;
        });
        paths[key] = () => keyPaths;
      }
    });
    return paths;
  },
  rightPath: function (route, lang) {
    const isArray = Array.isArray(route);
    const routeName = isArray ? route[0] : route;
    const routeTail = isArray ? route[1] : '';
    return this.lang[lang] + this[routeName][lang] + routeTail;
  },
  formerGetPaths: function (route, lang) {
    const isArray = Array.isArray(route);
    const routeName = isArray ? route[0] : route;
    const routeTail = isArray ? route[1] : '';

    if (this[routeName]) {
      const possiblePaths = Object.values(this[routeName]).map(path => this.lang[lang] + path + routeTail);
      return {
        possiblePaths,
        rightPath: this.lang[lang] + this[routeName][lang] + routeTail,
      }
    } else {
      console.error('The route name is invalid, no route correspond to this name:', routeName);
    }
  },
};
*/

export default routesPaths;

/* 
f: lang => {
  const path = [];
  const container = this;
  path.push(this.lang[lang]);
  return prop => {
    path.push(container[prop])
  }
}
{
  search: prop => prop ?
    ['lang/search', 'lang/recherche'] :
    subPaths[prop] 
}
 */