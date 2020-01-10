import { Meteor } from 'meteor/meteor';
import React, { Fragment, useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';

import Broadcasts from '../../api/broadcasts/broadcasts';
import { broadcastGetAddresses } from '../../api/broadcasts/methods';
import { IBroadcast } from '../../types';

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

  const [addresses, setAddresses] = useState<IBroadcast['addresses'] | undefined>();

  const subscriptionReady = useTracker(() => Meteor.subscribe('broadcast.addresses', broadcastOwnerId), [broadcastOwnerId]);

  broadcastGetAddresses.call({ broadcastOwnerId }, (_err, res) => {
    if (res) {
      console.log('From PublishDialog.broadcastGetAddresses.callback. res:', res);
      setAddresses(res);
    }
  });

  const captions = {
    readOnly: t('station.Read only', 'Read only'),
    navigate: t('station.Navigate', 'Navigate'),
    control: t('station.Control', 'Control'),
  };

  console.log('From PublishDialog, render. broadcastOwnerId:', broadcastOwnerId, 'addresses:', addresses, 'subscriptionReady:', subscriptionReady, 'Broadcasts:', Broadcasts);

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="dialog-name">
      <DialogTitle id="dialog-name">
        {t('station.Publication links', 'Publication links')}
      </DialogTitle>
      <DialogContent>
        {addresses && addresses.length > 1
          ? addresses.reverse().map((address) => (address.rights === 'owner' ? undefined : (
            <Fragment key={address.rights}>
              <DialogContentText>
                <TextField
                  label={captions[address.rights] + t('colon', ':')}
                  value={address.id}
                  variant="outlined"
                />
              </DialogContentText>
            </Fragment>
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
