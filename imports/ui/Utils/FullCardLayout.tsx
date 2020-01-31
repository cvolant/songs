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
import Card, { CardProps } from '@material-ui/core/Card';
import CardActions, { CardActionsProps } from '@material-ui/core/CardActions';
import CardContent, { CardContentProps } from '@material-ui/core/CardContent';
import CardHeader, { CardHeaderProps } from '@material-ui/core/CardHeader';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import { OverrideProps } from '@material-ui/core/OverridableComponent';
import { TypographyTypeMap } from '@material-ui/core/Typography';

import { useDeviceSize } from '../../hooks/contexts/app-device-size-context';
import CustomIconButton from './CustomIconButton';

import {
  IIconButtonProps,
  IArrayIconButtonProps,
} from '../../types/iconButtonTypes';

interface IFullCardLayoutStyleProps {
  bigTitle: boolean;
  contentPaddingTop: boolean;
  shortHeader: 0 | 1 | 2;
}

const useStyles = makeStyles((theme) => ({
  actions: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    position: 'relative',

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
    padding: ({
      bigTitle,
    }: IFullCardLayoutStyleProps): number | string => theme.spacing(bigTitle ? 4 : 2),
    paddingTop: ({
      contentPaddingTop,
    }: IFullCardLayoutStyleProps): number | undefined => (contentPaddingTop ? undefined : 0),
  },
  fab: {
    margin: theme.spacing(2, 2, 2, 0),
  },
  fabsContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  fabsSuperContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100%',
  },
  fabExtended: {
    padding: theme.spacing(0, 1.5),
  },
  header: {
    paddingBottom: 0,
    padding: ({
      bigTitle,
      shortHeader,
    }: IFullCardLayoutStyleProps): number | string => theme.spacing(
      bigTitle ? 4 : 2,
      [0, 10, 16][shortHeader],
      bigTitle ? 4 : 0,
      bigTitle ? 4 : 2,
    ),
    transition: theme.transitions.create('padding-right'),
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
}));

export interface IFullCardLayoutProps<E> {
  actions?:
  | ReactNode
  | IIconButtonProps<E>
  | Array<ReactNode | IArrayIconButtonProps<E> | Array<IArrayIconButtonProps<E> | null> | null>;
  actionsProps?: CardActionsProps;
  bigTitle?: boolean;
  cardProps?: CardProps;
  children?: ReactNode | ReactNode[];
  className?: string;
  contentProps?: CardContentProps;
  element?: E;
  fabs?: IIconButtonProps<E> | Array<IArrayIconButtonProps<E> | undefined>;
  header?: ReactNode | ReactNode[];
  headerAction?: ReactNode | IIconButtonProps<E>;
  headerSubheader?: ReactNode;
  headerTitle?: ReactNode;
  headerProps?: CardHeaderProps;
  handleReturn?: () => void;
  otherParams?: object;
  shortHeader?: 0 | 1 | 2;
}

export const FullCardLayout = <E, >({
  actions,
  actionsProps,
  bigTitle = false,
  cardProps,
  children,
  className,
  contentProps,
  element,
  fabs,
  header,
  headerAction,
  headerSubheader,
  headerTitle,
  headerProps,
  handleReturn,
  otherParams,
  shortHeader = 1,
}: IFullCardLayoutProps<E>): ReactElement | null => {
  const headerExists = !!(header || headerAction || headerProps || headerSubheader || headerTitle);
  const classes = useStyles({
    bigTitle,
    contentPaddingTop: !headerExists,
    shortHeader,
  });
  const smallDevice = useDeviceSize('sm', 'down');
  const { t } = useTranslation();

  const iconButtonOrFullNode = (
    customParam: ReactNode | IIconButtonProps<E> | IArrayIconButtonProps<E>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Component?: (props: any) => JSX.Element,
  ): ReactNode => {
    if (customParam && typeof customParam === 'object' && 'label' in customParam) {
      return (
        <CustomIconButton
          Component={Component || Button}
          element={element}
          key={'key' in customParam ? customParam.key : undefined}
          iconButtonProps={customParam}
          otherParams={otherParams}
        />
      );
    }
    return customParam;
  };

  const fabsArray: Array<
  | IIconButtonProps<E>
  | IArrayIconButtonProps<E>
  | undefined
  > = Array.isArray(fabs) ? fabs : [fabs];

  return (
    <Card {...cardProps} className={clsx(classes.card, className)}>
      {headerExists && (
        <CardHeader
          action={iconButtonOrFullNode(headerAction, IconButton)}
          className={clsx(classes.header, headerProps && headerProps.className)}
          subheader={headerSubheader}
          title={headerTitle}
          {...headerProps}
          titleTypographyProps={{
            component: 'h1',
            ...headerProps && headerProps.titleTypographyProps,
            variant: bigTitle ? 'h1' : 'h4',
          } as unknown as Partial<OverrideProps<TypographyTypeMap<{}, 'h1'>, 'h1'>>}
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
      {(actions || actionsProps || handleReturn || fabs) && (
        <CardActions
          {...actionsProps}
          className={clsx(
            classes.actions,
            actionsProps && actionsProps.className,
          )}
        >
          {handleReturn
            ? (
              <Button
                className={classes.button}
                color="primary"
                key="return"
                onClick={handleReturn}
                size="large"
              >
                <ArrowBackIos />
                {smallDevice ? '' : t('Return', 'Return')}
              </Button>
            ) : <div />}
          {Array.isArray(actions)
            ? (
              <div>
                {(actions as Array<ReactNode | IArrayIconButtonProps<E>>).map((
                  action: ReactNode | IArrayIconButtonProps<E>,
                  actionIndex,
                ) => {
                  if (Array.isArray(action)) {
                    return (
                      // eslint-disable-next-line react/no-array-index-key
                      <ButtonGroup key={`button-group-${actionIndex}`}>
                        {action.map((subAction) => iconButtonOrFullNode(subAction))}
                      </ButtonGroup>
                    );
                  }
                  return iconButtonOrFullNode(action);
                })}
              </div>
            ) : iconButtonOrFullNode(actions)}
          {fabs ? (
            <div key="fabs" className={classes.fabsSuperContainer}>
              <div className={classes.fabsContainer}>
                {fabsArray.map((fab?: IIconButtonProps<E> | IArrayIconButtonProps<E>) => (fab ? (
                  <CustomIconButton
                    className={classes.fab}
                    Component={Fab}
                    element={element}
                    iconButtonProps={fab}
                    key={'key' in fab ? fab.key : 'fab'}
                  />
                ) : null))}
              </div>
            </div>
          ) : null}
        </CardActions>
      )}
    </Card>
  );
};

export default FullCardLayout;
