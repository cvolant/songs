import React, { createRef, useEffect, useState } from 'react';
import { withRouter } from "react-router";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  InputBase,
} from '@material-ui/core';
import { Settings, SettingsOutlined, Search } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  adornment: {
    position: 'absolute',
    color: theme.palette.font.subtle,
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
    borderTop: '1px solid',
    borderTopColor: theme.palette.primary.dark,
  },
  buttonGroup: {
    flexWrap: 'wrap',
    width: '100%',
  },
  circularProgress: {
    width: '4rem',
    height: '4rem',
    padding: theme.spacing(1),
  },
  divider: {
    width: 1,
    height: '3rem',
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
    flexShrink: 0,
    margin: theme.spacing(1),
    transition: theme.transitions.create('width'),
    width: ({ logoMenuDeployed }) => `calc(100% - 15rem + ${5 * !logoMenuDeployed}rem)`,
  },
}));

export const SearchField = ({
    handleFocus,
    handleNewSearch,
    handleToggleDisplaySort,
    history,
    loading,
    location,
    logoMenuDeployed
  }) => {
  const fields = {
    titles: {
      name: 'titles',
      placeholder: ' ??? ',
    },
    authors: {
      name: 'authors',
      placeholder: ' ??? ',
    },
    editor: {
      name: 'editor',
      placeholder: ' ??? ',
    },
    classifications: {
      name: 'classifications',
      placeholder: ' ??? ',
    },
    lyrics: {
      name: 'lyrics',
      placeholder: ' ??? ',
    },
    before: {
      name: 'before',
      placeholder: ' year ',
    },
    after: {
      name: 'after',
      placeholder: ' year ',
    },
  };
  const inputRef = createRef();

  const classes = useStyles({ logoMenuDeployed });
  const [searchEntry, setSearchEntry] = useState('');
  const [selectionRange, setSelectionRange] = useState(undefined);
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [delay, setDelay] = useState(undefined);

  useEffect(() => {
    const formerSearch = location.search || Session.get('search');
    if (formerSearch) {
      console.log('From SearchField, useEffect[]. search on mount. location.search:', location.search);
      const query = location.search.substring(1).replace('global=', '').split('&').map(q => {
        const egal = q.indexOf('=');
        return egal == -1 ? decodeURI(q) : `$${q.substring(0, egal)}[${decodeURI(q.substring(egal + 1))}]`;
      }).join(' ');
      setSearchEntry(query);
      handleSearch(query);
    }
  }, []);
  useEffect(() => {
    if (selectionRange) {
      const input = inputRef.current.lastChild;
      if (selectionRange.selectionStart != input.selectionStart || selectionRange.selectionEnd != input.selectionEnd) {
        input.setSelectionRange(selectionRange.selectionStart, selectionRange.selectionEnd);
        input.focus();
      }
    }
  }, [searchEntry]);


  const inputFocus = focus => () => {
    if (focus || typeof focus == 'undefined') inputRef.current.lastChild.focus();
    else inputRef.current.lastChild.blur();
  };

  const handleAdvancedButtonClick = e => {
    const target = e.target;
    const fieldName = target.value || target.parentNode.value;
    const field = fields[fieldName];
    if (field && field.name && field.placeholder) {
      let { selectionEnd, selectionStart, value } = inputRef.current.lastChild;
      if (selectionStart == selectionEnd && selectionStart != 0 && selectionEnd != value.length) {
        console.log('From SearchField, handleAdvancedButtonClick. value:', value, 'value.substring(selectionStart - 1, selectionEnd + 1):', value.substring(selectionStart - 1, selectionEnd + 1));
        if (!value.substring(selectionStart - 1, selectionEnd + 1).match(/.\W|[^$\w]./g)) {
          selectionStart = value.length;
          selectionEnd = value.length;
        }
      }
      const stringParts = [];
      stringParts.push(value.substring(0, selectionStart).trim());
      if (selectionStart == selectionEnd) {
        stringParts.push(`$${field.name}[${field.placeholder}]`)
      } else {
        stringParts.push(`$${field.name}[${value.substring(selectionStart, selectionEnd).trim()}]`)
      }
      stringParts.push(value.substring(selectionEnd).trim());
      selectionStart = stringParts[0].length + fieldName.length + 3;
      selectionEnd = (stringParts[0] + stringParts[1]).length;
      setSelectionRange({ selectionStart, selectionEnd });
      const newSearchString = stringParts.join(' ');
      setSearchEntry(newSearchString);
      inputFocus(true)();
      handleSearch(newSearchString);
      console.log('From SearchField, handleAdvancedButtonClick.\nfield:', field, 'value:', value, 'stringParts:', stringParts);
    } else {
      console.error('From SearchField, handleAdvancedButtonClick. field:', field, '\nThe value of each advanced search button should match a proper field object.');
    }
  };

  const handleKeyDown = e => {
    if (e && e.key == 'Enter') inputFocus(false)();
  };

  const handleSearchChange = e => {
    const newEntry = e.target.value;
    setSearchEntry(newEntry);
    if (selectionRange) setSelectionRange(undefined);

    clearTimeout(delay);
    setDelay(setTimeout(() => handleSearch(newEntry), 750));
  };

  const handleSearch = (searchEntry) => {
    const newUrlSearchElements = [];

    const globalQuery = searchEntry.replace(/(\$.*?\[.*?(\]|\$|$))|\$\w+(\W|$)/g, '').replace(/(\W\w\W)|\W+/g, ' ').trim();
    globalQuery && newUrlSearchElements.push('global=' + encodeURI(globalQuery));

    const specificEntries = searchEntry.match(/\$\w+\[.*?(\]|\$|$)/g) || [];
    let specificQueries = [];
    if (specificEntries.length > 0) {
      specificEntries.map(specificEntry => {
        const queryFirstChar = specificEntry.indexOf('[') + 1;
        const queryLastChar = specificEntry[specificEntry.length - 1] == ']' ? specificEntry.length - 1 : specificEntry.length;
        const field = specificEntry.substring(1, queryFirstChar - 1);
        const query = specificEntry.substring(queryFirstChar, queryLastChar).replace(/(\W\w\W)|\W+/g, ' ').trim();
        const queryWords = query.split(' ');
        queryWords.forEach(queryWord => specificQueries.push({ [field]: queryWord }));
        newUrlSearchElements.push(field + '=' + encodeURI(query));
      });
      console.log('From SearchField, handleSearch. specificQueries:', specificQueries);
    }

    if (Object.keys(specificQueries).length === 0) specificQueries = '';
    const newSearch = globalQuery || specificQueries ? { globalQuery, specificQueries } : null;

    console.log('From SearchField, handleSearch. newSearch:', newSearch);
    Session.set('search', newSearch);
    console.log("From SearchField, Session.get('search'):", Session.get('search'));
    handleNewSearch(newSearch);
    const newUrlSearch = '?' + newUrlSearchElements.join('&');
    console.log('From SearchField, handleSearch. newUrlSearch:', newUrlSearch);
    if (location.search != newUrlSearch) {
      history.replace({ ...location, search: newUrlSearch });
    }
  };

  const handleToggleAdvancedSearch = () => {
    setAdvancedSearch(!advancedSearch);
    inputFocus(true)();
  };

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
                onClick={inputFocus(true)}
              >
                <Search />
              </InputAdornment>
          }
          value={searchEntry}
          onChange={handleSearchChange}
          onFocus={handleFocus(true)}
          onBlur={handleFocus(false)}
          onKeyDown={handleKeyDown}
        />
        {loading ? <CircularProgress className={classes.circularProgress} /> : null}
        <Divider className={classes.divider} />
        <IconButton
          color="primary"
          className={classes.iconButton}
          aria-label="Advanced search"
          onClick={handleToggleAdvancedSearch}
        >
          {advancedSearch ? <SettingsOutlined /> : <Settings />}
        </IconButton>
      </CardContent>
      {advancedSearch &&
        <CardActions className={classes.advancedSearchContainer}>
          <ButtonGroup
            classes={{ root: classes.buttonGroup, grouped: classes.buttons }}
            color="primary"
            variant="contained"
          >
            <Button value="titles" onClick={handleAdvancedButtonClick}>Titles</Button>
            <Button value="authors" onClick={handleAdvancedButtonClick}>Authors</Button>
            <Button value="editor" onClick={handleAdvancedButtonClick}>Editor</Button>
            <Button value="classifications" onClick={handleAdvancedButtonClick}>Classifications</Button>
            <Button value="lyrics" onClick={handleAdvancedButtonClick}>Lyrics</Button>
            <Button value="before" onClick={handleAdvancedButtonClick}>Before</Button>
            <Button value="after" onClick={handleAdvancedButtonClick}>After</Button>
            <Button onClick={handleToggleDisplaySort()}>Sort</Button>
          </ButtonGroup>
        </CardActions>
      }
    </Card>
  );
}

SearchField.propTypes = {
  handleFocus: PropTypes.func.isRequired,
  handleNewSearch: PropTypes.func.isRequired,
  handleToggleDisplaySort: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  logoMenuDeployed: PropTypes.bool.isRequired,
};

export default withRouter(SearchField);