/* global alert */
import React from 'react';
import { useTranslation } from 'react-i18next';

import Eye from '@material-ui/icons/RemoveRedEye';
import Folder from '@material-ui/icons/Folder';
import Settings from '@material-ui/icons/Settings';

import FolderListItemText from './FolderListItemText';
import ListLayoutItem from '../ListLayout/ListLayoutItem';

import { IFolder } from '../../types';
import { IArrayIconButtonProps } from '../../types/iconButtonTypes';

interface IFolderListItemProps {
  folder: IFolder;
  handleSelect: () => void;
  handleUnfold: () => void;
  secondaryActions?: IArrayIconButtonProps[];
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
    <ListLayoutItem
      element={folder}
      listItemText={(
        <FolderListItemText
          folder={folder}
          unfolded={unfolded}
          handleUnfold={handleUnfold}
        />
      )}
      primaryAction={{
        ariaLabel: t('search.Details', 'Details'),
        Icon: Eye,
        onClick: handleSelect,
      }}
      primaryIcon={<Folder />}
      secondaryActions={[
        {
          ariaLabel: t('folder.Settings', 'Settings'),
          Icon: Settings,
          key: 'settings',
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
