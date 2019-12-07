import React, {
  MouseEvent,
  MouseEventHandler,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';

import useUnmountedRef from '../../hooks/unmountedRef';

import {
  IFn,
  IIconButtonProps,
  IIconButtonBuildProps,
  IIconButtonBuildWithCallbackProps,
} from '../../types/iconButtonTypes';

const useStyles = makeStyles((theme) => ({
  iconButton: {
    '&:hover svg': {
      color: theme.palette.primary.main,
    },
  },
  labelVisibleIcon: {
    marginRight: theme.spacing(0.5),
  },
  loading: {
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
  '@keyframes full-rotation': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(719deg)',
    },
  },
}));

/**
  Deals with the 2 types possibilities of the iconButton props, returning the right usable type.

  @returns The built iconButton props if it is an object with a build function,
  or the prop itself if not.
*/
const fn = <E, T>(
  stuff: T | IFn<E, T>,
  buildProps: IIconButtonBuildProps<E> | IIconButtonBuildWithCallbackProps<E>,
): T => (stuff
  && typeof stuff === 'object'
  && 'build' in stuff ? stuff.build(buildProps as IIconButtonBuildWithCallbackProps<E>) : stuff);

interface ICustomIconButtonProps<E> {
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: (props: any) => JSX.Element;
  element?: E;
  iconButtonProps: IIconButtonProps<E>;
  otherParams?: object;
}

export const CustomIconButton = <E, >({
  className: rootClassName,
  Component,
  element,
  iconButtonProps,
  otherParams,
}: ICustomIconButtonProps<E>): ReactElement | null => {
  const classes = useStyles();
  const unmountedRef = useUnmountedRef();
  const [loading, setLoading] = useState<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (loading) clearTimeout(loading);
  }, []);

  const handleClick = (
    onClick: MouseEventHandler,
    withCallback: boolean,
  ) => (event: MouseEvent): void => {
    if (withCallback) {
      setLoading(setTimeout(() => {
        if (!unmountedRef.current) {
          setLoading(undefined);
        }
      }, 10000));
    }
    onClick(event);
  };

  const callback = (): void => {
    if (loading) clearTimeout(loading);
    setLoading(undefined);
  };

  const {
    className,
    color,
    disabled,
    labelVisible,
    onClick,
  } = iconButtonProps;
  const Icon = fn(iconButtonProps.Icon, { element, otherParams });
  const label = fn(iconButtonProps.label, { element, otherParams });
  const variant = fn(iconButtonProps.variant, { element, otherParams });

  return (
    <Component
      aria-label={label}
      className={clsx(
        rootClassName,
        classes.iconButton,
        loading && classes.loading,
        fn(className, { element, otherParams }),
      )}
      color={fn(color, { element, otherParams })}
      disabled={(fn(disabled, { element, otherParams })) || !!loading || false}
      onClick={handleClick(fn(onClick, { element, otherParams, callback }), 'callback' in onClick)}
      variant={variant}
    >
      {Icon && <Icon className={labelVisible || variant === 'extended' ? classes.labelVisibleIcon : undefined} />}
      {(labelVisible || variant === 'extended') && label}
    </Component>
  );
};

export default CustomIconButton;
