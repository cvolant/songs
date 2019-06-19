import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardActions,
  Divider,
  IconButton,
  InputAdornment,
  InputBase,
} from '@material-ui/core';
import { Settings, Search } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  adornment: {
    position: 'absolute',
    color: theme.palette.grey[400],
  },
  advancedSearchContainer: {
    padding: 0,

    '& button': {
      borderRadius: 0,
    },
  },
  buttons: {
    flexGrow: 1,
    textTransform: 'none',
  },
  buttonGroup: {
    flexWrap: 'wrap',
    width: '100%',
  },
  divider: {
    width: 1,
    height: '85%',
    margin: theme.spacing(0.5),
  },
  iconButton: {
    padding: theme.spacing(1),
  },
  input: {
    flex: 1,
    fontSize: '2rem',
    marginLeft: theme.spacing(1),
    /*     background: 'left / contain no-repeat url("images/genie.jpg")'; */
  },
  inputContainer: {
    alignItems: 'center',
    display: 'flex',
    padding: theme.spacing(1),

    '&:last-child': {
      paddingBottom: theme.spacing(1),
    },
  },
  root: {
    borderRadius: '1.5rem',
    boxShadow: '0px 2px 6px 0px inset rgba(0,0,0,0.2),0px 2px 2px 0px inset rgba(0,0,0,0.14),0px 4px 2px -2px inset rgba(0,0,0,0.12)',
    width: ({ extended }) => `calc(100% - 15rem + ${5 * extended}rem)`,
    transition: 'width 0.3s ease',
  },
}));

export const SearchField = ({ extended }) => {
  const classes = useStyles({ extended });
  const [searchEntry, setSearchEntry] = useState('');
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [delay, setDelay] = useState(undefined);
  const inputRef = React.createRef();

  const giveFocus = () => inputRef.current.lastChild.focus();

  const handleAdvancedButtonClick = e => {
    const target = e.target;
    console.log('From SearchField, handleAdvancedButtonClick. target:', target);
  };

  const handleSearchChange = e => {
    const newEntry = e.target.value;
    setSearchEntry(newEntry);

    clearTimeout(delay);
    setDelay(setTimeout(() => handleSearch(newEntry), 750));
  };

  const handleSearch = (searchEntry) => {
    const specificEntries = searchEntry.match(/\$\w+\[.*?(\]|\$|$)/g) || [];
    console.log('From SearchField. searchEntry:', searchEntry, ', specificEntries:', specificEntries);

    let specificQueries = {};

    if (specificEntries.length > 0) {
      specificEntries.map(specificEntry => {
        const queryFirstChar = specificEntry.indexOf('[') + 1;
        const queryLastChar = specificEntry[specificEntry.length - 1] == ']' ? specificEntry.length - 1 : specificEntry.length;
        const field = specificEntry.substring(1, queryFirstChar - 1);
        const query = new RegExp(specificEntry.substring(queryFirstChar, queryLastChar), 'i');
        specificQueries[field] = query;
      });
      console.log('From SearchField, handleSearch. specificQueries:', specificQueries);
    }

    const globalQuery = searchEntry.replace(/(\$.*?\[.*?(\]|\$|$))|\$\w+(\W|$)/g, '').replace(/(\W\w\W)|\W+/g, ' ').trim();

    if (Object.keys(specificQueries).length === 0) {
      Session.set('search', { globalQuery, specificQueries: '' });
    } else {
      Session.set('search', { globalQuery, specificQueries });
    }
  };

  const handleToggleAdvancedSearch = () => setAdvancedSearch(!advancedSearch);

  return (
    <Card className={classes.root}>
      <CardContent className={classes.inputContainer}>
        <InputBase
          className={classes.input}
          placeholder="      Search…"
          ref={inputRef}
          startAdornment={
            searchEntry ? undefined :
              <InputAdornment
                position="start"
                className={classes.adornment}
                onClick={giveFocus}
              >
                <Search />
              </InputAdornment>
          }
          value={searchEntry}
          onChange={handleSearchChange}
        />
        <Divider className={classes.divider} />
        <IconButton
          color="primary"
          className={classes.iconButton}
          aria-label="Advanced search"
          onClick={handleToggleAdvancedSearch}
        >
          <Settings />
        </IconButton>
      </CardContent>
      {
        advancedSearch ?
          <CardActions className={classes.advancedSearchContainer}>
            <ButtonGroup
            aria-label="Full width outlined button group"
            classes={{root: classes.buttonGroup, grouped: classes.buttons}}
            color="primary"
            variant="contained"
            >
              <Button id="titles" onClick={handleAdvancedButtonClick}>Titles</Button>
              <Button id="lyrics" onClick={handleAdvancedButtonClick}>Lyrics</Button>
              <Button id="authors" onClick={handleAdvancedButtonClick}>Authors</Button>
              <Button id="editor" onClick={handleAdvancedButtonClick}>Editor</Button>
            </ButtonGroup>
          </CardActions>
          :
          undefined
      }
    </Card>
  );
}

SearchField.propTypes = {
  extended: PropTypes.bool.isRequired,
};

export default SearchField;