/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-props-no-spreading */
import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import CircularProgress from '@material-ui/core/CircularProgress';

import PageLayout from '../utils/PageLayout';
import FullCardLayout from '../utils/FullCardLayout';

const MarkDownText = React.lazy(() => import('../utils/MarkDownText'));

export const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <PageLayout title={t('About')}>
      <FullCardLayout bigTitle headerTitle={t('About')}>
        <Suspense fallback={<CircularProgress />}>
          <MarkDownText source={t('texts:about.content', { joinArrays: '\n' })} />
        </Suspense>
      </FullCardLayout>
    </PageLayout>
  );
};
export default AboutPage;
