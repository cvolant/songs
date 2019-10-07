import React, { ChangeEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Cancel from '@material-ui/icons/Cancel';
import Check from '@material-ui/icons/Check';
import Edit from '@material-ui/icons/Edit';

import { CSSProperties } from '@material-ui/styles';

import Detail, { IDetails, IDetailChangeEvent } from './Detail';

const useStyles = makeStyles((theme) => ({
  actionButtonColumn: {
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
    ): string => `${logoMenuDeployed ? 5 : 10}rem`,
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
  rightIcon: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    flexGrow: 1,
    margin: theme.spacing(1),
  },
}));

interface ITitle {
  edit: boolean;
  editGlobal: boolean;
  details: IDetails;
  subtitle: string;
  title: string;
  handleEditTitle: () => void;
  handleTitleChange: ChangeEventHandler<HTMLInputElement>;
  handleSubtitleChange: ChangeEventHandler<HTMLInputElement>;
  handleDetailChange: (e: IDetailChangeEvent) => void;
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

  return (
    <Card elevation={0}>
      <CardHeader
        action={
          editGlobal
            ? (
              <div className={classes.actionButtonColumn}>
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
          : title}
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
          : subtitle}
      />
      <CardContent className={classes.cardContent}>
        {
          [
            <div className={classes.logoSpace} key={-1} />,
            Object.keys(details).map(
              (key) => (
                <Detail
                  key={key}
                  keyname={key}
                  detail={details[key as keyof IDetails]}
                  edit={titleEdit}
                  handleDetailChange={handleDetailChange}
                />
              ),
            ),
          ]
        }
      </CardContent>
    </Card>
  );
};

export default Title;
