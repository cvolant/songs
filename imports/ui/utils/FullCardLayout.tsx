/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactNode } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions, { CardActionsProps } from '@material-ui/core/CardActions';
import CardContent, { CardContentProps } from '@material-ui/core/CardContent';
import CardHeader, { CardHeaderProps } from '@material-ui/core/CardHeader';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';

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
    paddingTop: 0,
  },
  flexEnd: {
    justifyContent: 'flex-end',
  },
  header: {
    paddingBottom: 0,
    paddingRight: (
      { shortHeader }: { shortHeader: boolean },
    ): number | string => theme.spacing(shortHeader ? 16 : 10),
    transition: theme.transitions.create('padding-right'),
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
}));

interface IFullCardLayoutProps {
  actions?: ReactNode | ReactNode[];
  actionsProps?: CardActionsProps;
  children?: ReactNode | ReactNode[];
  className?: string;
  contentProps?: CardContentProps;
  header?: ReactNode | ReactNode[];
  headerAction?: ReactNode;
  headerSubheader?: ReactNode;
  headerTitle?: ReactNode;
  headerProps?: CardHeaderProps;
  handleReturn?: () => void;
  shortHeader?: boolean;
}

export const FullCardLayout: React.FC<IFullCardLayoutProps> = ({
  actions,
  actionsProps,
  children,
  className,
  contentProps,
  header,
  headerAction,
  headerSubheader,
  headerTitle,
  headerProps,
  handleReturn,
  shortHeader = false,
}) => {
  const classes = useStyles({ shortHeader });
  const { t } = useTranslation();

  return (
    <Card className={clsx(classes.card, className)}>
      {(header || headerAction || headerProps || headerSubheader || headerTitle) && (
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
      {(actions || actionsProps || handleReturn) && (
        <CardActions
          {...actionsProps}
          className={clsx(
            classes.actions,
            handleReturn ? classes.spaceBetween : classes.flexEnd,
            actionsProps && actionsProps.className,
          )}
        >
          {!handleReturn
            ? actions
            : [
              <Button
                className={classes.button}
                color="primary"
                key="return"
                onClick={handleReturn}
                size="large"
                variant="outlined"
              >
                <ArrowBackIos />
                {t('editor.Return', 'Return')}
              </Button>,
              <div className={classes.actionButtons}>{actions}</div>,
            ]}
        </CardActions>
      )}
    </Card>
  );
};

export default FullCardLayout;
