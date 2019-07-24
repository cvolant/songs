import React from 'react';
import { PropTypes } from 'prop-types';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import QueueMusic from '@material-ui/icons/QueueMusic';
import Check from '@material-ui/icons/Check';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

import SongListItemText from './SongListItemText';

const useStyles = makeStyles(theme => ({
    listIcon: {
        justifyContent: 'center',
    },
    root: {
        paddingLeft: 0,
        paddingRight: ({ displayFavorite }) => displayFavorite && theme.spacing(11),
    },
    secondaryAction: {
        right: 0,
    },
}));

export const SongListItem = ({ favorite, handleSelect, handleToggleFavorite, handleUnfold, displayFavorite, smallDevice, song, unfolded }) => {
    const { t } = useTranslation();
    const classes = useStyles({ displayFavorite });

    return (
        <ListItem
            button={!unfolded}
            className={classes.root}
            divider
            onClick={handleUnfold}
        >
            {
                !smallDevice &&
                    <ListItemIcon className={classes.listIcon}>
                        <QueueMusic />
                    </ListItemIcon>
            }
            <SongListItemText{ ...{smallDevice, song, unfolded} } />
            <ListItemSecondaryAction className={classes.secondaryAction}>
                {displayFavorite &&
                    <IconButton
                        aria-label={favorite ? t("search.Unmark as favorite", "Unmark as favorite") : t("search.Mark as favorite", "Mark as favorite")}
                        onClick={handleToggleFavorite()}
                    >
                        {favorite ? <Favorite color='primary' /> : <FavoriteBorder />}
                    </IconButton>
                }
                <IconButton aria-label={t("search.Choose this song", "Choose this song")} onClick={handleSelect}>
                    <Check />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
};

SongListItem.propTypes = {
    favorite: PropTypes.bool,
    handleSelect: PropTypes.func.isRequired,
    handleToggleFavorite: PropTypes.func.isRequired,
    handleUnfold: PropTypes.func.isRequired,
    displayFavorite: PropTypes.bool.isRequired,
    smallDevice: PropTypes.bool.isRequired,
    song: PropTypes.object.isRequired,
    unfolded: PropTypes.bool.isRequired,
};

export default SongListItem;