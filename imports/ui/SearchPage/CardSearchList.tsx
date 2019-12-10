import React from 'react';

import FullCardLayout from '../utils/FullCardLayout';
import SearchList from './SearchList';

import { ISong, IUnfetched } from '../../types';
import { IArrayIconButtonProps } from '../../types/iconButtonTypes';

interface ICardSearchListProps {
  goBack: () => void;
  shortFirstItem?: boolean;
  shortSearchField?: boolean;
  handleFocus: (focus?: boolean) => () => void;
  handleSelectSong: (song: IUnfetched<ISong>) => void;
  secondaryActions: IArrayIconButtonProps<IUnfetched<ISong>>[];
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
