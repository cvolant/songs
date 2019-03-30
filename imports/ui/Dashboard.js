import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';

import NoteList from './NoteList';
import Editor from "./Editor.js";
import ButtonAppBar from "./ButtonAppBar.js";

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});

export const Dashboard = props => {
  const { classes } = props;
  return (
    <div>
      <ButtonAppBar title="Notes" />
      <div className="page-content">
        <Paper className={'page-content__sidebar ' + classes.root} elevation={1}>
          <NoteList />
        </Paper>
        <Paper className={'page-content__main ' + classes.root} elevation={1}>
          <Editor />
        </Paper>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);