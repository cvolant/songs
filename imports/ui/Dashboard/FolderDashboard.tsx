/* eslint-disable indent */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useState, useContext, useMemo } from 'react';
import { useHistory, match as IMatch } from 'react-router-dom';

import { Editor } from '../Editor';

import FolderEditor from './FolderEditor';
import AddRemoveSearchList, { SongARHandler } from '../Search/AddRemoveSearchList';
import { TutorialContext } from '../Tutorial';
import { LogoMenuContext } from '../LogoMenu';

import { ISong, IUnfetched } from '../../types';

import Folders from '../../api/folders/folders';
import {
  foldersUpdateSongsInsert,
  foldersUpdateSongsRemove,
} from '../../api/folders/methods';
import { ILogoMenuStateContext } from '../LogoMenu/LogoMenuContext';

interface IFolderDashboardProps {
  match: IMatch<{folderSlug: string}>;
}

export const FolderDashboard: React.FC<IFolderDashboardProps> = ({
  match: { params: { folderSlug: folderStringId } },
}) => {
  console.log('From FolderDashboard. render. folderStringId:', folderStringId);
  const history = useHistory();

  const setTutorialContentName = useContext(TutorialContext);
  const [
    logoMenuDeployed,
    setLogoMenuDeployed,
  ] = useContext(LogoMenuContext) as ILogoMenuStateContext;

  const [search, setSearch] = useState<boolean | undefined>(undefined);
  const [song, setSong] = useState<IUnfetched<ISong> | undefined>(undefined);

  const folderId = useMemo(() => new Mongo.ObjectID(folderStringId), [folderStringId]);

  const loading = useTracker(() => !Meteor.subscribe('folder', folderId).ready(), [folderId]);

  const folder = useTracker(
    () => Folders.find({ _id: folderId }).fetch()[0] || { _id: folderId },
    [folderId],
  );

  const handleAddRemoveSong: SongARHandler = (addOrRemove, arSong, callback) => (): void => {
    /* console.log(
      'From FolderDashboard, handleAddRemoveSong.',
      'arSong:', arSong,
      'callback:', callback,
    ); */
    if (arSong && arSong._id && folder && folder._id) {
      (addOrRemove === 'add' ? foldersUpdateSongsInsert : foldersUpdateSongsRemove)
        .call({ folderId: folder._id, songId: arSong._id }, callback);
    }
  };

  const goBack = (): void => {
    history.goBack();
  };

  const goBackToFolders = <T, >(
    setter: React.Dispatch<React.SetStateAction<T | undefined>>,
  ) => (): void => {
    setter(undefined);
    if (setTutorialContentName) {
      setTutorialContentName((search && 'Search') || 'Folder');
    }
  };

  const handleFocus = (focus?: boolean): () => void => (): void => {
    setLogoMenuDeployed(!focus);
  };

  const handleSongsAdding = (): void => {
    setSearch(true);
    if (setTutorialContentName) {
      setTutorialContentName('Search');
    }
  };

  const handleSelectSong = (newSong: IUnfetched<ISong>): void => {
    // console.log('From FolderDashboard, handleSelectSong. newSong.title:', newSong.title);
    setSong(newSong);
    if (setTutorialContentName) {
      setTutorialContentName('Editor');
    }
  };

  const folderSongs = (folder && folder.songs) || [];

  // console.log('From FolderDashboard, return. song:', song, 'folder:', folder);

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
    /* console.log(
      'From FolderDashboard, if(search).',
      'folder:', folder,
      'folderSongs:', folderSongs,
    ); */
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
      handleSelectSong={handleSelectSong}
      handleSongsAdding={handleSongsAdding}
      loading={loading}
      logoMenuDeployed={logoMenuDeployed}
    />
  );
};

export default FolderDashboard;
