import React from 'react';
import { PropTypes } from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import QueueMusic from '@material-ui/icons/QueueMusic';
import Check from '@material-ui/icons/Check';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

import SongListItemTextSecondary from './SongListItemTextSecondary';
import SongListItemTextPrimary from './SongListItemTextPrimary';
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
              {/*   disableTypography
                primary={<SongListItemTextPrimary { ...{smallDevice, song, unfolded} } />}
                secondary={<SongListItemTextSecondary { ...{smallDevice, song, unfolded} } />}
            /> */}
            <ListItemSecondaryAction className={classes.secondaryAction}>
                {displayFavorite &&
                    <IconButton onClick={handleToggleFavorite()}>
                        {favorite ? <Favorite color='primary' /> : <FavoriteBorder />}
                    </IconButton>
                }
                <IconButton onClick={handleSelect}>
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