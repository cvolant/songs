import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import EmailPasswordForm from './EmailPasswordForm';
import PageLayout from '../utils/PageLayout';

import {
    Avatar,
    Container,
    Grid,
    Typography
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

const useStyles = makeStyles(theme => ({
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

export const Door = ({ alreadySignedUp, link, title }) => {
    const classes = useStyles();

    return (
        <PageLayout tutorialContentName={alreadySignedUp ? 'SignIn' : 'SignUp'}>
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
}

Door.propTypes = {
    alreadySignedUp: PropTypes.bool.isRequired,
    link: PropTypes.object,
    title: PropTypes.string.isRequired,
};

export default Door;