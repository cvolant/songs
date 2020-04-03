import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  withKnobs, boolean,
} from '@storybook/addon-knobs';

import { UserProvider } from '../imports/hooks/contexts/User';
import {
  AddSongTo,
  Editor,
  Paragraph,
  Title,
} from '../imports/ui/Editor';

import { IParagraph } from '../imports/types';

import {
  songs, folders, details,
} from './fixtures';

export default {
  title: 'Editor',
  decorators: [
    withKnobs,
    (storyFn: () => JSX.Element): JSX.Element => (
      <UserProvider>
        {storyFn()}
      </UserProvider>
    ),
  ],
};

export const paragraph = (): JSX.Element => (
  <Paragraph
    edit={boolean('edit', true)}
    editGlobal={boolean('editGlobal', true)}
    selected={boolean('selected', true)}
    paragraph={songs[0].lyrics[0] as IParagraph}
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

export const addSongTo = (): JSX.Element => (
  <AddSongTo
    onClose={action('onClose')}
    open={boolean('open', true)}
    song={songs[0]}
    folders={folders}
  />
);

export const editor = (): JSX.Element => (
  <Editor
    edit={boolean('edit', false)}
    goBack={action('goBack')}
    logoMenuDeployed={boolean('logoMenuDeployed', true)}
    song={songs[0]}
  />
);
