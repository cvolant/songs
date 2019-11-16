import { Mongo } from 'meteor/mongo';
import React, {
  MouseEvent,
  MouseEventHandler,
  ReactElement,
  useState,
} from 'react';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import { useDeviceSize } from '../../hooks/contexts/app-device-size-context';
import useUnmountedRef from '../../hooks/unmountedRef';
import {
  fn,
  fnFn,
  IIconButtonProps,
  IArrayIconButtonProps,
} from '../../types/iconButtonTypes';

const useStyles = makeStyles((theme) => ({
  iconLoading: {
    '&::before': {
      animation: '$full-rotation 1200ms cubic-bezier(.4,.2,.2,.6) infinite',
      background: `linear-gradient(0deg, ${theme.palette.darken.medium} 0%, transparent 100%)`,
      borderRadius: '50%',
      content: '""',
      height: '100%',
      position: 'absolute',
      width: '100%',
    },
  },
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
  '@keyframes full-rotation': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(719deg)',
    },
  },
}));

interface IListLayoutItemProps {
  element: { _id: Mongo.ObjectID };
  listItemText: ReactElement;
  primaryIcon?: ReactElement;
  primaryAction?: IIconButtonProps;
  secondaryActions?: IArrayIconButtonProps[];
  unfolded: boolean;
}

const ListLayoutItem: React.FC<IListLayoutItemProps> = ({
  element,
  listItemText,
  primaryIcon,
  primaryAction: {
    ariaLabel: pAAriaLabel,
    color: pAColor,
    className: pAClassName,
    disabled: pADisabled,
    Icon: pAIcon,
    onClick: pAOnClick,
  } = {},
  secondaryActions = [],
  unfolded,
}) => {
  const classes = useStyles({ nbRightIcons: secondaryActions.length });
  const smallDevice = useDeviceSize('sm.down');
  const unmountedRef = useUnmountedRef();

  const [hover, setHover] = useState(false);
  const [iconsLoading, setIconsLoading] = useState<{ [index: string]: NodeJS.Timeout }>({});
  /* Former init state:
    // From [{ key: "key1", ... }, { key: "key2", ... }, ... ] to { key1: false, key2: false, ... }
    secondaryActions.reduce((actionsObject, secondaryAction) => Object.assign(actionsObject, {
      [secondaryAction.key]: false,
    }), {}),
   */
  const active = hover || unfolded;
  const PAIcon = pAIcon ? fnFn(pAIcon, element) : undefined;

  const handleMouseEnter: MouseEventHandler<HTMLDivElement> = () => {
    setHover(true);
  };

  const handleMouseLeave: MouseEventHandler<HTMLDivElement> = () => {
    setHover(false);
  };

  const onClickCallback = (key: string) => (): void => {
    setIconsLoading(Object.assign(iconsLoading, { [key]: undefined }));
  };

  const handleIconClick = (
    key: string,
    onClick: MouseEventHandler,
  ) => (event: MouseEvent): void => {
    const iconLoading = setTimeout(() => {
      if (!unmountedRef.current) {
        setIconsLoading(Object.assign(iconsLoading, { [key]: undefined }));
      }
    }, 5000);
    setIconsLoading(Object.assign(iconsLoading, { [key]: iconLoading }));
    onClick(event);
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
          {active && PAIcon && (
            <IconButton
              aria-label={pAAriaLabel && fn(pAAriaLabel, element)}
              className={pAClassName && fn(pAClassName, element)}
              color={pAColor && fn(pAColor, element)}
              disabled={pADisabled && fn(pADisabled, element)}
              onClick={pAOnClick && fnFn(pAOnClick, element)}
            >
              <PAIcon />
            </IconButton>
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
        {secondaryActions.map((secondaryAction) => {
          const {
            ariaLabel, className, color, disabled, Icon, key, onClick,
          } = secondaryAction;
          const IconButtonIcon = fnFn(Icon, element);
          return (
            <IconButton
              aria-label={fn(ariaLabel, element)}
              className={clsx(fn(className, element), iconsLoading[key] && classes.iconLoading)}
              color={fn(color, element)}
              disabled={(fn(disabled, element)) || !!iconsLoading[key] || false}
              key={key}
              onClick={handleIconClick(key, fnFn(onClick, element, onClickCallback(key)))}
            >
              <IconButtonIcon />
            </IconButton>
          );
        })}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default ListLayoutItem;
