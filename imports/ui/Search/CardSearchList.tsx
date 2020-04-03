import React from 'react';

import FullCardLayout from '../Common/FullCardLayout';
import SearchList from './SearchList';

import { ISong, IUnfetched } from '../../types';
import { IArrayIconButtonProps } from '../../types/iconButtonTypes';

interface ICardSearchListProps {
  goBack: () => void;
  handleSelectSong: (song: IUnfetched<ISong>) => void;
  secondaryActions: IArrayIconButtonProps<IUnfetched<ISong>>[];
}

export const CardSearchList: React.FC<ICardSearchListProps> = ({
  goBack,
  handleSelectSong,
  secondaryActions,
}) => (
  <FullCardLayout
    handleReturn={goBack}
  >
    <SearchList
      handleSelectSong={handleSelectSong}
      secondaryActions={secondaryActions}
    />
  </FullCardLayout>
);

export default CardSearchList;
