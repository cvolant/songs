import React, {
  createRef,
  useEffect,
  useState,
  MouseEventHandler,
  KeyboardEventHandler,
  ChangeEventHandler,
  useCallback,
} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputBase from '@material-ui/core/InputBase';
import Settings from '@material-ui/icons/Settings';
import SettingsOutlined from '@material-ui/icons/SettingsOutlined';
import Search from '@material-ui/icons/Search';

import { ISearch, ISpecificQuery } from '../../types/searchTypes';

const useStyles = makeStyles((theme) => ({
  adornment: {
    position: 'absolute',
    color: theme.palette.font.color.black,
    opacity: theme.palette.font.opacity.subtle,
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
  lineThrough: {
    textDecoration: 'line-through',
  },
  root: {
    borderRadius: '1.5rem',
    boxShadow: '0px 2px 6px 0px inset rgba(0,0,0,0.2),0px 2px 2px 0px inset rgba(0,0,0,0.14),0px 4px 2px -2px inset rgba(0,0,0,0.12)',
    flexShrink: 0,
    margin: theme.spacing(1),
    transition: theme.transitions.create('width'),
    width: (
      { shortSearchField }: { shortSearchField?: boolean },
    ): string => `calc(100% - 15rem + ${shortSearchField ? 0 : 5}rem)`,
  },
}));

interface IAdvancedField {
  name: string;
  localName: string;
  placeholder: string;
}
interface ISearchFieldProps {
  displaySort?: boolean;
  handleFocus: (focus?: boolean) => () => void;
  handleNewSearch: (newSearch: ISearch) => void;
  handleToggleDisplaySort: (display?: boolean) => () => void;
  isAuthenticated?: boolean;
  loading?: boolean;
  shortSearchField: boolean;
}

export const SearchField: React.FC<ISearchFieldProps> = ({
  displaySort,
  handleFocus,
  handleNewSearch,
  handleToggleDisplaySort,
  isAuthenticated,
  loading,
  shortSearchField,
}) => {
  const { t } = useTranslation();

  const advancedFields: IAdvancedField[] = [
    {
      name: 'titles',
      localName: t('song.titles', 'titles'),
      placeholder: t('search.placeholder. ??? ', ' ??? '),
    },
    {
      name: 'authors',
      localName: t('song.authors', 'authors'),
      placeholder: t('search.placeholder. ??? ', ' ??? '),
    },
    {
      name: 'editor',
      localName: t('song.editor', 'editor'),
      placeholder: t('search.placeholder. ??? ', ' ??? '),
    },
    {
      name: 'classifications',
      localName: t('song.classifications', 'classifications'),
      placeholder: t('search.placeholder. ??? ', ' ??? '),
    },
    {
      name: 'lyrics',
      localName: t('song.lyrics', 'lyrics'),
      placeholder: t('search.placeholder. ??? ', ' ??? '),
    },
    {
      name: 'before',
      localName: t('song.before', 'before'),
      placeholder: t('search.placeholder. year ', ' year '),
    },
    {
      name: 'after',
      localName: t('song.after', 'after'),
      placeholder: t('search.placeholder. year ', ' year '),
    },
    {
      name: 'favorites',
      localName: t('song.favorites', 'favorites'),
      placeholder: t('search.placeholder.yes', 'yes'),
    },
  ];

  const inputRef = createRef<HTMLInputElement>();
  const classes = useStyles({ shortSearchField });
  const history = useHistory();
  const location = useLocation();
  const [searchEntry, setSearchEntry] = useState('');
  const [selectionRange, setSelectionRange] = useState<{
    selectionStart: number;
    selectionEnd: number;
  } | undefined>(undefined);
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [delay, setDelay] = useState<NodeJS.Timeout | undefined>(undefined);

  const handleSearch = useCallback((searchEntryToHandle: string): void => {
    const newUrlSearchElements = [];

    const globalQuery = searchEntryToHandle
      .replace(/(\$.*?\[.*?(\]|\$|$))|\$\w+(\W|$)/g, '')
      .replace(/(\W\w\W)|\W+/g, ' ')
      .trim();
    const specificQueries: ISpecificQuery[] = [];
    const newSearch: ISearch = { globalQuery, specificQueries };

    if (globalQuery) newUrlSearchElements.push(`global=${encodeURI(globalQuery)}`);

    const specificEntries = searchEntryToHandle.match(/\$\w+\[.*?(\]|\$|$)/g) || [];
    if (specificEntries.length > 0) {
      specificEntries.forEach((specificEntry) => {
        const queryFirstChar = specificEntry.indexOf('[') + 1;
        const queryLastChar = specificEntry[specificEntry.length - 1] === ']' ? specificEntry.length - 1 : specificEntry.length;
        const fieldName = specificEntry.substring(1, queryFirstChar - 1);
        const query = specificEntry.substring(queryFirstChar, queryLastChar);
        const { name: field, placeholder } = advancedFields
          .find((advancedField) => advancedField.localName === fieldName)
          || {};
        if (field && placeholder !== query) {
          const cleanQuery = query.replace(/(\W\w\W)|\W+/g, ' ').trim();
          const queryWords = cleanQuery.split(' ');
          queryWords.forEach((queryWord) => specificQueries.push({ [field]: queryWord }));
          newUrlSearchElements.push(`${fieldName}=${encodeURI(cleanQuery)}`);
        }
      });
      console.log('From SearchField, handleSearch. specificQueries:', specificQueries);
    }

    console.log('From SearchField, handleSearch. newSearch:', newSearch);
    handleNewSearch(newSearch);
    const newUrlSearch = `?${newUrlSearchElements.join('&')}`;
    console.log('From SearchField, handleSearch. newUrlSearch:', newUrlSearch);
    if (location.search !== newUrlSearch) {
      console.log('From SearchField, handleSearch. REDIRECTION. Former url search:', location.search, ', newUrlSearch:', newUrlSearch);
      history.replace({ ...location, search: newUrlSearch });
    }
  }, [advancedFields, handleNewSearch, history, location]);

  useEffect(() => {
    const urlSearchQuery = location.search;
    if (urlSearchQuery) {
      console.log('From SearchField, useEffect[]. search on mount. location.search:', urlSearchQuery);
      const query = urlSearchQuery.substring(1).replace('global=', '').split('&').map((q) => {
        const egal = q.indexOf('=');
        return egal === -1 ? decodeURI(q) : `$${q.substring(0, egal)}[${decodeURI(q.substring(egal + 1))}]`;
      })
        .join(' ');
      setSearchEntry(query);
      handleSearch(query);
    }
  }, [location.search, handleSearch]);

  useEffect(() => {
    if (selectionRange && inputRef.current) {
      const { selectionStart, selectionEnd } = selectionRange;
      const {
        current: input,
      } = inputRef;
      if (input
        && (selectionStart !== input.selectionStart
          || selectionEnd !== input.selectionEnd)) {
        input.setSelectionRange(selectionStart, selectionEnd);
        input.focus();
      }
    }
  }, [searchEntry, inputRef, selectionRange]);


  const inputFocus = (focus: boolean | undefined) => (): void => {
    const {
      current: input,
    } = inputRef;
    if (input) {
      if (focus || typeof focus === 'undefined') input.focus();
      else input.blur();
    }
  };

  const handleAdvancedButtonClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    console.log('From SearchFiel, handleAdvancedButtonClick. e:', e, 'e.target:', e.target, 'e.currentTarget:', e.currentTarget);
    if (inputRef.current) {
      const {
        currentTarget: {
          value: fieldName,
        },
      } = e;
      const {
        current: {
          value: inputValue,
          selectionStart,
          selectionEnd,
        },
      } = inputRef;

      const field = advancedFields.find((advancedField) => advancedField.name === fieldName);

      if (field) {
        let newSelectionEnd = typeof selectionEnd === 'number' ? selectionEnd : inputValue.length;
        let newSelectionStart = typeof selectionStart === 'number' ? selectionStart : newSelectionEnd;
        console.log('From SearchField, handleAdvancedButtonClick. newSelectionStart:', newSelectionStart, 'newSelectionEnd:', newSelectionEnd);

        // A 'clean place' is:
        const cursorInCleanPlace = (pos: number): boolean => false
          // || either the start of the string
          || pos === 0
          // || either the end of the string
          || pos === inputValue.length
          // || either...
          || (true
            // && next to a space
            && !!inputValue.substr(pos - 1, 2).match(/.\s|\s./g)
            // && outsite of brackets
            && !inputValue.substring(0, newSelectionStart).match(/\[[^\]]*$/g)
          );

        // If the start or the end of selection is not in a clean place
        if (!cursorInCleanPlace(newSelectionStart) || !cursorInCleanPlace(newSelectionEnd)) {
          // Then let's put the cursor at the end
          newSelectionStart = inputValue.length;
          newSelectionEnd = inputValue.length;
          console.log('From SearchField, handleAdvancedButtonClick. Cursor is not in a clean place.');
        }

        // Build the resulting searchEntry string
        const stringParts: string[] = []; // Parts of the string
        // 1st part: up to newSelectionStart
        stringParts.push(inputValue.substring(0, newSelectionStart).trim());
        // 2nd part: with placeholder if nothing is selected, otherwise with selection
        if (newSelectionStart === newSelectionEnd) {
          stringParts.push(`$${field.localName}[${field.placeholder}]`);
        } else {
          stringParts.push(`$${field.localName}[${inputValue.substring(newSelectionStart, newSelectionEnd).trim()}]`);
        }
        // 3rd part: from newSelectionEnd to the end
        stringParts.push(inputValue.substring(newSelectionEnd).trim());

        // Set new selection
        newSelectionStart = stringParts[0].length + field.localName.length + 3; // From after the [
        newSelectionEnd = (stringParts[0] + stringParts[1]).length; // To before the ]
        setSelectionRange({
          selectionStart: newSelectionStart,
          selectionEnd: newSelectionEnd,
        });
        const newSearchString = stringParts.join(' ');
        setSearchEntry(newSearchString);
        inputFocus(true)();
        handleSearch(newSearchString);
        console.log('From SearchField, handleAdvancedButtonClick.\nfield:', field, 'inputValue:', inputValue, 'stringParts:', stringParts);
      } else {
        console.error('From SearchField, handleAdvancedButtonClick. field:', field, '\nThe value of each advanced search button should match a proper field name.');
      }
    }
  };

  const handleKeyDown: KeyboardEventHandler = (e) => {
    if (e && e.key === 'Enter') inputFocus(false)();
  };

  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const newEntry = e.currentTarget.value;
    setSearchEntry(newEntry);
    if (selectionRange) setSelectionRange(undefined);

    if (delay) clearTimeout(delay);
    setDelay(setTimeout(() => handleSearch(newEntry), 750));
  };

  const handleToggleAdvancedSearch = (): void => {
    setAdvancedSearch(!advancedSearch);
    inputFocus(true)();
  };

  return (
    <Card className={classes.root}>
      <CardContent className={classes.inputContainer}>
        <InputBase
          aria-label={t('search.Search field', 'Search field')}
          className={classes.input}
          placeholder={`      ${t('search.placeholder.Search', 'Search…')}`}
          inputRef={inputRef}
          startAdornment={
            searchEntry ? undefined
              : (
                <InputAdornment
                  position="start"
                  className={classes.adornment}
                  onClick={inputFocus(true)}
                >
                  <Search />
                </InputAdornment>
              )
          }
          value={searchEntry}
          onChange={handleSearchChange}
          onFocus={handleFocus(true)}
          onBlur={handleFocus(false)}
          onKeyDown={handleKeyDown}
        />
        {loading ? <CircularProgress className={classes.circularProgress} /> : null}
        <Divider orientation="vertical" className={classes.divider} />
        <IconButton
          color="primary"
          className={classes.iconButton}
          aria-label={t('search.Advanced search', 'Advanced search')}
          onClick={handleToggleAdvancedSearch}
        >
          {advancedSearch ? <SettingsOutlined /> : <Settings />}
        </IconButton>
      </CardContent>
      {advancedSearch
        && (
          <CardActions className={classes.advancedSearchContainer}>
            <ButtonGroup
              classes={{ root: classes.buttonGroup, grouped: classes.buttons }}
              color="primary"
              variant="contained"
            >
              {advancedFields.map(({ name, localName }) => {
                if (name === 'favorites' && !isAuthenticated) return undefined;
                return (
                  <Button value={name} key={name} onClick={handleAdvancedButtonClick}>
                    {localName.replace(/(^|\s)\w/g, (l) => l.toUpperCase())}
                  </Button>
                );
              })}
              <Button
                classes={{ label: displaySort ? classes.lineThrough : '' }}
                onClick={handleToggleDisplaySort()}
              >
                {t('search.Sort', 'Sort')}
              </Button>
            </ButtonGroup>
          </CardActions>
        )}
    </Card>
  );
};

export default SearchField;
