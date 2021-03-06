import React, { ChangeEventHandler, MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Cancel from '@material-ui/icons/Cancel';
import Check from '@material-ui/icons/Check';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';

import { IParagraph } from '../../types';

const useStyles = makeStyles((theme) => ({
  actionButtonColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  actions: {
    justifyContent: 'space-between',
  },
  card: {
    height: '100%',
    margin: theme.spacing(1),
    width: '100%',
  },
  cardHeaderAction: {
    order: -1,
    marginRight: 0,
    marginLeft: theme.spacing(-1),
  },
  hoverableCard: {
    '&:hover': {
      backgroundColor: '#ddd',
      transition: theme.transitions.create('background-color'),
    },
  },
  nonDisplayed: {
    display: 'none',
  },
  selectedCard: {
    background: `radial-gradient(circle,
      rgba(100,80,50,0.1) 0%,
      rgba(100,80,50,0.2) 80%,
      rgba(100,80,50,0.3) 100%
      )`,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
  },
}));

interface IParagraphProps {
  edit: boolean;
  editGlobal: boolean;
  selected: boolean;
  paragraph: IParagraph;
  handleDeletePg: () => void;
  handleEditPg: () => void;
  handleLabelChange: ChangeEventHandler<HTMLInputElement>;
  handleMoveUp: () => void;
  handleMoveDown: () => void;
  handlePgCancel: () => void;
  handlePgChange: ChangeEventHandler<HTMLInputElement>;
  handleSelect: MouseEventHandler<HTMLDivElement>;
}

const Paragraph: React.FC<IParagraphProps> = ({
  edit: propsEdit,
  editGlobal,
  selected,
  paragraph: {
    label,
    pg,
  },
  handleEditPg,
  handlePgChange,
  handleLabelChange,
  handlePgCancel,
  handleSelect,
  handleDeletePg,
  handleMoveUp,
  handleMoveDown,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const edit = propsEdit && editGlobal;
  const types = [
    'paragraph',
    'verse',
    'chorus',
    'main chorus',
    'stanza',
    'bridge',
  ];

  const pgText = pg.replace(/(<br\/>\n)/g, '\n');

  return (
    <Card
      className={`${classes.card} ${selected ? classes.selectedCard : ''} ${editGlobal ? '' : classes.hoverableCard}`}
      onClick={editGlobal ? undefined : handleSelect}
      elevation={selected ? 4 : 0}
      raised={selected}
    >
      <CardHeader
        action={
          editGlobal
            ? (
              <div className={classes.actionButtonColumn}>
                <IconButton
                  color={edit ? 'primary' : 'default'}
                  onClick={handleEditPg}
                >
                  {edit ? <Check /> : <Edit />}
                </IconButton>
                {edit
                  ? (
                    <IconButton onClick={handlePgCancel}>
                      <Cancel />
                    </IconButton>
                  )
                  : undefined}
              </div>
            )
            : undefined
        }
        classes={{ action: classes.cardHeaderAction }}
        // eslint-disable-next-line no-nested-ternary
        title={edit
          ? (
            <TextField
              select
              label={t('lyrics.Type', 'Type')}
              className={classes.textField}
              margin="normal"
              variant="outlined"
              value={label}
              onChange={handleLabelChange}
            >
              {types.map((option) => (
                <MenuItem key={option} value={option}>
                  {t(`lyrics.${option}`)}
                </MenuItem>
              ))}
            </TextField>
          )
          : t(`lyrics.${label}`) === t('lyrics.paragraph', 'paragraph') ? undefined : t(`lyrics.${label}`, label)}
        titleTypographyProps={edit
          ? {
            variant: 'body1',
            color: 'textSecondary',
          }
          : {
            variant: 'overline',
            color: 'textSecondary',
          }}
        subheader={edit
          ? (
            <TextField
              label={t('lyrics.Content', 'Content')}
              multiline
              className={classes.textField}
              margin="normal"
              variant="outlined"
              value={pgText}
              onChange={handlePgChange}
              autoFocus
            />
          )
          // eslint-disable-next-line react/no-array-index-key
          : <>{pgText.split(/(\n)/g).map((element: string, mapIndex) => (element === '\n' ? <br key={mapIndex} /> : element))}</>}
        subheaderTypographyProps={edit ? {}
          : { color: 'textPrimary' }}
      />
      <CardActions className={`${classes.actions} ${edit ? '' : classes.nonDisplayed}`}>
        <div>
          <IconButton color="primary" onClick={handleMoveUp}>
            <ArrowUpward />
          </IconButton>
          <IconButton color="primary" onClick={handleMoveDown}>
            <ArrowDownward />
          </IconButton>
        </div>
        <IconButton onClick={handleDeletePg}>
          <Delete />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default Paragraph;
