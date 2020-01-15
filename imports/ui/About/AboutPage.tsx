import React from 'react';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';

import PageLayout from '../utils/PageLayout';
import FullCardLayout from '../utils/FullCardLayout';

export const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <PageLayout title={t('About')}>
      <FullCardLayout bigTitle headerTitle={t('About')}>
        <Typography>{t('about.Content', 'Some interesting content')}</Typography>
      </FullCardLayout>
    </PageLayout>
  );
};
export default AboutPage;
