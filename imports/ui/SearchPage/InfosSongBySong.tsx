import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Panel from '../utils/Panel';

const useStyles = makeStyles((theme) => ({
  bottomButtons: {
    display: 'flex',
    flexDirection: 'column',
  },
  button: {
    alignSelf: 'center',
    margin: theme.spacing(1, 0),
    maxWidth: '45rem',
    width: '100%',
    textAlign: 'center',
  },
  logoSpace: {
    borderRadius: '0 0 0 100%',
    float: 'right',
    height: '10rem',
    width: '10rem',
  },
  root: {
    height: '100%',
  },
  text: {
    overflow: 'auto',
    overflowWrap: 'break-word',
    marginTop: theme.spacing(1),
  },
}));

interface IInfosSongBySongProps {
  handleCloseInfos: () => void;
  children: React.ReactNode;
}

export const InfosSongBySong: React.FC<IInfosSongBySongProps> = ({
  handleCloseInfos, children,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Panel className={classes.root} handleClosePanel={handleCloseInfos} closeName={t('infos.Close infos', 'Close infos')}>
      <div className={classes.text}>
        <div className={classes.logoSpace} />
        <Typography variant="h2" component="h2" gutterBottom>
          {t('infos.Search title', 'Search')}
        </Typography>
        <Typography component="p">
          {t('infos.Search details', '')}
        </Typography>
      </div>
      {children}
      <div className={classes.bottomButtons}>
        <Button component={Link} to="/signin" variant="contained" color="primary" className={classes.button}>
          {t('Sign in')}
        </Button>
        <Button component={Link} to="/signup" variant="contained" color="primary" className={classes.button}>
          {t('infos.Create account', 'Create account').replace(/\/\//g, '\xa0')}
        </Button>
      </div>
    </Panel>
  );
};

export default InfosSongBySong;
