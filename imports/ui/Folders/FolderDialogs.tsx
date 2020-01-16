import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React from 'react';
import { useTranslation } from 'react-i18next';

import FolderSettingsDialog from './FolderSettingsDialog';
import FormDialog from '../utils/FormDialog';

import { IFolder, IUnfetched } from '../../types';

import { userFoldersRemove } from '../../api/users/methods';

interface IFolderDialogsProps {
  deleteFolder?: IUnfetched<IFolder>;
  handleCloseDelete: () => void;
  handleCloseSettings: () => void;
  handleSelectFolder?: (folder: IUnfetched<IFolder>) => void;
  settingsFolder?: IUnfetched<IFolder>;
}

export const FolderDialogs: React.FC<IFolderDialogsProps> = ({
  deleteFolder,
  handleCloseDelete,
  handleCloseSettings,
  handleSelectFolder,
  settingsFolder,
}) => {
  const { t } = useTranslation();

  const handleConfirmDelete = (
    folder: IUnfetched<IFolder>,
    callback: (err: Meteor.Error | null, res?: Mongo.ObjectID) => void,
  ): void => {
    if (folder) {
      userFoldersRemove.call(folder, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(err, folder._id);
          handleCloseDelete();
        }
      });
    } else {
      handleCloseDelete();
    }
  };

  return (
    <>
      {settingsFolder && (
        <FolderSettingsDialog
          folder={settingsFolder}
          handleClose={handleCloseSettings}
          handleSelectFolder={handleSelectFolder}
          open
          title={settingsFolder.name}
        />
      )}
      {deleteFolder && (
        <FormDialog
          dialogText={
            t('folder.Delete this folder', 'Delete this folder')
            + (deleteFolder.name ? `${t('colon')} ${deleteFolder.name}` : '')
            + t('?')
          }
          dialogTitle={t('Sure?', 'Are your sure?')}
          handleClose={handleCloseDelete}
          handleSubmit={(
            callback: (err: Meteor.Error | null, res?: Mongo.ObjectID) => void,
          ): void => handleConfirmDelete(deleteFolder, callback)}
          open
        />
      )}
    </>
  );
};

export default FolderDialogs;
