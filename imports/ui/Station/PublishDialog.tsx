/* global window */
import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';

import Broadcasts from '../../api/broadcasts/broadcasts';
import { broadcastGetAddresses } from '../../api/broadcasts/methods';
import { IBroadcast } from '../../types';
import useUnmountedRef from '../../hooks/unmountedRef';

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
  links: {
    margin: theme.spacing(1),
  },
}));

interface IPublishDialogProps {
  broadcastOwnerId: string;
  handleClose: () => void;
  open?: boolean;
}

export const PublishDialog: React.FC<IPublishDialogProps> = ({
  broadcastOwnerId,
  handleClose,
  open = false,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const unmountedRef = useUnmountedRef();
  const location = useLocation();

  const [addresses, setAddresses] = useState<IBroadcast['addresses'] | undefined>();

  const subscriptionReady = useTracker(() => Meteor.subscribe('broadcast.addresses', broadcastOwnerId), [broadcastOwnerId]);

  useEffect(() => {
    if (!addresses) {
      broadcastGetAddresses.call({ broadcastOwnerId }, (_err, res) => {
        if (res && !unmountedRef.current) {
          console.log('From PublishDialog.broadcastGetAddresses.callback. res:', res);
          setAddresses(res);
        }
      });
    }
  });

  const captions = {
    readOnly: t('station.Read only', 'Read only'),
    navigate: t('station.Navigate', 'Navigate'),
    control: t('station.Control', 'Control'),
  };

  console.log('From PublishDialog, render. location:', location, 'broadcastOwnerId:', broadcastOwnerId, 'addresses:', addresses, 'subscriptionReady:', subscriptionReady, 'Broadcasts:', Broadcasts);

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="dialog-name">
      <DialogTitle id="dialog-name">
        {t('station.Publication links', 'Publication links')}
      </DialogTitle>
      <DialogContent className={classes.content}>
        {addresses && addresses.length > 1
          ? addresses.reverse().map((address) => (address.rights === 'owner' ? undefined : (
            <TextField
              className={classes.links}
              label={captions[address.rights] + t('colon')}
              key={address.rights}
              value={`${window.location.origin}/${address.id}`}
              variant="outlined"
            />
          ))) : (
            <CircularProgress />
          )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          <ArrowBackIos />
          {t('Return')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PublishDialog;
