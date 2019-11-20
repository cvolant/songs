/* eslint-disable indent */
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, {
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useState,
  useEffect,
} from 'react';
import { useTranslation } from 'react-i18next';

import Add from '@material-ui/icons/Add';
import RemoveCircleOutline from '@material-ui/icons/RemoveCircleOutline';

import Editor from '../Editor';

import FolderEditor from './FolderEditor';
import { CardSearchList } from '../SearchPage/CardSearchList';

import { IUnfetchedFolder } from '../../types/folderTypes';
import { IUnfetchedSong } from '../../types/songTypes';
import { IIconColor, IIcon } from '../../types/iconButtonTypes';
import { ITutorialContentName } from '../Tutorial';

import Folders from '../../api/folders/folders';
import {
  folderUpdateInsertSong,
  folderUpdateRemoveSong,
} from '../../api/folders/methods';

interface IFolderDashboardProps {
  folder: IUnfetchedFolder;
  goBack: () => void;
  handleToggleLogoMenu: (oc?: boolean) => () => void;
  logoMenuDeployed?: boolean;
  setTutorialContentName: Dispatch<SetStateAction<ITutorialContentName>>;
}
interface IFolderDashboardWTData {
  folder: IUnfetchedFolder;
}
interface IWrappedFolderDashboardProps
  extends IFolderDashboardProps, IFolderDashboardWTData { }

export const WrappedFolderDashboard: React.FC<IWrappedFolderDashboardProps> = ({
  folder,
  goBack,
  handleToggleLogoMenu,
  logoMenuDeployed = false,
  setTutorialContentName,
}) => {
  const { t } = useTranslation();

  const [search, setSearch] = useState<boolean | undefined>(undefined);
  const [song, setSong] = useState<IUnfetchedSong | undefined>(undefined);

  useEffect(() => {
    const subscription = Meteor.subscribe('folder', folder._id, () => {
      console.log('From FolderDashboard, useEffect. Folders:', Folders, 'Folders.find().fetch():', Folders.find().fetch(), 'Folders.find({ _id: folder._id }).fetch()[0]:', Folders.find({ _id: folder._id }).fetch()[0]);
    });
    return (): void => {
      console.log('From FolderDashboard. SUBSCRIPTION.STOP.');
      subscription.stop();
    };
  }, []);

  const addThisSong = (
    newSong: IUnfetchedSong,
    callback?: (err: Meteor.Error, res: void) => void,
  ) => (): void => {
    console.log('From FolderDashboard, addThisSong. newSong:', newSong, 'callback:', callback);
    if (newSong && newSong._id && folder && folder._id) {
      folderUpdateInsertSong.call({ folderId: folder._id, songId: newSong._id }, callback);
    }
  };

  const removeThisSong = (
    formerSong: IUnfetchedSong,
    callback?: (err: Meteor.Error, res: void) => void,
  ) => (): void => {
    if (formerSong && formerSong._id && folder && folder._id) {
      folderUpdateRemoveSong.call({ folderId: folder._id, songId: formerSong._id }, callback);
    }
  };

  const goBackToFolders = <T, >(
    setter: React.Dispatch<React.SetStateAction<T | undefined>>,
  ) => (): void => {
    setter(undefined);
    setTutorialContentName((search && 'Search') || 'Folder');
  };

  const handleFocus = (focus?: boolean): () => void => handleToggleLogoMenu(!focus);

  const handleSongsAdding = (): void => {
    setSearch(true);
    setTutorialContentName('Search');
  };

  const handleSelectSong = (newSong: IUnfetchedSong): void => {
    console.log('From FolderDashboard, handleSelectSong. newSong.title:', newSong.title);
    setSong(newSong);
    setTutorialContentName('Editor');
  };


  const folderSongs = (folder && folder.songs) || [];
  const folderSongIdStrings = folderSongs.map(
    (folderSong) => folderSong._id.toHexString(),
  );
  const addRemoveButton = {
    ariaLabel: (searchedSong: IUnfetchedSong): string => (
      folderSongIdStrings.includes(searchedSong._id.toHexString())
        ? t('folder.Remove this song', 'Remove this song')
        : t('folder.Add this song', 'Add this song')
    ),
    color: (searchedSong: IUnfetchedSong): IIconColor => (
      folderSongIdStrings.includes(searchedSong._id.toHexString())
        ? 'primary'
        : 'default'
    ),
    Icon: {
      build: (searchedSong: IUnfetchedSong): IIcon => (
        folderSongIdStrings.includes(searchedSong._id.toHexString())
          ? RemoveCircleOutline
          : Add
      ),
    },
    key: 'addSong',
    onClick: {
      build: (
        searchedSong: IUnfetchedSong,
        callback?: (err: Meteor.Error, res: void) => void,
      ): MouseEventHandler => (
        folderSongIdStrings.includes(searchedSong._id.toHexString())
          ? removeThisSong(searchedSong, callback)
          : addThisSong(searchedSong, callback)
      ),
    },
  };

  console.log('From FolderDashboard, return. song:', song, 'folder:', folder);
  if (song) {
    return (
      <Editor
        actionIconButtonProps={folder && search ? addRemoveButton : undefined}
        edit={song.userId === Meteor.userId() && !song.pg}
        goBack={goBackToFolders(setSong)}
        logoMenuDeployed={logoMenuDeployed}
        song={song}
      />
    );
  }
  if (search) {
    console.log('From FolderDashboard, if(search). folder:', folder, 'folderSongs:', folderSongs, 'folderSongIdStrings:', folderSongIdStrings);
    return (
      <CardSearchList
        goBack={goBackToFolders(setSearch)}
        handleFocus={handleFocus}
        handleSelectSong={handleSelectSong}
        shortFirstItem={logoMenuDeployed}
        shortSearchField={logoMenuDeployed}
        secondaryActions={[addRemoveButton]}
      />
    );
  }
  return (
    <FolderEditor
      folder={folder}
      goBack={goBack}
      logoMenuDeployed={logoMenuDeployed}
      handleSelectSong={handleSelectSong}
      handleSongsAdding={handleSongsAdding}
    />
  );
};

const FolderDashboard = withTracker<IFolderDashboardWTData, IFolderDashboardProps>(({
  folder: propsFolder,
}) => {
  const idFolder = { _id: propsFolder._id };
  const folder = Folders.find(idFolder).fetch()[0] || idFolder;
  console.log('From FolderDashboard, withTracker. folder:', folder, 'propFolder:', propsFolder, 'Folders:', Folders);
  return {
    folder,
  };
})(WrappedFolderDashboard);

export default FolderDashboard;
