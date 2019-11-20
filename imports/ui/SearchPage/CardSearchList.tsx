import React from 'react';

import FullCardLayout from '../utils/FullCardLayout';
import SearchList from './SearchList';

import { IUnfetchedSong } from '../../types/songTypes';
import { IArrayIconButtonProps } from '../../types/iconButtonTypes';

interface ICardSearchListProps {
  goBack: () => void;
  shortFirstItem?: boolean;
  shortSearchField?: boolean;
  handleFocus: (focus?: boolean) => () => void;
  handleSelectSong: (song: IUnfetchedSong) => void;
  secondaryActions: IArrayIconButtonProps[];
}

export const CardSearchList: React.FC<ICardSearchListProps> = ({
  goBack,
  shortFirstItem,
  shortSearchField,
  handleFocus,
  handleSelectSong,
  secondaryActions,
}) => (
  <FullCardLayout
    handleReturn={goBack}
  >
    <SearchList
      handleFocus={handleFocus}
      handleSelectSong={handleSelectSong}
      shortFirstItem={shortFirstItem}
      shortSearchField={shortSearchField}
      secondaryActions={secondaryActions}
    />
  </FullCardLayout>
);

export default CardSearchList;
