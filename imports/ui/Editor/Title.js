import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  TextField,
} from '@material-ui/core';
import { Cancel, Check, Edit } from '@material-ui/icons';

import Detail from './Detail';

const useStyles = makeStyles(theme => ({
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
    paddingRight: ({ logoMenuDeployed }) => `${5 + logoMenuDeployed * 5}rem`,
  },
  cardHeaderAction: {
    order: -1,
    marginRight: 0,
    marginLeft: theme.spacing(-1),
  },
  logoSpace: {
    height: '1px',
    width: ({ logoMenuDeployed }) => `${logoMenuDeployed * 7}rem`,
    float: 'right',
  },
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

const Title = props => {
  const {
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
  } = props;
  const edit = props.edit && editGlobal;

  const { t } = useTranslation();
  const classes = useStyles({ logoMenuDeployed });

  return (
    <Card className={classes.card} elevation={0}>
      <CardHeader
        action={
          editGlobal ?
            <div className={classes.actionButtonColumn} >
              <IconButton
                color={edit ? "primary" : "default"}
                onClick={handleEditTitle}
              >
                {edit ? <Check /> : <Edit />}
              </IconButton>
              {edit ?
                <IconButton onClick={handleTitleCancel}>
                  <Cancel />
                </IconButton>
                : undefined}
            </div>
            :
            undefined
        }
        classes={{ root: classes.cardHeader, action: classes.cardHeaderAction }}
        title={edit ?
          <TextField
            label={t("song.title", 'Title')}
            multiline
            rowsMax="2"
            className={classes.textField}
            margin="normal"
            variant="outlined"
            value={props.title}
            onChange={handleTitleChange}
            autoFocus={true}
          />
          :
          title
        }
        subheader={edit ?
          <TextField
            label={t("song.subtitle", 'Subtitle')}
            multiline
            rowsMax="2"
            className={classes.textField}
            margin="normal"
            variant="outlined"
            value={props.subtitle}
            onChange={handleSubtitleChange}
            autoFocus={true}
          />
          :
          subtitle
        }
      />
      <CardContent className={classes.cardContent}>
        {
          [
            <div className={classes.logoSpace} key={-1} />,
            Object.keys(details).map(
            key => (
              <Detail
                key={key}
                keyname={key}
                detail={details[key]}
                edit={edit}
                handleDetailChange={handleDetailChange}
              />
            )
          )
        ]
        }
      </CardContent>
    </Card>
  );
}

Title.propTypes = {
  edit: PropTypes.bool.isRequired,
  editGlobal: PropTypes.bool.isRequired,
  details: PropTypes.object.isRequired,
  subtitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  handleEditTitle: PropTypes.func.isRequired,
  handleTitleChange: PropTypes.func.isRequired,
  handleSubtitleChange: PropTypes.func.isRequired,
  handleDetailChange: PropTypes.func.isRequired,
  handleTitleCancel: PropTypes.func.isRequired,
  logoMenuDeployed: PropTypes.bool,
}

export default Title;