import React from 'react';

import Check from '@material-ui/icons/Check';

// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  withKnobs, boolean,
} from '@storybook/addon-knobs';
import {
  AddSongTo,
  EditorButtons,
  Paragraph,
  Title,
} from '../imports/ui/Editor';
import { WrappedEditor } from '../imports/ui/Editor/Editor';
import { UserProvider } from '../imports/state-contexts/app-user-context';
import {
  songs, folders, details, users,
} from './fixtures';
import { IUnfetchedSong } from '../imports/types/songTypes';

export default {
  title: 'Editor',
  decorators: [
    withKnobs,
    (storyFn: () => JSX.Element): JSX.Element => (
      <UserProvider user={users[0]}>
        {storyFn()}
      </UserProvider>
    ),
  ],
};

const actionIconButtonProps = {
  ariaLabel: 'action icon button aria label',
  Icon: Check,
  onClick: (): void => {},
  color: 'primary' as 'primary' | 'default',
  disable: (): boolean => false,
};

export const paragraph = (): JSX.Element => (
  <Paragraph
    edit={boolean('edit', true)}
    editGlobal={boolean('editGlobal', true)}
    selected={boolean('selected', true)}
    paragraph={songs[0].pg[0]}
    handleEditPg={action('handleEditPg')}
    handlePgChange={action('handlePgChange')}
    handleLabelChange={action('handleLabelChange')}
    handlePgCancel={action('handlePgCancel')}
    handleSelect={action('handleSelect')}
    handleDeletePg={action('handleDeletePg')}
    handleMoveUp={action('handleMoveUp')}
    handleMoveDown={action('handleMoveDown')}
  />
);

export const title = (): JSX.Element => (
  <Title
    edit={boolean('edit', true)}
    editGlobal={boolean('editGlobal', true)}
    details={details}
    subtitle={songs[0].subtitle}
    title={songs[0].title}
    handleTitleChange={action('handleTitleChange')}
    handleSubtitleChange={action('handleSubtitleChange')}
    handleDetailChange={action('handleDetailChange')}
    handleTitleCancel={action('handleTitleCancel')}
    handleEditTitle={action('handleEditTitle')}
    logoMenuDeployed={boolean('logoMenuDeployed', true)}
  />
);

export const editorButtons = (): JSX.Element => (
  <EditorButtons
    actionIconButtonProps={boolean('actionIconButtonProps', true)
      ? {
        ...actionIconButtonProps,
        onClick: (song: IUnfetchedSong): () => void => action(`actionIconButtonClick. song.title: ${song.title}`),
        disable: (): boolean => boolean('disable', false),
      } : undefined}
    edit={boolean('edit', false)}
    goBack={action('goBack')}
    handleCancelAll={action('handleCancelAll')}
    handleDelete={action('handleDelete')}
    handleEditSong={action('handleEditSong')}
    handleSaveAll={action('handleSaveAll')}
    handleToggleSelectAll={action('handleToggleSelectAll')}
    isThereParagraphs={boolean('isThereParagraphs', true)}
    isThereTitle={boolean('isThereTitle', true)}
    selectedPg={songs[0].pg.reverse()}
    song={songs[0]}
    folders={folders}
  />
);
editorButtons.story = {
  decorators: [
    (storyFn: () => JSX.Element): JSX.Element => (
      <div style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
      }}
      >
        {storyFn()}
      </div>
    ),
  ],
};

export const addSongTo = (): JSX.Element => (
  <AddSongTo
    onClose={action('onClose')}
    open={boolean('open', true)}
    song={songs[0]}
    folders={folders}
    user={users[0]}
  />
);

export const wrappedEditor = (): JSX.Element => (
  <WrappedEditor
    edit={boolean('edit', false)}
    goBack={action('goBack')}
    logoMenuDeployed={boolean('logoMenuDeployed', true)}
    song={songs[0]}
    folders={folders}
    meteorCall={action('meteorCall')}
    user={users[0]}
  />
);
