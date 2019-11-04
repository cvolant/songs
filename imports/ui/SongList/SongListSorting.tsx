import React, { ChangeEvent } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import Clear from '@material-ui/icons/Clear';
import Sort from '@material-ui/icons/Sort';

import { useDeviceSize } from '../../state-contexts/app-device-size-context';
import { ISortSpecifier, ISortCriterion } from '../../types';

const sortCriteria: ISortCriterion[] = ['title', 'compositor', 'author', 'year'];

const useStyles = makeStyles((theme) => {
  const favoritesSpace = (
    { displayFavorite }: { displayFavorite?: boolean },
  ): number => theme.spacing(displayFavorite ? 10 : 4);
  return ({
    button: {
      textTransform: 'none',
    },
    buttonDefaultColor: {
      color: theme.palette.font.color.black,
      opacity: theme.palette.font.opacity.light,
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
    flexGrow: {
      flexGrow: 1,
    },
    invisible: {
      opacity: 0,
    },
    listIcon: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    sortBy: {
      fontStyle: 'italic',
    },
    sortOptions: {
      margin: theme.spacing(0, 1),
    },
    sortIcon: {
      transitionProperty: 'transform, opacity',
      transitionDuration: `${theme.transitions.duration.standard}`,
      opacity: 0,
    },
    sortIconVisible: {
      opacity: 1,
    },
    sortIconDown: {
      transform: 'rotate(180deg)',
    },
    textField: {
      width: '100%',
    },
    typography: {
      alignItems: 'center',
      display: 'flex',
      fontSize: 'small',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    root: {
      backgroundColor: 'inherit',
      display: 'flex',
      padding: 0,
      paddingRight: favoritesSpace,
    },
    year: {
      flexShrink: 0,
      marginLeft: theme.spacing(2),
    },
  });
});

interface ISongListSortingProps {
  displayFavorite?: boolean;
  handleToggleDisplaySort: (display?: boolean) => () => void;
  handleSort: (sortName: ISortCriterion) => () => void;
  sort?: ISortSpecifier;
}

export const SongListSorting: React.FC<ISongListSortingProps> = ({
  displayFavorite,
  handleToggleDisplaySort,
  handleSort,
  sort,
}) => {
  const { t } = useTranslation();
  const classes = useStyles({ displayFavorite });
  const smallDevice = useDeviceSize('sm.down');
  console.log('From SongListSorting, render. sort:', sort);

  const sortButton = (buttonName: ISortCriterion): JSX.Element => (
    <Button
      classes={{ root: classes.button, colorInherit: classes.buttonDefaultColor }}
      color={sort && sort[buttonName] ? 'primary' : 'inherit'}
      key={buttonName}
      onClick={handleSort(buttonName)}
      size="small"
    >
      <ArrowDropUp className={
        clsx(
          classes.sortIcon,
          sort && sort[buttonName] && clsx(
            classes.sortIconVisible,
            sort[buttonName] < 0 && classes.sortIconDown,
          ),
        )
      }
      />
      {t(`song.${buttonName}`, buttonName)}
    </Button>
  );

  const handleChange = (event: ChangeEvent<{
    name?: string;
    value: unknown;
  }>): void => {
    handleSort(event.target.value as ISortCriterion)();
  };

  return (
    <ListSubheader className={classes.root}>
      <ListItemIcon className={classes.listIcon}>
        <IconButton onClick={handleToggleDisplaySort(false)} size="small">
          <Clear fontSize="small" />
        </IconButton>
      </ListItemIcon>
      <ListItemText
        disableTypography
        primary={(
          <div className={classes.container}>
            {smallDevice ? (
              <TextField
                select
                className={classes.textField}
                onChange={handleChange}
                value={sort ? Object.keys(sort)[0] : ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <ArrowDropUp
                        className={clsx(
                          classes.sortIcon,
                          sort && Object.keys(sort).length && clsx(
                            classes.sortIconVisible,
                            sort && Object.values(sort)[0] < 0 && classes.sortIconDown,
                          ),
                        )}
                      />
                    </InputAdornment>
                  ),
                }}
                SelectProps={{
                  IconComponent: Sort,
                  displayEmpty: true,
                  renderValue: (value: unknown): React.ReactNode => (
                    <Typography className={clsx(classes.typography, classes.sortOptions)}>
                      <span className={classes.sortBy}>
                        {t('search.sort', 'sort')}
                        {t('colon', ':')}
                        {' '}
                      </span>
                      <span className={classes.sortOptions}>
                        {value ? `${t('search.by', 'by')} ${t(`song.${value}`, value as string)}` : t('search.none', 'none')}
                      </span>
                    </Typography>
                  ),
                }}
              >
                {sortCriteria.map((option) => (
                  <MenuItem key={option} value={option}>
                    {t(`song.${option}`, option)}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <>
                <Typography className={clsx(classes.typography, classes.flexGrow)} variant="body1">
                  <span className={classes.sortBy}>
                    {t('search.sort by', 'sort by')}
                  </span>
                  <span className={clsx(classes.buttons, classes.sortOptions)}>
                    {sortCriteria
                      .slice(0, sortCriteria.length - 1)
                      .map((buttonName) => sortButton(buttonName))}
                  </span>
                </Typography>
                <Typography className={clsx(classes.typography, classes.year)} variant="body1">
                  {sortButton('year')}
                </Typography>
              </>
            )}
          </div>
        )}
      />
    </ListSubheader>
  );
};

export default SongListSorting;
