import React, { ChangeEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Cancel from '@material-ui/icons/Cancel';
import Check from '@material-ui/icons/Check';
import Edit from '@material-ui/icons/Edit';
import { CSSProperties } from '@material-ui/styles';

import { useDeviceSize } from '../../hooks/contexts/app-device-size-context';
import Detail, { IDetails, IDetailTarget } from './Detail';
import Typography from '../Common/Typography';

const useStyles = makeStyles((theme) => ({
  actionButtonsColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    paddingTop: 0,

    '&:last-child': {
      paddingBottom: theme.spacing(1.5),
    },
  },
  cardHeader: {
    paddingBottom: theme.spacing(1.5),
    paddingRight: (
      { logoMenuDeployed }: { logoMenuDeployed: boolean },
    ): string => `${logoMenuDeployed ? 10 : 5}rem`,
  } as unknown as () => CSSProperties,
  cardHeaderAction: {
    order: -1,
    marginRight: 0,
    marginLeft: theme.spacing(-1),
  },
  logoSpace: {
    height: '1px',
    width: (
      { logoMenuDeployed }: { logoMenuDeployed: boolean },
    ): string => (logoMenuDeployed ? '7rem' : ''),
    float: 'right',
  } as unknown as () => CSSProperties,
  root: {
    flexShrink: 0,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
  },
}));

interface ITitle {
  edit: boolean;
  editGlobal: boolean;
  details: IDetails;
  subtitle?: string;
  title: string;
  handleEditTitle: () => void;
  handleTitleChange: ChangeEventHandler<HTMLInputElement>;
  handleSubtitleChange: ChangeEventHandler<HTMLInputElement>;
  handleDetailChange: (target: IDetailTarget) => void;
  handleTitleCancel: () => void;
  logoMenuDeployed?: boolean;
}

const Title: React.FC<ITitle> = ({
  edit,
  editGlobal,
  details,
  subtitle,
  title,
  handleTitleChange,
  handleSubtitleChange,
  handleDetailChange,
  handleTitleCancel,
  handleEditTitle,
  logoMenuDeployed,
}) => {
  const titleEdit = edit && editGlobal;

  const { t } = useTranslation();
  const classes = useStyles({ logoMenuDeployed });
  const smallDevice = useDeviceSize('sm', 'down');

  const detailsArray = Object.entries(details);
  // console.log('From Title, render. detailsArray:', detailsArray);

  return (
    <Card elevation={0} className={classes.root}>
      <CardHeader
        action={
          editGlobal
            ? (
              <div className={classes.actionButtonsColumn}>
                <IconButton
                  color={titleEdit ? 'primary' : 'default'}
                  onClick={handleEditTitle}
                >
                  {titleEdit ? <Check /> : <Edit />}
                </IconButton>
                {titleEdit
                  ? (
                    <IconButton onClick={handleTitleCancel}>
                      <Cancel />
                    </IconButton>
                  )
                  : undefined}
              </div>
            )
            : undefined
        }
        classes={{ root: classes.cardHeader, action: classes.cardHeaderAction }}
        subheader={titleEdit
          ? (
            <TextField
              label={t('song.subtitle', 'Subtitle')}
              multiline
              rowsMax="2"
              className={classes.textField}
              margin="normal"
              variant="outlined"
              value={subtitle}
              onChange={handleSubtitleChange}
              autoFocus
            />
          )
          : (
            <Typography component="h2" variant="h6">{title}</Typography>
          )}
        title={titleEdit
          ? (
            <TextField
              label={t('song.title', 'Title')}
              multiline
              rowsMax="2"
              className={classes.textField}
              margin="normal"
              variant="outlined"
              value={title}
              onChange={handleTitleChange}
              autoFocus
            />
          )
          : (
            <Typography component="h1" variant="h4">{title}</Typography>
          )}
      />
      <CardContent className={classes.cardContent}>
        {(titleEdit || detailsArray.find(([, detailValue]) => detailValue.value)) && (
          <Box component={smallDevice && !titleEdit ? 'details' : undefined}>
            {smallDevice && !titleEdit ? (
              <Typography component="summary">
                {t('song.Show details', 'Show details')}
              </Typography>
            ) : null}
            <div className={classes.logoSpace} key={-1} />
            {detailsArray.map(([key, detailValue]) => (
              <Detail
                key={key}
                keyname={key}
                detail={detailValue}
                edit={titleEdit}
                handleDetailChange={handleDetailChange}
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default Title;
