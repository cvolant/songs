import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Search from '@material-ui/icons/Search';
import Settings from '@material-ui/icons/Settings';

import InlineIcon from '../Utils/InlineIcon';
import { ISearch } from '../../types';

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(2),
  },
  spacedText: {
    lineHeight: '2',
  },
}));

interface ISearchListNoResultProps {
  search?: ISearch;
}

export const SearchListNoResult: React.FC<ISearchListNoResultProps> = ({
  search,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <>
      <Divider className={classes.divider} />
      <div>
        {search && (search.globalQuery || (search.specificQueries && search.specificQueries.length))
          ? (
            <span>
              <Typography className={classes.spacedText}>
                <InlineIcon Icon={Search} />
                {t('search.No results try advanced', 'No results, try advanced search')}
                <InlineIcon Icon={Settings} />
                .
                <br />
                {t('search.Possible to add', 'It is possible to add songs')}
              </Typography>
            </span>
          )
          : (
            <span>
              <Typography className={classes.spacedText}>
                <InlineIcon Icon={Search} />
                {t('search.Search possibilities', 'Search by keyword or use')}
                <InlineIcon Icon={Settings} />
                {t('search.in the searchfield', 'in the searchfield.')}
              </Typography>
            </span>
          )}
      </div>
    </>
  );
};

export default SearchListNoResult;
