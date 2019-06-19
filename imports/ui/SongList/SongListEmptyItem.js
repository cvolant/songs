import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
    Divider,
    Typography,
} from '@material-ui/core';
import { Search, Settings } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    divider: {
        margin: theme.spacing(2, 0),
    },
    inlineIcons: {
        height: '0.8em',
        margin: '0 3px',
        position: 'relative',
        top: '4px',
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
            {Object.values(search).join('') ?
                <span>
                    <Typography className={classes.spacedText}>
                    <Search className={classes.inlineIcons} />
                        Aucun résulat pour cette recherche. Veuillez essayer un autre mot clé ou utiliser la recherche avancée
                    <Settings className={classes.inlineIcons} />
                        .<br/>Si le chant n'existe pas dans la base de données, vous pouvez l'y ajouter si vous êtes connecté à votre compte.
                    </Typography>
                </span>
            :
            <span>
                <Typography className={classes.spacedText}>
                <Search className={classes.inlineIcons} />
                    Recherche par titres, paroles, auteurs, éditeurs, cotes. Utilisez la roue dentée
                <Settings className={classes.inlineIcons} />
                    pour faire une recherche avancée.
                </Typography>
            </span>
            }
        </React.Fragment>
    );
}

export default SongListEmptyItem;