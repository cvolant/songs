/* eslint-disable indent */
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { useState, useEffect, useContext } from 'react';

import Editor from '../Editor';

import FolderEditor from './FolderEditor';
import AddRemoveSearchList, { SongARHandler } from '../Search/AddRemoveSearchList';
import { TutorialContext } from '../Tutorial';
import { LogoMenuContext } from '../LogoMenu';

import { IFolder, ISong, IUnfetched } from '../../types';

import Folders from '../../api/folders/folders';
import {
  foldersUpdateSongsInsert,
  foldersUpdateSongsRemove,
} from '../../api/folders/methods';

interface IFolderDashboardProps {
  folder: IUnfetched<IFolder>;
  goBack: () => void;
  handleToggleLogoMenu: (oc?: boolean) => () => void;
  logoMenuDeployed?: boolean;
}
interface IFolderDashboardWTData {
  folder: IUnfetched<IFolder>;
}
interface IWrappedFolderDashboardProps
  extends IFolderDashboardProps, IFolderDashboardWTData { }

export const WrappedFolderDashboard: React.FC<IWrappedFolderDashboardProps> = ({
  folder,
  goBack,
  handleToggleLogoMenu,
}) => {
  const setTutorialContentName = useContext(TutorialContext);
  const [logoMenuDeployed] = useContext(LogoMenuContext);

  const [search, setSearch] = useState<boolean | undefined>(undefined);
  const [song, setSong] = useState<IUnfetched<ISong> | undefined>(undefined);

  useEffect(() => {
    const subscription = Meteor.subscribe('folder', folder._id, () => {
      console.log('From FolderDashboard, useEffect. Folders:', Folders, 'Folders.find().fetch():', Folders.find().fetch(), 'Folders.find({ _id: folder._id }).fetch()[0]:', Folders.find({ _id: folder._id }).fetch()[0]);
    });
    return (): void => {
      console.log('From FolderDashboard. SUBSCRIPTION.STOP.');
      subscription.stop();
    };
  }, []);

  const handleAddRemoveSong: SongARHandler = (addOrRemove, arSong, callback) => (): void => {
    console.log('From FolderDashboard, handleAddRemoveSong. arSong:', arSong, 'callback:', callback);
    if (arSong && arSong._id && folder && folder._id) {
      (addOrRemove === 'add' ? foldersUpdateSongsInsert : foldersUpdateSongsRemove)
        .call({ folderId: folder._id, songId: arSong._id }, callback);
    }
  };

  const goBackToFolders = <T, >(
    setter: React.Dispatch<React.SetStateAction<T | undefined>>,
  ) => (): void => {
    setter(undefined);
    if (setTutorialContentName) {
      setTutorialContentName((search && 'Search') || 'Folder');
    }
  };

  const handleFocus = (focus?: boolean): () => void => handleToggleLogoMenu(!focus);

  const handleSongsAdding = (): void => {
    setSearch(true);
    if (setTutorialContentName) {
      setTutorialContentName('Search');
    }
  };

  const handleSelectSong = (newSong: IUnfetched<ISong>): void => {
    console.log('From FolderDashboard, handleSelectSong. newSong.title:', newSong.title);
    setSong(newSong);
    if (setTutorialContentName) {
      setTutorialContentName('Editor');
    }
  };

  const folderSongs = (folder && folder.songs) || [];
  const folderSongIds = folderSongs.map((folderSong) => folderSong._id);

  console.log('From FolderDashboard, return. song:', song, 'folder:', folder);

  if (song) {
    return (
      <Editor
        edit={song.userId === Meteor.userId() && !song.lyrics}
        goBack={goBackToFolders(setSong)}
        logoMenuDeployed={logoMenuDeployed}
        song={song}
      />
    );
  }
  if (search) {
    console.log('From FolderDashboard, if(search). folder:', folder, 'folderSongs:', folderSongs, 'folderSongIds:', folderSongIds);
    return (
      <AddRemoveSearchList
        goBack={goBackToFolders(setSearch)}
        handleAddRemoveSong={handleAddRemoveSong}
        handleFocus={handleFocus}
        shortFirstItem={logoMenuDeployed}
        shortSearchField={logoMenuDeployed}
        songIds={folderSongs.map((folderSong) => folderSong._id)}
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
