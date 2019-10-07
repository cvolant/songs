import React from 'react';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import EmailPasswordForm from './EmailPasswordForm';
import PageLayout from '../utils/PageLayout';

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  links: {
    justifyContent: 'center',
    fontSize: '1.6rem',
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

interface IDoorProps {
  alreadySignedUp: boolean;
  link?: {
    path: string;
    text: string;
  };
  title: string;
}

export const Door: React.FC<IDoorProps> = ({
  alreadySignedUp,
  link,
  title,
}) => {
  const classes = useStyles();

  return (
    <PageLayout title={title} tutorialContentName={alreadySignedUp ? 'SignIn' : 'SignUp'}>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            {title}
          </Typography>

          <EmailPasswordForm
            alreadySignedUp={alreadySignedUp}
            title={title}
          />

          <Grid container className={classes.links}>
            {/* <Grid item xs>
                        <Link href="#" variant="body2">
                            Forgot password?
                        </Link>
                    </Grid> */}
            <Grid item>
              {link ? <Link to={link.path}>{link.text}</Link> : null}
            </Grid>
          </Grid>
        </div>
      </Container>
    </PageLayout>
  );
};

export default Door;
