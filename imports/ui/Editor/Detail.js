import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import {
    Chip,
    FormControlLabel,
    Switch,
    TextField,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    chip: {
        margin: theme.spacing(0.25),
    },
    switch: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
}));

const Detail = ({ detail, edit, keyname, handleDetailChange }) => {

    const { t } = useTranslation();
    const classes = useStyles();
    const detailName = t(`song.${detail.name}`, detail.name);

    if (detail && detail.name) {
        if (edit) {
            if (detail.type === 'bool') {
                return (
                    <FormControlLabel
                        control={
                            <Switch
                                checked={detail.value}
                                className={classes.switch}
                                onClick={handleDetailChange}
                                inputProps={{ keyname, type: detail.type }}
                                value={keyname}
                            />
                        }
                        label={detailName}
                    />
                );
            } else {
                return (
                    <TextField
                        label={detailName}
                        type={detail.type}
                        inputProps={{ keyname, type: detail.type }}
                        multiline
                        className={classes.textField}
                        margin="normal"
                        variant="outlined"
                        value={detail.value}
                        onChange={handleDetailChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                );
            }
        } else {
            if (detail.value) {
                return (
                    <Chip
                        label={detailName + (detail.type != 'bool' && `${t('colon', ':')} ${detail.value}`)}
                        className={classes.chip}
                    />
                );
            } else {
                return null;
            }
        }
    } else {
        return null;
    }
}

Detail.propTypes = {
    detail: PropTypes.object,
    edit: PropTypes.bool.isRequired,
    keyname: PropTypes.string.isRequired,
    handleDetailChange: PropTypes.func.isRequired,
}

export default Detail;