import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardActions,
  CardHeader,
  Grid,
  IconButton,
  MenuItem,
  TextField,
} from '@material-ui/core';
import {
  ArrowDownward,
  ArrowUpward,
  Cancel,
  Check,
  Delete,
  Edit,
} from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
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
    }
  },
  nonDisplayed: {
    display: 'none',
  },
  paragraph: {
    flexGrow: 1,
    margin: theme.spacing(1),
    whiteSpace: 'pre-line'
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  selectedCard: {
    background: `radial-gradient(circle,
      rgba(100,80,50,0.1) 0%,
      rgba(100,80,50,0.2) 80%,
      rgba(100,80,50,0.3) 100%
      )`,
  },
  subheader: {},
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
  },
}));

const Paragraph = props => {

  const { t } = useTranslation();
  const classes = useStyles();

  const {
    editGlobal,
    selected,
    paragraph,
    handleEditPg,
    handlePgChange,
    handleLabelChange,
    handlePgCancel,
    handleSelect,
    handleDeletePg,
    handleMoveUp,
    handleMoveDown,
  } = props;
  const edit = props.edit && editGlobal;
  const types = [
    t('pg.paragraph', 'paragraph'),
    t('pg.verse', 'verse'),
    t('pg.chorus', 'chorus'),
    t('pg.main chorus', 'main chorus'),
    t('pg.stanza', 'stanza'),
    t('pg.bridge', 'bridge')
  ];

  return (
    <Grid item xs={12} md={6} xl={4}>
      <Card
        className={`${classes.card} ${selected ? classes.selectedCard : ''} ${edit ? '' : classes.hoverableCard}`}
        onClick={edit ? () => {} : handleSelect}
        raised
      >
        <CardHeader
          action={
            editGlobal ?
              <div className={classes.actionButtonColumn} >
                <IconButton
                  color={edit ? "primary" : "default"}
                  onClick={handleEditPg}
                >
                  {edit ? <Check /> : <Edit />}
                </IconButton>
                {edit ?
                  <IconButton onClick={handlePgCancel}>
                    <Cancel />
                  </IconButton>
                  : undefined}
              </div>
              :
              undefined
          }
          classes={{ action: classes.cardHeaderAction }}
          title={edit ?
            <TextField
              select
              label={t('pg.Type', 'Type')}
              className={classes.textField}
              margin="normal"
              variant="outlined"
              value={t(`pg.${paragraph.label}`)}
              onChange={handleLabelChange}
            >
              {types.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            :
            t(`pg.${paragraph.label}`) === t('pg.paragraph', 'paragraph') ? undefined : t(`pg.${paragraph.label}`, paragraph.label)
          }
          titleTypographyProps={edit ?
            {
              variant: 'body1',
              color: 'textSecondary'
            }
            :
            {
              variant: 'overline',
              color: 'textSecondary'
            }
          }
          subheader={edit ?
            <TextField
              label={t('pg.Content', 'Content')}
              multiline
              className={classes.textField}
              margin="normal"
              variant="outlined"
              value={paragraph.pg.replace(/<br\/>/g, '')}
              onChange={handlePgChange}
              autoFocus={true}
            />
            :
            paragraph.pg.replace(/<br\/>/g, '')
          }
          subheaderTypographyProps={edit ? {} :
            {
              color: 'textPrimary',
              className: classes.subheader,
            }
          }
        />
        <CardActions className={`${classes.actions} ${edit ? '' : classes.nonDisplayed}`}>
          <div>
            <IconButton color='primary' onClick={handleMoveUp}>
              <ArrowUpward />
            </IconButton>
            <IconButton color='primary' onClick={handleMoveDown}>
              <ArrowDownward />
            </IconButton>
          </div>
          <IconButton className={classes.delete} onClick={handleDeletePg}>
            <Delete />
          </IconButton>
        </CardActions>
      </Card>
    </Grid>
  );
}

Paragraph.propTypes = {
  paragraph: PropTypes.object.isRequired,
  edit: PropTypes.bool.isRequired,
  editGlobal: PropTypes.bool.isRequired,
  selected: PropTypes.bool.isRequired,
  handleEditPg: PropTypes.func.isRequired,
  handlePgChange: PropTypes.func.isRequired,
  handleLabelChange: PropTypes.func.isRequired,
  handlePgCancel: PropTypes.func.isRequired,
  handleSelect: PropTypes.func.isRequired,
  handleDeletePg: PropTypes.func.isRequired,
  handleMoveUp: PropTypes.func.isRequired,
  handleMoveDown: PropTypes.func.isRequired,
}

export default Paragraph;