import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  withKnobs, boolean,
} from '@storybook/addon-knobs';
import Paragraph from './Paragraph';
import {
  Meteor, Mongo, Session, songs, folders, details, users,
} from '../../stories';
import Title from './Title';
import EditorButtons from './EditorButtons';
import AddSongTo from './AddSongTo';
import { UserProvider } from '../../state-contexts/app-user-context';

export default {
  title: 'Editor',
  parameters: {
    Session, Mongo, Meteor,
  },
  decorators: [withKnobs],
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
    edit={boolean('edit', false)}
    goBack={action('goBack')}
    handleCancelAll={action('handleCancelAll')}
    handleDelete={action('handleDelete')}
    handleEditSong={action('handleEditSong')}
    handleOpenScreen={action('handleOpenScreen')}
    handleSaveAll={action('handleSaveAll')}
    handleToggleSelectAll={action('handleToggleSelectAll')}
    isThereParagraphs={boolean('isThereParagraphs', true)}
    isThereSelected={boolean('isThereSelected', false)}
    isThereTitle={boolean('isThereTitle', true)}
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
        <UserProvider user={users[0]}>
          {storyFn()}
        </UserProvider>
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
