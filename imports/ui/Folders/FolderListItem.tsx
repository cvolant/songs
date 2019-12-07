/* global alert */
import React from 'react';
import { useTranslation } from 'react-i18next';

import Eye from '@material-ui/icons/RemoveRedEye';
import Folder from '@material-ui/icons/Folder';
import Settings from '@material-ui/icons/Settings';

import FolderListItemText from './FolderListItemText';
import ListLayoutItem from '../ListLayout/ListLayoutItem';

import { IArrayIconButtonProps } from '../../types/iconButtonTypes';
import { IFolder, IUnfetchedFolder } from '../../types/folderTypes';

interface IFolderListItemProps {
  folder: IFolder;
  handleSelect: () => void;
  handleUnfold: () => void;
  secondaryActions?: IArrayIconButtonProps<IUnfetchedFolder>[];
  unfolded: boolean;
}

export const FolderListItem: React.FC<IFolderListItemProps> = ({
  folder,
  handleSelect,
  handleUnfold,
  secondaryActions,
  unfolded,
}) => {
  const { t } = useTranslation();

  return (
    <ListLayoutItem<IFolder>
      element={folder}
      listItemText={(
        <FolderListItemText
          folder={folder}
          unfolded={unfolded}
          handleUnfold={handleUnfold}
        />
      )}
      primaryAction={{
        Icon: Eye,
        label: t('search.Details', 'Details'),
        onClick: handleSelect,
      }}
      primaryIcon={<Folder />}
      secondaryActions={[
        {
          Icon: Settings,
          key: 'settings',
          label: t('folder.Settings', 'Settings'),
          // eslint-disable-next-line no-alert
          onClick: (): void => alert('Still undefined'),
        },
        ...secondaryActions || [],
      ]}
      unfolded={unfolded}
    />
  );
};

export default FolderListItem;
