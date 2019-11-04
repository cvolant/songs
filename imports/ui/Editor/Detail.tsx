import React, { MouseEventHandler, ChangeEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';

import { DeepPartial } from '../../types/advancedTypes';

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

interface IStringDetail {
  name: string;
  type: 'string';
  value: string;
  min?: number;
  max?: number;
}
interface INumberDetail {
  name: string;
  type: 'number';
  value: number;
  min?: number;
  max?: number;
}
interface IBoolDetail {
  name: string;
  type: 'bool';
  value: boolean;
  min?: number;
  max?: number;
}

export interface IDetails {
  author: IStringDetail;
  compositor: IStringDetail;
  editor: IStringDetail;
  classification: IStringDetail;
  newClassification: IStringDetail;
  number: INumberDetail;
  year: INumberDetail;
  cnpl: IBoolDetail;
}

export type IDetail = IStringDetail | INumberDetail | IBoolDetail;

export interface IDetailTarget {
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
}

interface IDetailProps {
  detail: IDetail;
  edit: boolean;
  keyname: string;
  handleDetailChange: (target: IDetailTarget) => void;
}

export const createDetails = (detailsToCreate: DeepPartial<IDetails>): IDetails => ({
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

const Detail: React.FC<IDetailProps> = ({
  detail, edit, keyname, handleDetailChange,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const detailName = t(`song.${detail.name}`, detail.name);

  const handleDetailClick: MouseEventHandler<
  HTMLButtonElement
  > = (e) => handleDetailChange(e.target as unknown as IDetailTarget);
  const handleDetailKeystroke: ChangeEventHandler<
  HTMLInputElement | HTMLTextAreaElement
  > = (e) => handleDetailChange(e.currentTarget as unknown as IDetailTarget);

  if (detail && detail.name) {
    if (edit) {
      if (detail.type === 'bool') {
        return (
          <FormControlLabel
            control={(
              <Switch
                checked={detail.value}
                className={classes.switch}
                onClick={handleDetailClick}
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
          onChange={handleDetailKeystroke}
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

export default Detail;
