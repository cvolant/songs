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

import { useMenu } from '../../hooks/contexts/Menu';
import { useDeviceSize } from '../../hooks/contexts/DeviceSize';

import { ISearch, ISpecificQuery } from '../../types/searchTypes';

const advancedFields: IAdvancedField[] = [
  {
    name: 'titles',
    localName: 'titles',
    placeholder: ' ??? ',
  },
  {
    name: 'authors',
    localName: 'authors',
    placeholder: ' ??? ',
  },
  {
    name: 'editor',
    localName: 'editor',
    placeholder: ' ??? ',
  },
  {
    name: 'classifications',
    localName: 'classifications',
    placeholder: ' ??? ',
  },
  {
    name: 'lyrics',
    localName: 'lyrics',
    placeholder: ' ??? ',
  },
  {
    name: 'before',
    localName: 'before',
    placeholder: ' year ',
  },
  {
    name: 'after',
    localName: 'after',
    placeholder: ' year ',
  },
  {
    name: 'favorites',
    localName: 'favorites',
    placeholder: 'yes',
  },
];

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
      { logoMenuDeployed }: { logoMenuDeployed?: boolean },
    ): string => `calc(100% - 15rem + ${logoMenuDeployed ? 0 : 5}rem)`,
  },
}));

interface IAdvancedField {
  name: string;
  localName: string;
  placeholder: string;
}
interface ISearchFieldProps {
  displaySort?: boolean;
  handleNewSearch: (newSearch: ISearch) => void;
  handleToggleDisplaySort: (display?: boolean) => () => void;
  isAuthenticated?: boolean;
  loading?: boolean;
}

