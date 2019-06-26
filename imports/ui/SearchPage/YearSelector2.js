import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';

const suggestions = new Array(new Date().getFullYear() - 1899)
    .fill(0)
    .map((value, key) => ({
      label: key + 1900 + ''
    }))
    .reverse();

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;

  console.log('From YearSelector2, renderInput. other.value:', other.value, 'other:', other);

  return (
    <TextField
      variant="outlined"
      type="number"
      className={classes.textField}
      InputProps={{
        startAdornment:
          <InputAdornment disableTypography position="start">
            <Typography className={classes.adornmentText}>
              Before
            </Typography>
          </InputAdornment>,
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput,
          notchedOutline: classes.inputOutline,
        },
        ...InputProps,
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestionProps) {
  const { suggestion, index, itemProps, highlightedIndex, selectedItem } = suggestionProps;
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.label}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      {suggestion.label}
    </MenuItem>
  );
}
renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  selectedItem: PropTypes.string,
  suggestion: PropTypes.shape({ label: PropTypes.string }).isRequired,
};

function getSuggestions(value, { showEmpty = false } = {}) {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0 && !showEmpty
    ? []
    : suggestions.filter(suggestion => {
        const keep =
          count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

const useStyles = makeStyles(theme => ({
  adornmentText: {
    color: 'white',
    fontSize: '1.4rem',
    fontWeight: 500,
    lineHeight: 1.75,
  },
  root: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    zIndex: 2,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  chip: {
    margin: theme.spacing(0.5, 0.25),
  },
  inputOutline: {
    border: 0,
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
  inputInput: {
    color: 'white',
    fontStyle: 'italic',
    width: 0,
    flexGrow: 1,
    padding: 0,
  },
  divider: {
    height: theme.spacing(2),
  },
  listBox: {
    position: 'fixed',
    zIndex: 2,
  },
  textField: {
    verticalAlign: 'middle',
  },
}));

export default function IntegrationDownshift({ className }) {
  const [inputEntry, setInputEntry] = useState('');
  const classes = useStyles();

  return (
    <div className={className}>
      <Downshift id="downshift-options">
        {({
          clearSelection,
          closeMenu,
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          highlightedIndex,
          inputValue,
          isOpen,
          openMenu,
          selectedItem,
        }) => {
          const { onBlur, onChange, onFocus, ...inputProps } = getInputProps({
            onBlur: closeMenu,
            onChange: event => {
              const newValue = event.target.value;
              setInputEntry(newValue.replace(/[^0-9]/g, ''));
              console.log('From YearSelector2, DownShift, onChange. newValue:', newValue, 'filtered value:', newValue.replace(/[^0-9]/g, ''));
              if (newValue === '') {
                clearSelection();
              }
            },
            onFocus: openMenu,
          });

          return (
            <div className={classes.container}>
              {renderInput({
                fullWidth: true,
                classes,
                InputLabelProps: getLabelProps({ shrink: true }),
                InputProps: { onBlur, onChange, onFocus },
                inputProps,
                value: inputEntry,
              })}

              <div className={classes.listBox} {...getMenuProps()}>
                {isOpen ? (
                  <Paper className={classes.paper} square>
                    {getSuggestions(inputValue, { showEmpty: true }).map((suggestion, index) =>
                      renderSuggestion({
                        suggestion,
                        index,
                        itemProps: getItemProps({ item: suggestion.label }),
                        highlightedIndex,
                        selectedItem,
                      }),
                    )}
                  </Paper>
                ) : null}
              </div>
            </div>
          );
        }}
      </Downshift>
    </div>
  );
}