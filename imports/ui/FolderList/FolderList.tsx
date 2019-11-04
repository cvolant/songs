import { Mongo } from 'meteor/mongo';
import React, { useRef, useState, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';

import FolderListItem from './FolderListItem';
import FolderListItemLoading from './FolderListItemLoading';
import FolderListSorting from './FolderListSorting';

import {
  IFolder,
  ISortFolderSpecifier,
  ISortFolderCriterion,
} from '../../types/folderTypes';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    overflowScrolling: 'touch',
    overflowY: 'auto',
    width: '100%',
  },
  emptyItemContainer: {
    padding: theme.spacing(2),
  },
}));

interface IFolderListProps {
  displaySort: boolean;
  emptyListPlaceholder?: ReactNode;
  handleSelectFolder?: (folder: IFolder) => void;
  handleSort: (sortCriterion: ISortFolderCriterion) => () => void;
  handleToggleDisplaySort: (open?: boolean) => () => void;
  loading?: boolean;
  logoMenuDeployed?: boolean;
  raiseLimit: () => void;
  folders: IFolder[];
  sort?: ISortFolderSpecifier;
}

export const FolderList: React.FC<IFolderListProps> = ({
  displaySort,
  emptyListPlaceholder,
  handleSelectFolder = (): void => { },
  handleSort,
  handleToggleDisplaySort,
  loading = false,
  raiseLimit,
  folders,
  sort,
}) => {
  const listRef = useRef<HTMLElement>();
  const { t } = useTranslation();
  const classes = useStyles();

  const [unfoldedFolder, setUnfoldedFolder] = useState();

  const handleListScroll = (): void => {
    if (!loading && listRef.current) {
      const {
        current: {
          scrollTop,
          scrollHeight,
          clientHeight,
        },
      } = listRef;
      const scrollPosition = (scrollTop * 100) / (scrollHeight - clientHeight);
      if (scrollPosition > 90) {
        console.log('From FolderList, handleListScroll. scrollPosition:', scrollPosition);
        raiseLimit();
      }
    }
  };

  const handleSelect = (folder: IFolder) => (): void => handleSelectFolder(folder);
  const handleUnfold = (folderId: Mongo.ObjectID) => (): void => setUnfoldedFolder(folderId);

  return (
    <List
      component="nav"
      className={classes.root}
      onScroll={handleListScroll}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={listRef as any}
      subheader={displaySort && (folders.length > 0 || loading)
        ? (
          <FolderListSorting
            handleToggleDisplaySort={handleToggleDisplaySort}
            handleSort={handleSort}
            sort={sort}
          />
        )
        : undefined}
    >
      {folders.length === 0 && !loading
        ? (
          <div className={classes.emptyItemContainer}>
            {emptyListPlaceholder || (
              <Typography>
                {t('search.Nothing found so far', 'Nothing found so far.')}
              </Typography>
            )}
          </div>
        )
        : folders.map((folder) => {
          const folderId = folder._id;
          return (
            <FolderListItem
              handleSelect={handleSelect(folder)}
              handleUnfold={handleUnfold(folderId)}
              key={folder._id.toHexString()}
              folder={folder}
              unfolded={unfoldedFolder === folderId}
            />
          );
        })}
      {loading && <FolderListItemLoading />}
    </List>
  );
};

export default FolderList;
