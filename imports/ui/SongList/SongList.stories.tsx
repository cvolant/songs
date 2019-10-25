import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  withKnobs, boolean,
} from '@storybook/addon-knobs';
import SongListItem from './SongListItem';
import { Session, song } from '../../stories';

export default {
  title: 'SongList',
  parameters: { Session },
  decorators: [withKnobs],
};

export const songListItem = (): JSX.Element => (
  <SongListItem
    smallDevice={boolean('smallDevice', true)}
    favorite={boolean('favorite', true)}
    handleSelect={action('select')}
    handleToggleFavorite={(): () => void => action('toggle favorite')}
    handleUnfold={action('unfold')}
    displayFavorite={boolean('displayFavorite', true)}
    song={song}
    unfolded={boolean('unfolded', true)}
  />
);
