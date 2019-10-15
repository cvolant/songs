import React, { useState, ChangeEvent } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import FilledInput from '@material-ui/core/FilledInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import Translate from '@material-ui/icons/Translate';
import routesPaths from '../../app/routesPaths';

const useStyles = makeStyles((theme) => ({
  adornment: {
    marginTop: '0 !important',
  },
  formControl: {
    color: 'inherit',
    display: 'flex',
    flexWrap: 'wrap',
    padding: '0 !important',
    minWidth: 120,
  },
  input: {
    cursor: 'pointer',
    background: 'transparent',
  },
  resetColors: {
    color: 'inherit',
  },
  select: {
    padding: 0,
    margin: theme.spacing(0.5, 2, 0.5, 0),
    lineHeight: 1.5,

    '&:focus': {
      background: 'transparent',
    },
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

interface ILanguagePickerProps {
  listClasses: {
    listItem: string;
    listItemText?: string;
  };
}

export const LanguagePicker: React.FC<
ILanguagePickerProps
> = React.forwardRef<HTMLFormElement, ILanguagePickerProps>(({
  listClasses,
}, ref) => {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [openable, setOpenable] = useState(true);
  const [language, setLanguage] = useState(location.pathname.substr(1, 2));

  console.log('From LanguagePicker, render. location.pathname.substr(1, 2):', location.pathname.substring(1, 2), 'language:', language, 'history:', history);

  const handleChange = (event: ChangeEvent<{
    name?: string | undefined;
    value: unknown;
  }>): void => {
    const lng = event.currentTarget.value as string;
    const formerPath = location.pathname;
    setLanguage(lng);
    console.log('From LanguagePicker, handleChange. REDIRECTION. Changing language to', lng);
    history.replace(routesPaths.translatePath(formerPath, lng));
  };

  const handleClose = (): void => setOpen(false);

  const handleOpen = (): void => setOpen(true);

  const handleFormControlClick = (): void => {
    /*  Used with openable to avoid reopening the menu immediately after closing it:
    <Click> on formControl              { open = false, openable = true  }
    => fires handleFormControlClick     { open = false, openable = true  }
        => fires handleOpen             { open = false, openable = true  }
            => set open to true         { open = true,  openable = true  }
        => set openable to false        { open = true,  openable = false }
    <Click> anywhere                    { open = true,  openable = false }
    => fires handleClose                { open = true,  openable = false }
        => set open to false            { open = false, openable = false }
    => fires handleFormControlClick     { open = false, openable = false }
        => does NOT fires handleOpen    { open = false, openable = false }
        => set openable to true         { open = false, openable = true  }
    */

    if (openable) handleOpen();
    setOpenable(!openable);
  };

  return (
    // The 'languagePicker' class is for detecting a click on the languagePicker
    // to prevent menu from closing. See in TopMenuContent, handleClick.
    <FormControl
      className={clsx('languagePicker', listClasses.listItem, classes.formControl)}
      onClick={handleFormControlClick}
      variant="filled"
      ref={ref}
      component="form"
    >
      <Select
        onChange={handleChange}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        value={language}
        classes={{
          select: clsx('languagePicker', listClasses.listItemText, classes.select),
          icon: classes.resetColors,
        }}
        input={(
          <FilledInput
            className={clsx('languagePicker', listClasses.listItem, classes.input, classes.resetColors)}
            disableUnderline
            name="language"
            startAdornment={(
              <InputAdornment className={clsx('languagePicker', classes.adornment)} position="start">
                <Translate className="languagePicker" />
              </InputAdornment>
            )}
          />
        )}
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="fr">Français</MenuItem>
      </Select>
    </FormControl>
  );
});

export default LanguagePicker;
