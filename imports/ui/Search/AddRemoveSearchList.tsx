import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { MouseEventHandler, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import Add from '@material-ui/icons/Add';
import RemoveCircleOutline from '@material-ui/icons/RemoveCircleOutline';

import FullCardLayout from '../Common/FullCardLayout';
import SearchList from './SearchList';
import { TutorialContext } from '../Tutorial';

import { ISong, IUnfetched } from '../../types';
import { IArrayIconButtonProps, IIconButtonCallback, IIcon } from '../../types/iconButtonTypes';
import { Editor } from '../Editor';

export type SongARHandler = (
  addOrRemove: 'add' | 'remove',
  song: IUnfetched<ISong>,
  callback?: (err: Meteor.Error | null, res: void) => void,
) => () => void;

interface IAddRemoveSearchListProps {
  goBack: () => void;
  handleAddRemoveSong: SongARHandler;
  secondaryActions?: IArrayIconButtonProps<IUnfetched<ISong>>[];
  songIds: Mongo.ObjectID[];
}

export const AddRemoveSearchList: React.FC<IAddRemoveSearchListProps> = ({
  goBack,
  handleAddRemoveSong,
  secondaryActions,
  songIds,
}) => {
  const { t } = useTranslation();
  const setTutorialContentName = useContext(TutorialContext);

  const [song, setSong] = useState<IUnfetched<ISong> | undefined>();

  const handleCloseEditor = (): void => {
    setSong(undefined);
  };

  const handleSelectSong = (newSong: IUnfetched<ISong>): void => {
    // console.log('From FolderDashboard, handleSelectSong. newSong.title:', newSong.title);
    setSong(newSong);
    if (setTutorialContentName) {
      setTutorialContentName('Editor');
    }
  };

  const songStringIds = songIds.map((songId) => songId.toHexString());

  /* console.log(
    'From AddRemoveSearchList, render.',
    'songIds:', songIds,
    'songStringIds:', songStringIds,
  ); */

  const addRemoveButton = {
    Icon: {
      build: ({ element }: { element?: IUnfetched<ISong> }): IIcon => (
        element && songStringIds.includes(element._id.toHexString())
          ? RemoveCircleOutline
          : Add
      ),
    },
    key: 'addSong',
    label: {
      build: ({ element }: { element?: IUnfetched<ISong> }): string => (
        element && songStringIds.includes(element._id.toHexString())
          ? t('folder.Remove this song', 'Remove this song')
          : t('folder.Add this song', 'Add this song')
      ),
    },
    onClick: {
      build: ({ element, callback }: {
        element?: IUnfetched<ISong>;
        callback?: IIconButtonCallback;
      }): MouseEventHandler => (
        (element && handleAddRemoveSong(
          songStringIds.includes(element._id.toHexString()) ? 'remove' : 'add',
          element,
          callback,
        )) || ((): void => { /* Empty function */ })
      ),
      callback: true,
    },
  };

  if (song) {
    return (
      <Editor
        fab={addRemoveButton}
        edit={song.userId === Meteor.userId() && !song.lyrics}
        goBack={handleCloseEditor}
        song={song}
      />
    );
  }

  return (
    <FullCardLayout
      handleReturn={goBack}
    >
      <SearchList
        handleSelectSong={handleSelectSong}
        secondaryActions={[
          addRemoveButton,
          ...secondaryActions || [],
        ]}
      />
    </FullCardLayout>
  );
};

export default AddRemoveSearchList;
