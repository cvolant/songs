import React, { useState } from "react";
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';

import LogoMenu from './LogoMenu';
import SongList from './SongList';
import Editor from "./Editor";
import ButtonAppBar from "./formerComponents/ButtonAppBar.js";

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
});

export const Dashboard = props => {
  const { classes } = props;
  const [ viewer, setViewer ] = useState(null);

  return (
    <div>
      <div className="page-content">
        <Card className={(props.searchFocus ? 'page-content__sidebar page-content__sidebar--extended ' : 'page-content__sidebar ') + classes.root} elevation={1}>
          <SongList />
        </Card>
        <Card className={'page-content__main ' + classes.root} elevation={1}>
          <Editor viewer={toSendToViewer => setViewer(toSendToViewer)} />
        </Card>
      </div>
      <LogoMenu className={classes.logoMenu} />
      {viewer}
    </div>
  );
};

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  searchFocus: PropTypes.bool
};

export default withTracker(props => {
  return {
    searchFocus: Session.get('searchFocus')
  };
})(withStyles(styles)(Dashboard));