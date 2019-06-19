import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Detail from './Detail';

import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  MenuItem,
  TextField,
} from '@material-ui/core';
import {
  Cancel,
  Edit,
} from '@material-ui/icons';

const styles = theme => ({
  actionButtonColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    paddingTop: 0,
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
});
const Title = (props) => {
  const {
    classes,
    editGlobal,
    details,
    subtitle,
    title,
    handleTitleChange,
    handleSubtitleChange,
    handleDetailChange,
    handleTitleCancel,
    handleEditTitle,
  } = props;
  const edit = props.edit && editGlobal;

  return (
    <Card className={classes.card}>
      <CardHeader
        action={
          editGlobal ?
            <div className={classes.actionButtonColumn} >
              <IconButton
                color={edit ? "primary" : "default"}
                onClick={handleEditTitle}
              >
                <Edit />
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
        title={edit ?
          <TextField
            label="Title"
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
            label="Subtitle"
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
          subtitle ? subtitle : undefined
        }
      />
      <CardContent className={classes.cardContent}>
        {
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
}

export default withStyles(styles)(Title);