import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
    Divider,
    Typography,
} from '@material-ui/core';
import { Search, Settings } from '@material-ui/icons';
import InlineIcon from '../utils/InlineIcon';

const useStyles = makeStyles(theme => ({
    container: {
        padding: theme.spacing(2),
    },
    divider: {
        margin: theme.spacing(2),
    },
    spacedText: {
        lineHeight: '2',
    }
}));

const SongListEmptyItem = ({ search }) => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Divider className={classes.divider} />
            <div className={classes.container}>
            {search && Object.values(search).join('') ?
                <span>
                    <Typography className={classes.spacedText}>
                    <InlineIcon Icon={Search} />
                        No result for this search: please try another one. You can use less specific keywords. Different criteria can help you in the advanced search options
                        <InlineIcon Icon={Settings} />
                        .<br/>If the song does not exist in the database, you can add it when logged in you account.
                    </Typography>
                </span>
            :
            <span>
                <Typography className={classes.spacedText}>
                    <InlineIcon Icon={Search} />
                    Search by titles, lyrics, authors, editors, classifications. Use the settings button
                    <InlineIcon Icon={Settings} />
                    in the search field to open advanced search settings.
                </Typography>
            </span>
            }
            </div>
        </React.Fragment>
    );
}

export default SongListEmptyItem;