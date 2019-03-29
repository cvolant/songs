import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

import EmailPasswordForm from './EmailPasswordForm';

import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
});

export const Door = props => {
    const { classes } = props;

    return (
        <main className={classes.main}>
            <CssBaseline />
            <Paper className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>

                <Typography component="h1" variant="h5">
                    {props.title}
                </Typography>

                <EmailPasswordForm
                    handleSubmit={this.onSubmit}
                    alreadySignedUp={props.alreadySignedUp}
                />

                <Typography component="p">
                    {props.linkChild}
                </Typography>
            </Paper>
        </main>
    );
}

Door.propTypes = {
    classes: PropTypes.object.isRequired,
    linkChild: PropTypes.object,
    title: PropTypes.string.isRequired,
    alreadySignedUp: PropTypes.bool.isRequired
};

export default withStyles(styles)(Door);