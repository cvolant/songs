import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
  },
  spacedText: {
    lineHeight: '2',
  },
}));

export const FolderListDefaultEmpty: React.FC<{}> = () => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography>
        {t('search.Nothing found so far', 'Nothing found so far.')}
      </Typography>
    </div>
  );
};

export default FolderListDefaultEmpty;
