import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import Add from '@material-ui/icons/Add';

import FormDialog from './FolderSettingsDialog';
import { IFolder, IUnfetched } from '../../types';

interface IFolderSettingsDialogProps {
  folder?: IFolder;
  handleSelectFolder: (folder: IUnfetched<IFolder>) => void;
  title?: string;
}

export const FolderSettingsDialog: React.FC<IFolderSettingsDialogProps> = ({
  folder, handleSelectFolder, title,
}) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleOpen = (): void => {
    setOpen(true);
  };

  return (
    <div>
      <Button
        aria-label={title || t('dashboard.New folder', 'New folder')}
        color="primary"
        onClick={handleOpen}
      >
        <Add />
        {title || t('dashboard.New folder', 'New folder')}
      </Button>
      <FormDialog
        folder={folder}
        handleClose={handleClose}
        handleSelectFolder={handleSelectFolder}
        open={open}
        title={title}
      />
    </div>
  );
};

export default FolderSettingsDialog;
