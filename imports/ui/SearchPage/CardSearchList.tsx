import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';

import FullCardLayout from '../utils/FullCardLayout';
import SearchList from './SearchList';

import { IUnfetchedSong } from '../../types/songTypes';
import { IArrayIconButtonProps } from '../../types/iconButtonTypes';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    padding: theme.spacing(1, 1.5),
  },
}));

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
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <FullCardLayout
      actions={(
        <Button
          className={classes.button}
          color="primary"
          onClick={goBack}
          size="large"
          variant="outlined"
        >
          <ArrowBackIos />
          {t('editor.Return', 'Return')}
        </Button>
      )}
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
};

export default CardSearchList;
