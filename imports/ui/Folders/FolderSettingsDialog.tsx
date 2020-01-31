import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { useTracker } from 'meteor/react-meteor-data';
import React, {
  ChangeEventHandler,
  Suspense,
  lazy,
  useState,
  useEffect,
} from 'react';
import { useTranslation } from 'react-i18next';
import DayUtils from '@date-io/dayjs';
import dayjs from 'dayjs';

import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';

import { useDeviceSize } from '../../hooks/contexts/app-device-size-context';
import FormDialog from '../Utils/FormDialog';
import { IFolder, IUnfetched } from '../../types';

import { userFoldersInsert } from '../../api/users/methods';
import { foldersUpdate } from '../../api/folders/methods';
import Folders from '../../api/folders/folders';

const MuiPickersUtilsProvider = lazy(() => import('@material-ui/pickers/MuiPickersUtilsProvider'));
const KeyboardDatePicker = lazy(() => import('@material-ui/pickers/DatePicker').then((module) => ({ default: module.KeyboardDatePicker })));

interface IFolderSettingsDialogProps {
  folder?: IUnfetched<IFolder>;
  handleClose: () => void;
  handleSelectFolder?: (folder: IUnfetched<IFolder>) => void;
  open?: boolean;
  title?: string;
}

export const FolderSettingsDialog: React.FC<IFolderSettingsDialogProps> = ({
  folder: {
    _id: folderId,
  } = {},
  handleClose,
  handleSelectFolder,
  open = false,
  title,
}) => {
  const { t } = useTranslation();
  const smallDevice = useDeviceSize('sm', 'down');

  useTracker(() => !Meteor.subscribe('broadcast', folderId).ready(), [folderId]);
  const folder = useTracker(() => Folders.findOne(folderId), [folderId]);

  const [name, setName] = useState(folder ? folder.name || '' : '');
  const [dateEnabled, setDateEnabled] = useState(folder && !!folder.date);
  const [date, setDate] = useState<dayjs.Dayjs>(dayjs(((folder && folder.date) || '') || undefined));
  const [error, setError] = useState('');

  useEffect(() => {
    setName(folder ? folder.name || '' : '');
    setDateEnabled(folder && !!folder.date);
    setDate(dayjs(((folder && folder.date) || '') || undefined));
  }, [folder]);

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

  const handleSubmit = (
    callback: (err: Meteor.Error | null, res?: Mongo.ObjectID) => void,
  ): void => {
    let cbErr: Meteor.Error;
    let cbRes: Mongo.ObjectID;

    if (folder) {
      foldersUpdate.call({
        _id: folder._id,
        name,
        date: dateEnabled ? date.toDate() : undefined,
      }, (err: Meteor.Error): void => {
        if (!err) {
          if (handleSelectFolder) {
            handleSelectFolder({ _id: folder._id, name });
          }
          cbRes = folder._id;
        } else {
          cbErr = err;
        }
        callback(cbErr, cbRes);
      });
    } else {
      userFoldersInsert.call(
        {
          name,
          date: dateEnabled ? date.toDate() : undefined,
        },
        (err: Meteor.Error, res: Mongo.ObjectID): void => {
          if (res) {
            if (handleSelectFolder) {
              handleSelectFolder({ _id: res, name });
            }
            cbRes = res;
          } else {
            cbErr = err;
          }
          callback(cbErr, cbRes);
        },
      );
    }
  };

  return (
    <FormDialog
      dialogTitle={title || t('dashboard.New folder', 'New folder')}
      error={error}
      handleClose={handleClose}
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

export default FolderSettingsDialog;
