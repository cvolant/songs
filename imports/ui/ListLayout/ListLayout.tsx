import React, { useRef, ReactElement, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import { Typography } from '@material-ui/core';

import ListLayoutItemLoading from './ListLayoutItemLoading';

const useStyles = makeStyles((theme) => ({
  list: {
    backgroundColor: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
    overflowScrolling: 'touch',
    overflowY: 'auto',
    width: '100%',

    '& > li, & > div': {
      transition: theme.transitions.create('margin-right'),
    },

    '& > li:first-child, & > div:first-child': {
      marginRight: ((
        { shortFirstItem }: { shortFirstItem: boolean },
      ): string => (shortFirstItem ? '4rem' : '0')) as unknown as string,
    },
  },
  emptyItemContainer: {
    padding: theme.spacing(2),
  },
}));

interface IListLayoutProps {
  children: ReactElement[];
  displaySort: boolean;
  emptyListPlaceholder?: ReactNode;
  listSorting?: ReactElement;
  loading?: boolean;
  shortFirstItem?: boolean;
  raiseLimit?: () => void;
}

export const ListLayout: React.FC<IListLayoutProps> = ({
  children,
  displaySort,
  emptyListPlaceholder,
  listSorting,
  loading = false,
  shortFirstItem = false,
  raiseLimit,
}) => {
  const listRef = useRef<HTMLElement>();
  const classes = useStyles({ shortFirstItem });
  const { t } = useTranslation();

  const handleListScroll = (): void => {
    if (!loading && listRef.current) {
      const {
        current: {
          scrollTop,
          scrollHeight,
          clientHeight,
        },
      } = listRef;
      const scrollPosition = (scrollTop * 100) / (scrollHeight - clientHeight);
      if (scrollPosition > 90 && raiseLimit) {
        // console.log('From ListLayout, handleListScroll. scrollPosition:', scrollPosition);
        raiseLimit();
      }
    }
  };

  return (
    <List
      component="nav"
      className={classes.list}
      onScroll={raiseLimit && handleListScroll}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={listRef as any}
      subheader={displaySort ? listSorting : undefined}
    >
      {children.length === 0 && !loading ? (
        <div className={classes.emptyItemContainer}>
          {emptyListPlaceholder || (
            <Typography>
              {t('search.Nothing found so far', 'Nothing found so far.')}
            </Typography>
          )}
        </div>
      ) : children}
      {loading && <ListLayoutItemLoading />}
    </List>
  );
};

export default ListLayout;
