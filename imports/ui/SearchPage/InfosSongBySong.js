import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

import Panel from '../utils/Panel';

import {
  Button,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
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

export const InfosSongBySong = props => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Panel className={classes.root} handleClosePanel={props.handleCloseInfos} closeName={t('infos.Close infos', "Close infos")}>
      <div className={classes.text}>
        <div className={classes.logoSpace} />
        <Typography variant="h2" component="h2" gutterBottom>
          {t('infos.Search title', "Search")}
        </Typography>
        <Typography component="p">
          {t('infos.Search details', "")}
        </Typography>
      </div>
      {props.children}
      <div className={classes.bottomButtons}>
        <Button component={Link} to="/signin" variant="contained" color="primary" className={classes.button}>
          {t('Sign in')}
        </Button>
        <Button component={Link} to="/signup" variant="contained" color="primary" className={classes.button}>
          {t("infos.Create account", "Create account").replace(/\/\//g, '\xa0')}
        </Button>
      </div>
    </Panel>
  );
}

InfosSongBySong.propTypes = {
  handleCloseInfos: PropTypes.func.isRequired,
};

export default InfosSongBySong;