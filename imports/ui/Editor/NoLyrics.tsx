import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

const useStyles = makeStyles((theme) => ({
  card: {
    height: '100%',
    margin: theme.spacing(1),
    width: '100%',
  },
}));

export const NoLyrics: React.FC<{}> = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Grid item xs={12} sm={6} md={4} xl={3}>
      <Card
        className={classes.card}
        elevation={0}
        raised={false}
      >
        <CardHeader
          subheader={t('editor.No lyrics', 'No lyrics')}
          subheaderTypographyProps={{ color: 'textPrimary' }}
        />
      </Card>
    </Grid>
  );
};

export default NoLyrics;