export const SearchField: React.FC<ISearchFieldProps> = ({
  displaySort,
  handleNewSearch,
  handleToggleDisplaySort,
  isAuthenticated,
  loading,
}) => {
  const { t } = useTranslation();

  const inputRef = createRef<HTMLInputElement>();
  const { logoMenuDeployed, toggleLogoMenu } = useMenu();
  const classes = useStyles({ logoMenuDeployed });
  const history = useHistory();
  const location = useLocation();
  const smallDevice = useDeviceSize('sm', 'down');

  const [searchEntry, setSearchEntry] = useState('');
  const [selectionRange, setSelectionRange] = useState<{
    selectionStart: number;
    selectionEnd: number;
  } | undefined>(undefined);
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [delay, setDelay] = useState<NodeJS.Timeout | undefined>(undefined);

  /**
   * Read url search:
   * - launch search
   * - set search entry if not set
   */
  useEffect(() => {
    if (location.search) {
      const newSearch: ISearch = location.search
        .substring(1)
        .replace('global=', '')
        .split('&')
        .reduce((result: ISearch, query: string) => {
          const equal = query.indexOf('=');
          if (equal === -1) {
            return {
              ...result,
              globalQuery: decodeURI(query),
            };
          }
          const localKey = decodeURI(query.substring(0, equal));
          const field = advancedFields.find((advancedField) => t(`song.${advancedField.name}`, advancedField.name) === localKey);
          if (field) {
            return {
              ...result,
              specificQueries: [
                ...result.specificQueries || [],
                {
                  [field.name]: decodeURI(query.substring(equal + 1)),
                },
              ],
            };
          }
          return result;
        }, {});
      handleNewSearch(newSearch);
      setSearchEntry((prevSearchEntry) => prevSearchEntry || [
        ...newSearch.globalQuery ? [newSearch.globalQuery] : [],
        ...newSearch.specificQueries ? newSearch.specificQueries.map((specificQuery) => {
          const [key, value] = Object.entries(specificQuery)[0];
          return `$${t(`song.${key}`, key)}[${value}]`;
        }) : [],
      ].join(' '));
    }
  }, [handleNewSearch, location.search, t]);

  /**
   * Parse search entry and change url
   */
  const handleSearch = useCallback((searchEntryToHandle: string): void => {
    const newUrlSearchElements = [];

    const globalQuery = searchEntryToHandle
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/(\$.*?\[.*?(\]|\$|$))|\$\w+(\W|$)/g, '') // Remove advanced searches
      .replace(/(\W\w\W)|\W+/g, ' ') // Remove multi spaces and single letters
      .trim();
    const specificQueries: ISpecificQuery[] = [];

    if (globalQuery) newUrlSearchElements.push(`global=${encodeURI(globalQuery)}`);

    const specificEntries = searchEntryToHandle.match(/\$[^\s$[\].,()]+\[.*?(\]|\$|$)/g) || [];
    if (specificEntries.length > 0) {
      specificEntries.forEach((specificEntry) => {
        const queryFirstChar = specificEntry.indexOf('[') + 1;
        const queryLastChar = specificEntry[specificEntry.length - 1] === ']' ? specificEntry.length - 1 : specificEntry.length;
        const fieldName = specificEntry.substring(1, queryFirstChar - 1);
        const query = specificEntry.substring(queryFirstChar, queryLastChar);
        const { name: field, placeholder } = advancedFields
          .find((advancedField) => t(`song.${advancedField.localName}`, advancedField.localName) === fieldName)
          || {};
        if (field && t(`search.placeholder.${placeholder}`, placeholder) !== query) {
          const cleanQuery = query.replace(/([\s$[\](),.]\w[\s$[\](),.])|\[\s$[\](),.]+/g, ' ').trim();
          const queryWords = cleanQuery.split(' ');
          queryWords.forEach((queryWord) => specificQueries.push({ [field]: queryWord }));
          newUrlSearchElements.push(`${fieldName}=${encodeURI(cleanQuery)}`);
        }
      });
    }

    const newUrlSearch = `?${newUrlSearchElements.join('&')}`;
    console.log('From SearchField, handleSearch. newUrlSearch:', newUrlSearch);
    if (location.search !== newUrlSearch) {
      history.replace({ ...location, search: newUrlSearch });
    }
  }, [history, location, t]);

  /**
   * Focus input and select range specified in selectionRange
   * (Occurs after a click on an advanced button)
   */
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
  }, [inputRef, selectionRange]);


  const inputFocus = (focus: boolean | undefined) => (): void => {
    const {
      current: input,
    } = inputRef;
    if (input) {
      if (focus || typeof focus === 'undefined') input.focus();
      else input.blur();
    }
  };

  /**
   * Blur input onSubmit with enter key stroke
   */
  const handleKeyDown: KeyboardEventHandler = (e) => {
    if (e && e.key === 'Enter') inputFocus(false)();
  };

  /**
   * Handle LogoMenu toggle on input focus/blur
   */
  const handleFocus = (focus: boolean) => (): void => {
    if (smallDevice && logoMenuDeployed && focus) {
      toggleLogoMenu(false);
    } else if (smallDevice && !logoMenuDeployed && !focus) {
      toggleLogoMenu(true);
    }
  };

  const handleAdvancedButtonClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    /* console.log(
      'From SearchFiel, handleAdvancedButtonClick.',
      'e:', e,
      'e.target:', e.target,
      'e.currentTarget:', e.currentTarget,
    ); */
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
        const localName = t(`song.${field.localName}`, field.localName);
        const placeholder = t(`search.placeholder.${field.placeholder}`, field.placeholder);
        let newSelectionEnd = typeof selectionEnd === 'number' ? selectionEnd : inputValue.length;
        let newSelectionStart = typeof selectionStart === 'number' ? selectionStart : newSelectionEnd;
        /* console.log(
          'From SearchField, handleAdvancedButtonClick.',
          'newSelectionStart:', newSelectionStart,
          'newSelectionEnd:', newSelectionEnd,
        ); */

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
          /* console.log(
            'From SearchField, handleAdvancedButtonClick. Cursor is not in a clean place.',
          ); */
        }

        // Build the resulting searchEntry string
        const stringParts: string[] = []; // Parts of the string
        // 1st part: up to newSelectionStart
        stringParts.push(inputValue.substring(0, newSelectionStart).trim());
        // 2nd part: with placeholder if nothing is selected, otherwise with selection
        if (newSelectionStart === newSelectionEnd) {
          stringParts.push(`$${localName}[${placeholder}]`);
        } else {
          stringParts.push(`$${localName}[${inputValue.substring(newSelectionStart, newSelectionEnd).trim()}]`);
        }
        // 3rd part: from newSelectionEnd to the end
        stringParts.push(inputValue.substring(newSelectionEnd).trim());

        // Set new selection
        newSelectionStart = stringParts[0].length + localName.length + 3; // From after the [
        newSelectionEnd = (stringParts[0] + stringParts[1]).length; // To before the ]
        setSelectionRange({
          selectionStart: newSelectionStart,
          selectionEnd: newSelectionEnd,
        });
        const newSearchString = stringParts.join(' ');
        setSearchEntry(newSearchString);
        inputFocus(true)();
        handleSearch(newSearchString);
        /* console.log(
          'From SearchField, handleAdvancedButtonClick.',
          '\nfield:', field,
          'inputValue:', inputValue,
          'stringParts:', stringParts,
        ); */
      } else {
        console.error('From SearchField, handleAdvancedButtonClick. field:', field, '\nThe value of each advanced search button should match a proper field name.');
      }
    }
  };

  /**
   * Input ChangeEventHandler:
   * Set the new search entry when user stops typing for some milliseconds
   */
  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const newEntry = e.currentTarget.value;
    setSearchEntry(newEntry);
    if (selectionRange) {
      setSelectionRange(undefined);
    }
    if (delay) {
      clearTimeout(delay);
    }
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
          startAdornment={searchEntry ? undefined : (
            <InputAdornment
              position="start"
              className={classes.adornment}
              onClick={inputFocus(true)}
            >
              <Search />
            </InputAdornment>
          )}
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
                    {t(`song.${localName}`, localName).replace(/(^|\s)\w/g, (l) => l.toUpperCase())}
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
