import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import { DeepPartial } from '../utils/TypesDefs';

const useStyles = makeStyles((theme) => ({
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

interface StringDetailT {
  name: string;
  type: 'string';
  value: string;
  min?: number;
  max?: number;
}
interface NumberDetailT {
  name: string;
  type: 'number';
  value: number;
  min?: number;
  max?: number;
}
interface BoolDetailT {
  name: string;
  type: 'bool';
  value: boolean;
  min?: number;
  max?: number;
}

export interface DetailsT {
  author: StringDetailT;
  compositor: StringDetailT;
  editor: StringDetailT;
  classification: StringDetailT;
  newClassification: StringDetailT;
  number: NumberDetailT;
  year: NumberDetailT;
  cnpl: BoolDetailT;
}

export type DetailT = StringDetailT | NumberDetailT | BoolDetailT;

export interface DetailChangeEventT {
  target: {
    attributes: {
      name: {
        value: string;
      };
      type: {
        value: 'string' | 'number' | 'bool';
      };
    };
    checked?: boolean;
    value?: string;
  };
}

interface DetailPropsT {
  detail: DetailT;
  edit: boolean;
  keyname: string;
  handleDetailChange: (event: any) => void;
}

export const createDetails = (detailsToCreate: DeepPartial<DetailsT>): DetailsT => ({
  author: {
    name: 'Author',
    type: 'string',
    value: '',
    max: 50,
    ...detailsToCreate.author,
  },
  compositor: {
    name: 'Compositor',
    type: 'string',
    value: '',
    max: 50,
    ...detailsToCreate.compositor,
  },
  editor: {
    name: 'Editor',
    type: 'string',
    value: '',
    max: 50,
    ...detailsToCreate.editor,
  },
  classification: {
    name: 'Classification',
    type: 'string',
    value: '',
    min: 0,
    ...detailsToCreate.classification,
  },
  newClassification: {
    name: 'New classification',
    type: 'string',
    value: '',
    min: 0,
    ...detailsToCreate.newClassification,
  },
  number: {
    name: 'Number',
    type: 'number',
    value: 0,
    min: 0,
    ...detailsToCreate.number,
  },
  year: {
    name: 'Year',
    type: 'number',
    value: 0,
    min: 0,
    max: new Date().getFullYear(),
    ...detailsToCreate.year,
  },
  cnpl: {
    name: 'CNPL',
    type: 'bool',
    value: false,
    ...detailsToCreate.cnpl,
  },
});

const Detail = ({
  detail,
  edit,
  keyname,
  handleDetailChange,
}: DetailPropsT): JSX.Element | null => {
  const { t } = useTranslation();
  const classes = useStyles();
  const detailName = t(`song.${detail.name}`, detail.name);

  if (detail && detail.name) {
    if (edit) {
      if (detail.type === 'bool') {
        return (
          <FormControlLabel
            control={(
              <Switch
                checked={detail.value}
                className={classes.switch}
                onClick={handleDetailChange}
                inputProps={{ name: keyname, type: detail.type }}
                value={keyname}
              />
            )}
            label={detailName}
          />
        );
      }
      return (
        <TextField
          label={detailName}
          type={detail.type}
          inputProps={{ name: keyname, type: detail.type }}
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
    if (detail.value) {
      return (
        <Chip
          label={detailName + (detail.type !== 'bool' && `${t('colon', ':')} ${detail.value}`)}
          className={classes.chip}
        />
      );
    }
    return null;
  }
  return null;
};

Detail.propTypes = {
  detail: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
  }).isRequired,
  edit: PropTypes.bool.isRequired,
  keyname: PropTypes.string.isRequired,
  handleDetailChange: PropTypes.func.isRequired,
};

export default Detail;
