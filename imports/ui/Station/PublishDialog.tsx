/* global window */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import ToggleOn from '@material-ui/icons/ToggleOn';
import ToggleOff from '@material-ui/icons/ToggleOff';

import useUnmountedRef from '../../hooks/unmountedRef';
import CustomIconButton from '../Utils/CustomIconButton';

import { IIconButtonBWCbProps, IIconButtonCallback } from '../../types/iconButtonTypes';
import { IBroadcast, IBroadcastRights } from '../../types/broadcastTypes';

import { broadcastGetAddresses } from '../../api/broadcasts/methods';

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputLabel: {
    color: theme.palette.font.color.black,
  },
  links: {
    margin: theme.spacing(1),
  },
}));

interface IPublishDialogProps {
  broadcastOwnerId: string;
  broadcastStatus?: IBroadcast['status'];
  handleClose: () => void;
  handleTogglePublished: (callback?: IIconButtonCallback) => () => void;
  open?: boolean;
}

export const PublishDialog: React.FC<IPublishDialogProps> = ({
  broadcastOwnerId,
  broadcastStatus,
  handleClose,
  handleTogglePublished,
  open = false,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const unmountedRef = useUnmountedRef();

  const [addresses, setAddresses] = useState<IBroadcast['addresses'] | undefined>();
  const [copied, setCopied] = useState<IBroadcastRights[]>([]);

  useEffect(() => {
    broadcastGetAddresses.call({ broadcastOwnerId }, (_err, res) => {
      if (res && !unmountedRef.current) {
        // console.log('From PublishDialog.broadcastGetAddresses.callback. res:', res);
        setAddresses(res);
      }
    });
  }, [broadcastOwnerId, unmountedRef]);

  const handleCopy = (rights: IBroadcastRights) => (): void => {
    if (!copied.includes(rights)) {
      setCopied([...copied, rights]);
      setTimeout((): void => {
        if (!unmountedRef.current) {
          setCopied(copied.filter((filterRights) => filterRights !== rights));
        }
      }, 5000);
    }
  };

  const captions = {
    readOnly: t('station.Read only', 'Read only'),
    navigate: t('station.Navigate', 'Navigate'),
    control: t('station.Control', 'Control'),
  };

  const published = broadcastStatus && broadcastStatus !== 'unpublished';

  /* console.log(
    'From PublishDialog, render.',
    'broadcastOwnerId:', broadcastOwnerId,
    'addresses:', addresses,
  ); */

  return (
    <Dialog
      aria-labelledby="dialog-name"
      fullWidth
      onClose={handleClose}
      open={open}
    >
      <DialogTitle id="dialog-name">
        {t('station.Publication', 'Publication')}
      </DialogTitle>
      <DialogContent className={classes.content}>
        <CustomIconButton
          Component={Button}
          iconButtonProps={{
            color: published ? 'primary' : 'default',
            Icon: published ? ToggleOn : ToggleOff,
            label: (published ? t('station.Published', 'Published') : t('station.Publish', 'Publish')) as string,
            labelVisible: true,
            onClick: {
              build: ({ callback }: IIconButtonBWCbProps<IBroadcast>): () => void => (
                handleTogglePublished(callback)
              ),
              callback: true,
            },
          }}
        />
        {addresses && addresses.length > 1
          ? [...addresses].reverse().map((address) => (address.rights === 'owner' ? undefined : (
            <TextField
              className={classes.links}
              InputLabelProps={{ className: classes.inputLabel }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CopyToClipboard
                      onCopy={handleCopy(address.rights)}
                      text={`${window.location.origin}/${address.id}`}
                    >
                      <Button>
                        {copied.includes(address.rights) ? t('Copied') : t('Copy')}
                      </Button>
                    </CopyToClipboard>
                  </InputAdornment>
                ),
              }}
              key={address.rights}
              label={captions[address.rights] + t('colon', ':')}
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
