import { Meteor } from 'meteor/meteor';
import React, { createRef, useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Accounts } from 'meteor/accounts-base';
import { useTracker } from 'meteor/react-meteor-data';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: theme.spacing(1),
    width: '100%', // Fix IE 11 issue.
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface IEmailPasswordFormProps {
  alreadySignedUp: boolean;
  title: string;
}

export const EmailPasswordForm: React.FC<IEmailPasswordFormProps> = ({
  alreadySignedUp,
  title,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [error, setError] = useState<string | undefined>('');
  const emailRef = createRef();
  const passwordRef = createRef();

  const { handleLogin, handleCreateUser } = useTracker(() => ({
    handleLogin: Meteor.loginWithPassword,
    handleCreateUser: Accounts.createUser,
  }), []);

  const passwordLengthMin = 6;

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const emailInput = emailRef.current as { value: string };
    const passwordInput = passwordRef.current as { value: string };
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    if (alreadySignedUp) {
      handleLogin({ email }, password, (err?: Meteor.Error | Error) => {
        if (err) {
          setError((err as Meteor.Error).reason || err.stack || (err as Meteor.Error).error.toString() || 'Error');
        } else {
          setError('');
        }
      });
    } else {
      if (password.length < passwordLengthMin) {
        setError(t('register.Too short', 'Password too short', { passwordLengthMin }));
      }

      handleCreateUser({ email, password }, (err) => {
        if (err) {
          setError((err as Meteor.Error).reason || err.stack || (err as Meteor.Error).error.toString() || 'Error');
        } else {
          setError('');
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
          label={t('register.Email Address', 'Email Address')}
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
          label={t('register.Password', 'Password')}
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
          size="large"
          type="submit"
          variant="contained"
        >
          {title}
        </Button>
      </form>
    </div>
  );
};

export default EmailPasswordForm;
