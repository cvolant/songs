import React, { createRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Accounts } from "meteor/accounts-base";
import { withTracker } from 'meteor/react-meteor-data';
import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';


const useStyles = makeStyles(theme => ({
    form: {
        marginTop: theme.spacing(1),
        width: '100%', // Fix IE 11 issue.
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));


export const EmailPasswordForm = ({ alreadySignedUp, handleCreateUser, handleLogin, title }) => {
    const classes = useStyles();
    const [error, setError] = useState('');
    const emailRef = createRef();
    const passwordRef = createRef();

    const onSubmit = e => {
        e.preventDefault();
        let email = emailRef.current.value.trim();
        let password = passwordRef.current.value.trim();
        if (alreadySignedUp) {
            handleLogin({ email }, password, (err) => {
                if (err) {
                    setError(err.reason);
                }
                else {
                    setError('');
                }
            });
        } else {
            if (password.length < 6)
                return setError("Password must be at least 6 characters long");

            handleCreateUser({ email, password }, err => {
                if (err) {
                    setError(err.reason);
                } else {
                    setError("");
                }
            });
        }
    };

    return (
        <div>
            {(error) ? (<Typography component="p">{error}</Typography>) : undefined}

            <form className={classes.form} onSubmit={onSubmit} noValidate>
                <TextField
                    autoComplete="email"
                    autoFocus
                    fullWidth
                    id="email"
                    inputRef={emailRef}
                    label="Email Address"
                    name="email"
                    margin="normal"
                    required
                    variant="outlined"
                />
                <TextField
                    autoComplete="current-password"
                    fullWidth
                    id="password"
                    inputRef={passwordRef}
                    label="Password"
                    name="password"
                    margin="normal"
                    type="password"
                    required
                    variant="outlined"
                    />
                <Button
                    className={classes.submit}
                    color="primary"
                    fullWidth
                    size='large'
                    type="submit"
                    variant="contained"
                >
                    {title}
                </Button>
            </form>
        </div>
    );
};

EmailPasswordForm.propTypes = {
    alreadySignedUp: PropTypes.bool.isRequired,
    handleLogin: PropTypes.func.isRequired,
    handleCreateUser: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
};

export default withTracker(props => ({
    handleLogin: Meteor.loginWithPassword,
    handleCreateUser: Accounts.createUser
}))(EmailPasswordForm);