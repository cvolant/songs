import { Session } from 'meteor/session';
import React, {
  createRef,
  useEffect,
  useState,
  MouseEventHandler,
  KeyboardEventHandler,
  ChangeEventHandler,
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

import { ISearch, ISpecificQuery, IFieldsKey } from '../../types/searchTypes';

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
      { logoMenuDeployed }: { logoMenuDeployed?: boolean },
    ): string => `calc(100% - 15rem + ${logoMenuDeployed ? 0 : 5}rem)`,
  },
}));

type IAdvancedFields = Record<IFieldsKey, {
  name: string;
  placeholder: string;
}>
interface ISearchFieldProps {
  displaySort?: boolean;
  handleFocus: (focus?: boolean) => () => void;
  handleNewSearch: (newSearch: ISearch) => void;
  handleToggleDisplaySort: (display?: boolean) => () => void;
  isAuthenticated?: boolean;
  loading?: boolean;
  logoMenuDeployed: boolean;
}

export const SearchField: React.FC<ISearchFieldProps> = ({
  displaySort,
  handleFocus,
  handleNewSearch,
  handleToggleDisplaySort,
  isAuthenticated,
  loading,
  logoMenuDeployed,
}) => {
  const { t } = useTranslation();

  const advancedFields: IAdvancedFields = {
    titles: {
      name: t('song.titles', 'titles'),
      placeholder: t('search.placeholder. ??? ', ' ??? '),
    },
    authors: {
      name: t('song.authors', 'authors'),
      placeholder: t('search.placeholder. ??? ', ' ??? '),
    },
    editor: {
      name: t('song.editor', 'editor'),
      placeholder: t('search.placeholder. ??? ', ' ??? '),
    },
    classifications: {
      name: t('song.classifications', 'classifications'),
      placeholder: t('search.placeholder. ??? ', ' ??? '),
    },
    lyrics: {
      name: t('song.lyrics', 'lyrics'),
      placeholder: t('search.placeholder. ??? ', ' ??? '),
    },
    before: {
      name: t('song.before', 'before'),
      placeholder: t('search.placeholder. year ', ' year '),
    },
    after: {
      name: t('song.after', 'after'),
      placeholder: t('search.placeholder. year ', ' year '),
    },
    favorites: {
      name: t('song.favorites', 'favorites'),
      placeholder: t('search.placeholder.yes', 'yes'),
    },
  };

  const inputRef = createRef<HTMLInputElement>();
  const classes = useStyles({ logoMenuDeployed });
  const history = useHistory();
  const location = useLocation();
  const [searchEntry, setSearchEntry] = useState('');
  const [selectionRange, setSelectionRange] = useState<{
    selectionStart: number;
    selectionEnd: number;
  } | undefined>(undefined);
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [delay, setDelay] = useState<NodeJS.Timeout | undefined>(undefined);

  const handleSearch = (searchEntryToHandle: string): void => {
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
        const field = specificEntry.substring(1, queryFirstChar - 1);
        const query = specificEntry.substring(queryFirstChar, queryLastChar).replace(/(\W\w\W)|\W+/g, ' ').trim();
        const queryWords = query.split(' ');
        queryWords.forEach((queryWord) => specificQueries.push({ [field]: queryWord }));
        newUrlSearchElements.push(`${field}=${encodeURI(query)}`);
      });
      console.log('From SearchField, handleSearch. specificQueries:', specificQueries);
    }

    console.log('From SearchField, handleSearch. newSearch:', newSearch);
    Session.set('search', newSearch);
    console.log("From SearchField, Session.get('search'):", Session.get('search'));
    handleNewSearch(newSearch);
    const newUrlSearch = `?${newUrlSearchElements.join('&')}`;
    console.log('From SearchField, handleSearch. newUrlSearch:', newUrlSearch);
    if (location.search !== newUrlSearch) {
      console.log('From SearchField, handleSearch. REDIRECTION. Former url search:', location.search, ', newUrlSearch:', newUrlSearch);
      history.replace({ ...location, search: newUrlSearch });
    }
  };

  useEffect(() => {
    const formerSearch = location.search || Session.get('search');
    if (formerSearch) {
      console.log('From SearchField, useEffect[]. search on mount. location.search:', location.search);
      const query = location.search.substring(1).replace('global=', '').split('&').map((q) => {
        const egal = q.indexOf('=');
        return egal === -1 ? decodeURI(q) : `$${q.substring(0, egal)}[${decodeURI(q.substring(egal + 1))}]`;
      })
        .join(' ');
      setSearchEntry(query);
      handleSearch(query);
    }
  }, []);
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
  }, [searchEntry]);


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
    console.log('From SearchFiel, handleAdvancedButtonClick. e:', e, 'e.currentTarget:', e.currentTarget, 'e.currentTarget:', e.currentTarget);
    if (inputRef.current) {
      const {
        currentTarget: {
          value: fieldKey,
        },
      } = e;
      const {
        current: {
          value: inputValue,
          selectionStart,
          selectionEnd,
        },
      } = inputRef;

      const field = advancedFields[fieldKey as IFieldsKey];

      if (selectionStart
        && selectionEnd
        && field
        && field.name
        && field.placeholder) {
        let newSelectionStart = selectionStart;
        let newSelectionEnd = selectionEnd;

        if (selectionStart === selectionEnd
          && selectionStart !== 0
          && selectionEnd !== inputValue.length) {
          console.log('From SearchField, handleAdvancedButtonClick. value:', inputValue, 'value.substring(selectionStart - 1, selectionEnd + 1):', inputValue.substring(selectionStart - 1, selectionEnd + 1));
          if (!inputValue.substring(selectionStart - 1, selectionEnd + 1).match(/.\W|[^$\w]./g)) {
            newSelectionStart = inputValue.length;
            newSelectionEnd = inputValue.length;
          }
        }

        const stringParts = [];
        stringParts.push(inputValue.substring(0, newSelectionStart).trim());
        if (newSelectionStart === newSelectionEnd) {
          stringParts.push(`$${field.name}[${field.placeholder}]`);
        } else {
          stringParts.push(`$${field.name}[${inputValue.substring(newSelectionStart, newSelectionEnd).trim()}]`);
        }
        stringParts.push(inputValue.substring(newSelectionEnd).trim());
        newSelectionStart = stringParts[0].length + fieldKey.length + 3;
        newSelectionEnd = (stringParts[0] + stringParts[1]).length;
        setSelectionRange({
          selectionStart: newSelectionStart,
          selectionEnd: newSelectionEnd,
        });
        const newSearchString = stringParts.join(' ');
        setSearchEntry(newSearchString);
        inputFocus(true)();
        handleSearch(newSearchString);
        console.log('From SearchField, handleAdvancedButtonClick.\nfield:', field, 'fieldKey:', fieldKey, 'inputValue:', inputValue, 'stringParts:', stringParts);
      } else {
        console.error('From SearchField, handleAdvancedButtonClick. field:', field, '\nThe value of each advanced search button should match a proper field object.');
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
        <Divider className={classes.divider} />
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
              {Object.entries(advancedFields).map(([fieldKey, fieldValues]) => {
                if (fieldKey === 'favorites' && !isAuthenticated) return undefined;
                return (
                  <Button value={fieldKey} key={fieldKey} onClick={handleAdvancedButtonClick}>
                    {fieldValues.name.replace(/(^|\s)\w/g, (l) => l.toUpperCase())}
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
