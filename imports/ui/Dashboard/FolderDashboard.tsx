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

import { IFolder, ISong, IUnfetched } from '../../types';
import { IIcon, IIconButtonCallback } from '../../types/iconButtonTypes';
import { ITutorialContentName } from '../Tutorial';

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
  setTutorialContentName: Dispatch<SetStateAction<ITutorialContentName>>;
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
  logoMenuDeployed = false,
  setTutorialContentName,
}) => {
  const { t } = useTranslation();

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

  const handleAddSong = (
    newSong: IUnfetched<ISong>,
    callback?: (err: Meteor.Error, res: void) => void,
  ) => (): void => {
    console.log('From FolderDashboard, handleAddSong. newSong:', newSong, 'callback:', callback);
    if (newSong && newSong._id && folder && folder._id) {
      foldersUpdateSongsInsert.call({ folderId: folder._id, songId: newSong._id }, callback);
    }
  };

  const handleRemoveSong = (
    formerSong: IUnfetched<ISong>,
    callback?: (err: Meteor.Error, res: void) => void,
  ) => (): void => {
    if (formerSong && formerSong._id && folder && folder._id) {
      foldersUpdateSongsRemove.call({ folderId: folder._id, songId: formerSong._id }, callback);
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

  const handleSelectSong = (newSong: IUnfetched<ISong>): void => {
    console.log('From FolderDashboard, handleSelectSong. newSong.title:', newSong.title);
    setSong(newSong);
    setTutorialContentName('Editor');
  };


  const folderSongs = (folder && folder.songs) || [];
  const folderSongIdStrings = folderSongs.map(
    (folderSong) => folderSong._id.toHexString(),
  );
  const addRemoveButton = {
    Icon: {
      build: ({ element }: { element?: IUnfetched<ISong>}): IIcon => (
        element && folderSongIdStrings.includes(element._id.toHexString())
          ? RemoveCircleOutline
          : Add
      ),
    },
    key: 'addSong',
    label: {
      build: ({ element }: { element?: IUnfetched<ISong> }): string => (
        element && folderSongIdStrings.includes(element._id.toHexString())
          ? t('folder.Remove this song', 'Remove this song')
          : t('folder.Add this song', 'Add this song')
      ),
    },
    onClick: {
      build: ({ element, callback }: {
        element?: IUnfetched<ISong>;
        callback?: IIconButtonCallback;
      }): MouseEventHandler => (
        (element && (
          folderSongIdStrings.includes(element._id.toHexString())
            ? handleRemoveSong(element, callback)
            : handleAddSong(element, callback)
        )) || ((): void => {})
      ),
    },
  };

  console.log('From FolderDashboard, return. song:', song, 'folder:', folder);
  if (song) {
    return (
      <Editor
        fab={folder && search ? addRemoveButton : undefined}
        edit={song.userId === Meteor.userId() && !song.lyrics}
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
