import { Mongo } from 'meteor/mongo';
import React, {
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';
import { useTranslation } from 'react-i18next';

import Eye from '@material-ui/icons/RemoveRedEye';
import Delete from '@material-ui/icons/Delete';
import Folder from '@material-ui/icons/Folder';
import Settings from '@material-ui/icons/Settings';

import FolderDialogs from './FolderDialogs';
import ListLayout from '../ListLayout/ListLayout';
import ListLayoutItem from '../ListLayout/ListLayoutItem';
import ListLayoutSorting from '../ListLayout/ListLayoutSorting';

import { IFolder, IUnfetched } from '../../types';
import { ISortCriterion, ISortSpecifier } from '../../types/searchTypes';
import { IArrayIconButtonProps } from '../../types/iconButtonTypes';
import FolderListItemText from './FolderListItemText';

interface IFolderListProps {
  displaySort: boolean;
  emptyListPlaceholder?: ReactNode;
  folders?: IFolder[];
  handleSelectFolder?: (folder: IUnfetched<IFolder>) => void;
  handleSort: (sortCriterion: ISortCriterion<IFolder>) => () => void;
  handleToggleDisplaySort: (open?: boolean) => () => void;
  loading?: boolean;
  raiseLimit: () => void;
  secondaryActions?: IArrayIconButtonProps<IUnfetched<IFolder>>[];
  shortFirstItem?: boolean;
  sort?: ISortSpecifier<IFolder>;
}

export const FolderList: React.FC<IFolderListProps> = ({
  displaySort,
  emptyListPlaceholder,
  folders = [],
  handleSelectFolder = (): void => { /* Empty function */ },
  handleSort,
  handleToggleDisplaySort,
  loading = false,
  raiseLimit,
  secondaryActions,
  shortFirstItem = false,
  sort,
}) => {
  const { t } = useTranslation();
  const [unfoldedFolder, setUnfoldedFolder] = useState();
  const [settingsFolder, setSettingsFolder] = useState<IFolder | undefined>();
  const [deleteFolder, setDeleteFolder] = useState<IFolder | undefined>();

  console.log('From FolderList, render. folders:', folders);

  const handleClose = (setter: Dispatch<SetStateAction<IFolder | undefined>>) => (): void => {
    setter(undefined);
  };

  const handleOpenSettings = (folder: IFolder) => (): void => {
    setSettingsFolder(folder);
  };

  const handleDelete = (folder: IFolder) => (): void => {
    setDeleteFolder(folder);
  };

  const handleSelect = (folder: IFolder) => (): void => handleSelectFolder(folder);

  const handleUnfold = (folderId: Mongo.ObjectID) => (): void => {
    if (folderId === unfoldedFolder) {
      setUnfoldedFolder(undefined);
    } else {
      setUnfoldedFolder(folderId);
    }
  };

  return (
    <>
      <ListLayout
        displaySort={displaySort}
        emptyListPlaceholder={emptyListPlaceholder}
        loading={loading}
        listSorting={(folders.length > 0 || loading) ? (
          <ListLayoutSorting
            handleToggleDisplaySort={handleToggleDisplaySort}
            handleSort={handleSort}
            sort={sort}
            sortCriteria={(['name', 'updatedAd', 'date'] as ISortCriterion<IFolder>[])
              .map((sortCriterion) => ({
                criterion: sortCriterion,
                localCriterionName: t(`folder.${sortCriterion}`, sortCriterion),
              }))}
          />
        ) : undefined}
        raiseLimit={raiseLimit}
        shortFirstItem={shortFirstItem}
      >
        {folders.map((folder) => {
          const folderId = folder._id;
          const unfolded = unfoldedFolder === folderId;
          return (
            <ListLayoutItem<IFolder>
              element={folder}
              key={folderId.toHexString()}
              listItemText={(
                <FolderListItemText
                  folder={folder}
                  unfolded={unfolded}
                  handleUnfold={handleUnfold(folderId)}
                />
              )}
              primaryAction={{
                Icon: Eye,
                label: t('search.Details', 'Details'),
                onClick: handleSelect(folder),
              }}
              primaryIcon={<Folder />}
              secondaryActions={[
                {
                  color: 'default',
                  Icon: Settings,
                  key: 'settings',
                  label: t('folder.Settings', 'Settings'),
                  onClick: handleOpenSettings(folder),
                },
                {
                  color: 'default',
                  Icon: Delete,
                  key: 'delete',
                  label: t('folder.Delete', 'Delete'),
                  onClick: handleDelete(folder),
                },
                ...secondaryActions || [],
              ]}
              unfolded={unfolded}
            />
          );
        })}
      </ListLayout>
      <FolderDialogs
        deleteFolder={deleteFolder}
        handleCloseDelete={handleClose(setDeleteFolder)}
        handleCloseSettings={handleClose(setSettingsFolder)}
        handleSelectFolder={handleSelectFolder}
        settingsFolder={settingsFolder}
      />
    </>
  );
};

export default FolderList;
