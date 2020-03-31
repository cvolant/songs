import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Session } from 'meteor/session';
import React, { useEffect, useMemo } from 'react';
import {
  Switch, useHistory, useLocation, match as IMatch,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

import Route from './Route';
import { getAllRoutes, getPath } from './utils';
import { Locale } from '../i18n';
import { TITLE, DEFAULT_LNG } from '../config';

interface IRoutesProps {
  match: IMatch<{ lng?: Locale }>;
}

export const Routes: React.FC<IRoutesProps> = ({
  match: { params: { lng } },
}) => {
  console.log('From Routes. render. lng:', lng);
  const { i18n } = useTranslation();
  const history = useHistory();
  const { pathname, search } = useLocation();

  useEffect(() => {
    console.log('From Routes, useEffect1.');
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
    console.log('From Routes, useEffect2.');
    if (lng && Object.values(Locale).includes(lng as Locale)) {
      Tracker.autorun(() => {
        const isAuthenticated = !!Meteor.userId();
        const currentPagePrivacy = Session.get('currentPagePrivacy');
        const isUnauthenticatedPage = currentPagePrivacy === 'unauth';
        const isAuthenticatedPage = currentPagePrivacy === 'auth';

        if (isUnauthenticatedPage && isAuthenticated) {
          const { state } = history.location as { state?: { from?: string } };
          if (state && state.from) {
            history.replace(history.location.pathname.indexOf(getPath(lng, 'signin')) >= 0 ? state.from : getPath(lng, 'dashboard'));
          } else {
            history.replace(getPath(lng, 'dashboard'));
          }
        } else if (isAuthenticatedPage && !isAuthenticated) {
          history.replace(`/${lng}`);
        }
      });
    }
  }, [lng, history]);

  const allRoutes = useMemo(() => getAllRoutes(lng as Locale), [lng]);

  return (
    <>
      <Helmet>
        <html lang={lng} />
        <title>{TITLE}</title>
      </Helmet>
      <Switch>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        {allRoutes.map((route) => <Route key={route.name} {...route} />)}
      </Switch>
    </>
  );
};

export default Routes;
