import React, { ChangeEvent, ReactElement } from 'react';
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

import { useDeviceSize } from '../../hooks/contexts/app-device-size-context';

import { ISortSpecifier, ISortCriterion } from '../../types/searchTypes';
import { ISong, IFolder } from '../../types';

const useStyles = makeStyles((theme) => ({
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
    paddingRight: theme.spacing(4),
  },
  year: {
    flexShrink: 0,
    marginLeft: theme.spacing(2),
  },
}));

interface IListLayoutSortingProps<T extends ISong | IFolder> {
  handleToggleDisplaySort: (display?: boolean) => () => void;
  handleSort: (sortCriterion: ISortCriterion<T>) => () => void;
  sort?: ISortSpecifier<T>;
  sortCriteria: {
    criterion: ISortCriterion<T>;
    localCriterionName: string;
  }[];
}

export const ListLayoutSorting = <T extends ISong | IFolder>({
  handleToggleDisplaySort,
  handleSort,
  sort,
  sortCriteria,
}: IListLayoutSortingProps<T>): ReactElement | null => {
  const { t } = useTranslation();
  const classes = useStyles();
  const smallDevice = useDeviceSize('sm.down');

  const [sortCriterion = '', sortValue = ''] = Object.entries(sort || {})[0];

  console.log('From ListLayoutSorting, render. sort:', sort, 'sortCriterion:', sortCriterion, 'sortValue:', sortValue);

  const sortButton = (buttonName: ISortCriterion<T>): JSX.Element => (
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
      {(sortCriteria.find((foundCriterion) => foundCriterion.criterion === buttonName) || {}).localCriterionName || ''}
    </Button>
  );

  const handleChange = (event: ChangeEvent<{
    name?: string;
    value: unknown;
  }>): void => {
    handleSort(event.target.value as ISortCriterion<T>)();
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
                value={sortCriterion}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <ArrowDropUp
                        className={clsx(
                          classes.sortIcon,
                          sortValue && clsx(
                            classes.sortIconVisible,
                            typeof sortValue === 'number' && sortValue < 0 && classes.sortIconDown,
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
                        {((): string => {
                          if (value) {
                            const criterion = sortCriteria
                              .find((foundCriterion) => foundCriterion.criterion === value);
                            if (criterion) {
                              return `${t('search.by', 'by')} ${criterion.localCriterionName}`;
                            }
                          }
                          return t('search.none', 'none');
                        })()}
                      </span>
                    </Typography>
                  ),
                }}
              >
                {sortCriteria.map((criterion) => (
                  <MenuItem key={criterion.criterion} value={criterion.criterion}>
                    {criterion.localCriterionName}
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
                      .map((criterion) => sortButton(criterion.criterion))}
                  </span>
                </Typography>
                <Typography className={clsx(classes.typography, classes.year)} variant="body1">
                  {sortButton(sortCriteria[sortCriteria.length - 1].criterion)}
                </Typography>
              </>
            )}
          </div>
        )}
      />
    </ListSubheader>
  );
};

export default ListLayoutSorting;
