/* eslint-disable react/jsx-props-no-spreading */
import React, {
  ReactNode,
  ReactElement,
} from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Card from '@material-ui/core/Card';
import CardActions, { CardActionsProps } from '@material-ui/core/CardActions';
import CardContent, { CardContentProps } from '@material-ui/core/CardContent';
import CardHeader, { CardHeaderProps } from '@material-ui/core/CardHeader';
import Fab from '@material-ui/core/Fab';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';

import { useDeviceSize } from '../../hooks/contexts/app-device-size-context';
import CustomIconButton from './CustomIconButton';

import {
  IIconButtonProps,
  IArrayIconButtonProps,
} from '../../types/iconButtonTypes';

const useStyles = makeStyles((theme) => ({
  actions: {
    display: 'flex',
    position: 'relative',
    alignItems: 'center',

    '&::before': {
      background: `linear-gradient(to top, ${theme.palette.grey['500']}, transparent)`,
      borderRadius: theme.spacing(0, 0, 0.5, 0.5),
      content: '""',
      height: '0.5rem',
      left: 0,
      position: 'absolute',
      top: '-0.5rem',
      width: '100%',
    },
  },
  actionButtons: {
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    margin: theme.spacing(1),
    padding: theme.spacing(1, 1.5),
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  content: {
    flexGrow: 1,
    overflowY: 'auto',
    overflowScrolling: 'touch',
    paddingTop: (
      {
        contentPaddingTop,
      }: {
        shortHeader: boolean;
        contentPaddingTop: boolean;
      },
    ): number | undefined => (contentPaddingTop ? undefined : 0),
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2.5),
    right: theme.spacing(2.5),
  },
  fabContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    verticalAlign: 'bottom',
    width: '100%',
  },
  fabExtended: {
    padding: theme.spacing(0, 1.5),
  },
  flexEnd: {
    justifyContent: 'flex-end',
  },
  header: {
    paddingBottom: 0,
    paddingRight: (
      {
        shortHeader,
      }: {
        shortHeader: boolean;
        contentPaddingTop: boolean;
      },
    ): number | string => theme.spacing(shortHeader ? 16 : 10),
    transition: theme.transitions.create('padding-right'),
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
}));

interface IFullCardLayoutProps<E> {
  actions?: ReactNode | Array<ReactNode | IArrayIconButtonProps<E>>;
  actionsProps?: CardActionsProps;
  children?: ReactNode | ReactNode[];
  className?: string;
  contentProps?: CardContentProps;
  element?: E;
  fab?: IIconButtonProps<E>;
  header?: ReactNode | ReactNode[];
  headerAction?: ReactNode;
  headerSubheader?: ReactNode;
  headerTitle?: ReactNode;
  headerProps?: CardHeaderProps;
  handleReturn?: () => void;
  otherParams?: object;
  shortHeader?: boolean;
}

export const FullCardLayout = <E, >({
  actions,
  actionsProps,
  children,
  className,
  contentProps,
  element,
  fab,
  header,
  headerAction,
  headerSubheader,
  headerTitle,
  headerProps,
  handleReturn,
  otherParams,
  shortHeader = false,
}: IFullCardLayoutProps<E>): ReactElement | null => {
  const headerExists = !!(header || headerAction || headerProps || headerSubheader || headerTitle);
  const classes = useStyles({
    shortHeader,
    contentPaddingTop: !headerExists,
  });
  const smallDevice = useDeviceSize('sm.down');
  const { t } = useTranslation();

  return (
    <Card className={clsx(classes.card, className)}>
      {headerExists && (
        <CardHeader
          {...headerProps}
          action={headerAction}
          className={clsx(classes.header, headerProps && headerProps.className)}
          subheader={headerSubheader}
          title={headerTitle}
        >
          {header}
        </CardHeader>
      )}
      {(children || contentProps) && (
        <CardContent
          {...contentProps}
          className={clsx(classes.content, contentProps && contentProps.className)}
        >
          {children}
        </CardContent>
      )}
      {(actions || actionsProps || handleReturn || fab) && (
        <CardActions
          {...actionsProps}
          className={clsx(
            classes.actions,
            handleReturn ? classes.spaceBetween : classes.flexEnd,
            actionsProps && actionsProps.className,
          )}
        >
          {[
            handleReturn
              ? (
                <Button
                  className={classes.button}
                  color="primary"
                  key="return"
                  onClick={handleReturn}
                  size="large"
                >
                  <ArrowBackIos />
                  {smallDevice ? '' : t('editor.Return', 'Return')}
                </Button>
              ) : null,

            Array.isArray(actions)
              ? (
                <ButtonGroup key="button-group">
                  {(actions as Array<ReactNode | IArrayIconButtonProps<E>>).map((
                    action: ReactNode | IArrayIconButtonProps<E>,
                  ) => {
                    if (action && typeof action === 'object' && 'label' in action) {
                      return (
                        <CustomIconButton
                          Component={Button}
                          element={element}
                          key={action.key}
                          iconButtonProps={action}
                          otherParams={otherParams}
                        />
                      );
                    }
                    return action;
                  })}
                </ButtonGroup>
              ) : actions,

            fab
              ? (
                <div key="fab" className={classes.fabContainer}>
                  <CustomIconButton
                    className={classes.fab}
                    Component={Fab}
                    element={element}
                    iconButtonProps={fab}
                  />
                </div>
              ) : null,
          ]}
        </CardActions>
      )}
    </Card>
  );
};

export default FullCardLayout;
