import React from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <React.Fragment>
            <Divider className={classes.divider} />
            <div className={classes.container}>
            {search && Object.values(search).join('') ?
                <span>
                    <Typography className={classes.spacedText}>
                    <InlineIcon Icon={Search} />
                        {t('search.No results try advanced', 'No results, try advanced search')}
                        <InlineIcon Icon={Settings} />
                        .<br/>
                        {t("search.Possible to add", "It is possible to add songs")}
                    </Typography>
                </span>
            :
            <span>
                <Typography className={classes.spacedText}>
                    <InlineIcon Icon={Search} />
                    {t("search.Search possibilities", "Search by keyword or use")}
                    <InlineIcon Icon={Settings} />
                    {t("search.in the searchfield", "in the searchfield.")}
                </Typography>
            </span>
            }
            </div>
        </React.Fragment>
    );
}

export default SongListEmptyItem;