import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Session } from 'meteor/session';
import React, { useEffect, useMemo } from 'react';
import {
  useHistory,
  useLocation,
  match as IMatch,
  Redirect,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

import usePath from '../hooks/usePath';
import MainRoutes from './MainRoutes';
import { Locale } from '../i18n';
import { TITLE, DEFAULT_LNG } from '../config';

interface IRoutesConfigProps {
  match: IMatch<{ lng?: Locale }>;
}

export const RoutesConfig: React.FC<IRoutesConfigProps> = ({
  match: { params: { lng } },
}) => {
  const { i18n } = useTranslation();
  const history = useHistory();
  const { pathname, search } = useLocation();
  const { path, translatePath } = usePath('Routes');

  useEffect(() => {
    const i18nLng = i18n.language.toLocaleLowerCase().slice(0, 2) as Locale;
    if (lng === undefined || !Object.values(Locale).includes(lng as Locale)) {
      history.replace(`/${
        (Object.values(Locale).includes(i18nLng) ? i18nLng : DEFAULT_LNG)
        + pathname
        + search
      }`);
    } else if (i18n.language !== lng) {
      i18n.changeLanguage(lng);
    }
  }, [lng, history, i18n, pathname, search]);

  useEffect(() => {
    if (lng && Object.values(Locale).includes(lng as Locale)) {
      Tracker.autorun(() => {
        const isAuthenticated = !!Meteor.userId();
        const currentPagePrivacy = Session.get('currentPagePrivacy');
        const isUnauthenticatedPage = currentPagePrivacy === 'unauth';
        const isAuthenticatedPage = currentPagePrivacy === 'auth';

        if (isUnauthenticatedPage && isAuthenticated) {
          const { state } = history.location as { state?: { from?: string } };
          if (state && state.from) {
            history.replace(history.location.pathname.indexOf(path('signin')) >= 0 ? state.from : path('dashboard'));
          } else {
            history.replace(path('dashboard'));
          }
        } else if (isAuthenticatedPage && !isAuthenticated) {
          history.replace(`/${lng}`);
        }
      });
    }
  }, [lng, history, path]);

  const pathTranslation = useMemo(() => {
    const translatedPath = translatePath(pathname, lng);
    if (translatedPath) {
      return translatedPath !== pathname ? translatedPath : '';
    }
    return '';
  }, [translatePath, pathname, lng]);

  console.log('From Routes. render lng:', lng, 'i18n:', i18n, 'tranlatePath:', translatePath, 'pathname:', pathname, 'pathTranslation:', pathTranslation);

  return (
    <>
      <Helmet>
        <html lang={lng} />
        <title>{TITLE}</title>
      </Helmet>
      {pathTranslation && <Redirect to={pathTranslation + search} />}
      <MainRoutes />
    </>
  );
};

export default RoutesConfig;
