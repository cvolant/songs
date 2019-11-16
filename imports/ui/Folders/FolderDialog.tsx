import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, {
  ChangeEventHandler,
  Suspense,
  lazy,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import DayUtils from '@date-io/dayjs';
import dayjs from 'dayjs';

import { useDeviceSize } from '../../hooks/contexts/app-device-size-context';
import FormDialog from '../utils/FormDialog';
import { IUnfetchedFolder, IFolder } from '../../types/folderTypes';

const MuiPickersUtilsProvider = lazy(() => import('@material-ui/pickers/MuiPickersUtilsProvider'));
const KeyboardDatePicker = lazy(() => import('@material-ui/pickers/DatePicker').then((module) => ({ default: module.KeyboardDatePicker })));

interface IFolderDialogProps {
  folder?: IFolder;
  handleClose: () => void;
  handleSelectFolder: (folder: IUnfetchedFolder) => void;
  open?: boolean;
  title?: string;
}

export const FolderDialog: React.FC<IFolderDialogProps> = ({
  folder,
  handleClose,
  handleSelectFolder,
  open = false,
  title,
}) => {
  const { t } = useTranslation();
  const smallDevice = useDeviceSize('sm.down');

  const [name, setName] = useState(folder ? folder.name || '' : '');
  const [dateEnabled, setDateEnabled] = useState(folder && !!folder.date);
  const [date, setDate] = useState<dayjs.Dayjs>(dayjs(((folder && folder.date) || '') || undefined));
  const [error, setError] = useState('');

  const closeDialog = (): void => {
    /* setName('');
    setDateEnabled(false);
    setDate(dayjs()); */
    handleClose();
  };

  const handleDateEnabledChange = (
    _event: object,
    checked: boolean,
  ): void => {
    setDateEnabled(checked);
  };

  const handleDateChange = (newDate: dayjs.Dayjs | null): void => {
    if (newDate) {
      setDate(newDate);
      setError('');
    }
  };

  const handleNameChange: ChangeEventHandler<HTMLInputElement> = (e): void => {
    const { target: { value } } = e;
    if (value.length > 100) {
      setError(t('dashbord.Max 100 characters', '100 characters maximum...'));
    } else {
      setName(value);
      setError('');
    }
  };

  const handleSubmit = (callback: (err: Meteor.Error, res: Mongo.ObjectID) => void): void => {
    console.log('From FormDialog, handleSubmit.');
    Meteor.call(
      folder ? 'folders.update' : 'user.folders.insert',
      folder
        ? {
          _id: folder._id,
          name,
          date: dateEnabled ? date.toDate() : null,
        } : {
          name,
          date: dateEnabled ? date.toDate() : null,
        },
      (err: Meteor.Error, res: Mongo.ObjectID) => {
        console.log('From FormDialog, handleSubmit, callback.');
        callback(err, res);
        if (res) {
          handleSelectFolder({ _id: res, name });
        }
      },
    );
  };

  return (
    <FormDialog
      error={error}
      dialogTitle={title || t('dashboard.New folder', 'New folder')}
      handleClose={closeDialog}
      handleSubmit={handleSubmit}
      open={open}
    >
      <FormGroup>
        <TextField
          autoFocus
          fullWidth
          id="name"
          label={t('folder.Name', 'Name')}
          onChange={handleNameChange}
          type="text"
          value={name}
        />
        <FormControlLabel
          checked={dateEnabled}
          onChange={handleDateEnabledChange}
          control={<Switch />}
          label={t('folder.Date scheduled', 'Date scheduled?')}
        />
        <Suspense fallback={<div><CircularProgress /></div>}>
          <MuiPickersUtilsProvider utils={DayUtils}>
            <KeyboardDatePicker
              autoOk
              disabled={!dateEnabled}
              disableToolbar={!smallDevice}
              variant={smallDevice ? 'dialog' : 'inline'}
              format={t('date format', 'MM-DD-YYYY')}
              margin="normal"
              value={date}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
        </Suspense>
      </FormGroup>
    </FormDialog>
  );
};

export default FolderDialog;
