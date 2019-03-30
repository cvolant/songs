import React from 'react';
import PropTypes from 'prop-types';
import { Accounts } from "meteor/accounts-base";
import { withTracker } from 'meteor/react-meteor-data';
import withStyles from '@material-ui/core/styles/withStyles';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';


const styles = theme => ({
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
});


export class EmailPasswordForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: ""
        };
    };
    onSubmit(e) {
        e.preventDefault();
        let email = this.email.value.trim();
        let password = this.password.value.trim();
        if (this.props.alreadySignedUp) {
            this.props.handleLogin({ email }, password, (err) => {
                if (err) {
                    this.setState({ error: err.reason });
                }
                else {
                    this.setState({ error: '' });
                }
            });
        } else {
            if (password.length < 6)
              return this.setState({
                error: "Password must be at least 6 characters long"
              });
            this.props.handleCreateUser({ email, password }, err => {
              if (err) {
                this.setState({ error: err.reason });
              } else {
                this.setState({ error: "" });
              }
            });
        }
    }
    render() {
        const { classes } = this.props;

        return (
            <div>
                {(this.state.error) ? (<Typography component="p">{this.state.error}</Typography>) : undefined}

                <form className={'formulaire ' + classes.form} onSubmit={this.onSubmit.bind(this)} noValidate>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="email">Email Address</InputLabel>
                        <Input inputRef={x => this.email = x} ref='email' name="email" autoComplete="email" autoFocus />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <Input inputRef={x => this.password = x} name="password" type="password" autoComplete="current-password" />
                    </FormControl>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign in
                    </Button>
                </form>
            </div>
        );
    }
}

EmailPasswordForm.propTypes = {
    alreadySignedUp: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
    handleLogin: PropTypes.func.isRequired,
    handleCreateUser: PropTypes.func.isRequired
};

export default withTracker(props => {
    return {
        handleLogin: Meteor.loginWithPassword,
        handleCreateUser: Accounts.createUser
    };
})(withStyles(styles)(EmailPasswordForm));