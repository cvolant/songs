import React from 'react';
import { PropTypes } from 'prop-types';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { ArrowDropUp, Clear } from '@material-ui/icons';

const useStyles = makeStyles(theme => {
    const favoritesSpace = ({ displayFavorite }) => theme.spacing(displayFavorite ? 11 : 6);
    return ({
        button: {
            textTransform: 'none',
        },
        buttonDefaultColor: {
            color: theme.palette.font.light,
        },
        buttons: {
            display: 'flex',
            justifyContent: 'space-around',
            flexGrow: 1,
        },
        container: {
            display: 'flex',
            justifyContent: 'space-between',
            marginRight: theme.spacing(2),
            whiteSpace: 'nowrap',
        },
        invisible: {
            opacity: 0,
        },
        listIcon: {
            justifyContent: 'center',
        },
        sortOptions: {
            alignItems: 'center',
            display: 'flex',
            flexGrow: 1,
            fontStyle: 'italic',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
        sortIcon: {
            transitionProperty: 'transform, opacity',
            transitionDuration: theme.transitions.duration.standard,
            opacity: 0,
        },
        sortIconVisible: {
            opacity: 1,
        },
        sortIconDown: {
            transform: 'rotate(180deg)',
        },
        root: {
            background: theme.palette.background.page,
            padding: 0,
            paddingRight: favoritesSpace,
        },
        year: {
            flexShrink: 0,
            marginLeft: theme.spacing(2),
        },
    });
});

export const SongListSorting = ({ displayFavorite, handleToggleDisplaySort, handleSort, sort, smallDevice }) => {
    const { t } = useTranslation();
    const classes = useStyles({ displayFavorite });
    console.log('From SongListSorting, render. sort:', sort);

    const sortButton = buttonName => (
        <Button
            classes={{ root: classes.button, colorInherit: classes.buttonDefaultColor }}
            color={sort && sort[buttonName] ? 'primary' : 'inherit'}
            key={buttonName}
            onClick={handleSort(buttonName)}
            size='small'
        >
            <ArrowDropUp className={
                clsx(
                    classes.sortIcon,
                    sort && sort[buttonName] && clsx(
                        classes.sortIconVisible,
                        sort[buttonName] < 0 && classes.sortIconDown
                    )
                )
            } />
            {t(`song.${buttonName}`, buttonName)}
        </Button>
    );

    return (
        <ListSubheader component={ListItem} className={classes.root} divider>
            {
                !smallDevice &&
                <ListItemIcon className={classes.listIcon}>
                    <IconButton onClick={handleToggleDisplaySort(false)} size='small'>
                        <Clear fontSize='small' />
                    </IconButton>
                </ListItemIcon>
            }
            <ListItemText
                disableTypography
                primary={
                    <div className={classes.container}>
                        <Typography className={classes.sortOptions} fontSize='small' variant='body1'>
                            <span>{t('search.sort by', 'sort by')}{t('colon', ':')} </span>
                            <span className={classes.buttons}>
                                {
                                    ['title', 'compositor', 'author'].map(buttonName => sortButton(buttonName))
                                }
                            </span>
                        </Typography>
                        <Typography className={classes.year} variant='body1'>
                            {sortButton('year')}
                        </Typography>
                    </div>
                }
            />
        </ListSubheader>
    );
};

SongListSorting.propTypes = {
    displayFavorite: PropTypes.bool,
    favoritesOnly: PropTypes.bool,
    handleToggleDisplaySort: PropTypes.func.isRequired,
    handleSort: PropTypes.func.isRequired,
    sort: PropTypes.object,
    smallDevice: PropTypes.bool.isRequired,
};

export default SongListSorting;