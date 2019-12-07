import React, {
  MouseEventHandler,
  ReactElement,
  useState,
} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import { useDeviceSize } from '../../hooks/contexts/app-device-size-context';
import {
  IIconButtonProps,
  IArrayIconButtonProps,
  IElement,
} from '../../types/iconButtonTypes';
import CustomIconButton from '../utils/CustomIconButton';

const useStyles = makeStyles((theme) => ({
  listIcon: {
    justifyContent: 'center',
  },
  listItem: {
    cursor: 'default',
    padding: (
      { nbRightIcons }: { nbRightIcons: number },
    ): string => theme.spacing(0, [1, 5, 12][nbRightIcons], 0, 0),
  },
  secondaryAction: {
    right: 0,
  },
}));

interface IListLayoutItemProps<E extends IElement> {
  element: E;
  listItemText: ReactElement;
  primaryIcon?: ReactElement;
  primaryAction?: IIconButtonProps<E>;
  secondaryActions?: IArrayIconButtonProps<E>[];
  unfolded: boolean;
}

const ListLayoutItem = <E extends IElement>({
  element,
  listItemText,
  primaryIcon,
  primaryAction,
  secondaryActions = [] as IArrayIconButtonProps<E>[],
  unfolded,
}: IListLayoutItemProps<E>): ReactElement | null => {
  const classes = useStyles({ nbRightIcons: secondaryActions.length });
  const smallDevice = useDeviceSize('sm.down');

  const [hover, setHover] = useState(false);

  const active = hover || unfolded;
  // const PAIcon = pAIcon ? fnFn(pAIcon, element) : undefined;

  const handleMouseEnter: MouseEventHandler<HTMLDivElement> = () => {
    setHover(true);
  };

  const handleMouseLeave: MouseEventHandler<HTMLDivElement> = () => {
    setHover(false);
  };

  return (
    <ListItem
      button
      className={classes.listItem}
      divider
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ListItemIcon className={classes.listIcon}>
        <>
          {active && primaryAction && (
            <CustomIconButton
              Component={IconButton}
              element={element}
              iconButtonProps={primaryAction}
            />
          )}
          {!active && primaryIcon && !smallDevice && (
            <IconButton disabled>
              {primaryIcon}
            </IconButton>
          )}
        </>
      </ListItemIcon>
      {listItemText}
      <ListItemSecondaryAction className={classes.secondaryAction}>
        {secondaryActions.map((secondaryAction) => (
          <CustomIconButton
            Component={IconButton}
            element={element}
            iconButtonProps={secondaryAction}
            key={secondaryAction.key}
          />
        ))}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default ListLayoutItem;
