import React, { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import Eye from '@material-ui/icons/RemoveRedEye';
import QueueMusic from '@material-ui/icons/QueueMusic';

import SongListItemText from './SongListItemText';
import ListLayoutItem from '../ListLayout/ListLayoutItem';

import { ISong, IUnfetchedSong } from '../../types/songTypes';
import { IArrayIconButtonProps } from '../../types/iconButtonTypes';

interface ISongListItemProps {
  favorite?: boolean;
  handleSelect: () => void;
  handleToggleFavorite: (value?: boolean) => () => void;
  handleUnfold: MouseEventHandler<HTMLDivElement>;
  displayFavorite: boolean;
  secondaryActions?: IArrayIconButtonProps<IUnfetchedSong>[];
  song: ISong;
  unfolded: boolean;
}

export const SongListItem: React.FC<ISongListItemProps> = ({
  handleSelect,
  handleUnfold,
  secondaryActions,
  song,
  unfolded,
}) => {
  const { t } = useTranslation();

  return (
    <ListLayoutItem<ISong>
      element={song}
      listItemText={(
        <SongListItemText
          song={song}
          unfolded={unfolded}
          handleUnfold={handleUnfold}
        />
      )}
      primaryAction={{
        Icon: Eye,
        label: t('search.Details', 'Details'),
        onClick: handleSelect,
      }}
      primaryIcon={<QueueMusic />}
      secondaryActions={secondaryActions}
      unfolded={unfolded}
    />
  );
};

export default SongListItem;
