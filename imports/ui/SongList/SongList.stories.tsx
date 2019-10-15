import React from 'react';
import { action } from '@storybook/addon-actions';
import SongListItem from './SongListItem';

export default {
  title: 'SongList',
};

const song = {
  _id: {
    equals: (): boolean => false,
    toHexString: (): string => '13490834017942ab',
  },
  auteur: 'Auteur George',
  cnpl: true,
  cote: 'Cote123',
  compositeur: 'Compo Greg',
  editeur: 'Ed Lapointe',
  traducteur: 'Trad Voine',
  nouvelleCote: 'Ncoteabc',
  numero: 123,
  annee: 2000,
  sousTitre: 'Sous-titre',
  titre: 'Titre',
  pg: [
    {
      label: 'refrain',
      pg: 'Frere Jacques ! Frere Jacques !',
    },
    {
      label: 'couplet',
      pg: 'Dormez-vous ? Dormez-vous ?',
    },
    {
      label: 'couplet',
      pg: 'Sonnez les matines ! Sonnez les matines !',
    },
    {
      label: 'couplet',
      pg: 'Ding ding dong ! Ding ding dong !',
    },
  ],
};

export const favoriteUnfoldedListItem = (): JSX.Element => (
  <SongListItem
    favorite
    handleSelect={action('select')}
    handleToggleFavorite={() => action('toggle favorite')}
    handleUnfold={action('unfold')}
    displayFavorite
    song={song}
    unfolded
  />
);

export const smallFoldedListItem = (): JSX.Element => (
  <SongListItem
    handleSelect={action('select')}
    handleToggleFavorite={() => action('toggle favorite')}
    handleUnfold={action('unfold')}
    displayFavorite
    smallDevice
    song={song}
  />
);
