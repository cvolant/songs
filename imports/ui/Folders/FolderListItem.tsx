import React from 'react';
import { useTranslation } from 'react-i18next';

import Eye from '@material-ui/icons/RemoveRedEye';
import Folder from '@material-ui/icons/Folder';

import FolderListItemText from './FolderListItemText';
import ListLayoutItem from '../ListLayout/ListLayoutItem';

import { IFolder, IUnfetched } from '../../types';
import { IArrayIconButtonProps } from '../../types/iconButtonTypes';

interface IFolderListItemProps {
  folder: IFolder;
  handleSelect: () => void;
  handleUnfold: () => void;
  secondaryActions?: IArrayIconButtonProps<IUnfetched<IFolder>>[];
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
      secondaryActions={secondaryActions}
      unfolded={unfolded}
    />
  );
};

export default FolderListItem;
