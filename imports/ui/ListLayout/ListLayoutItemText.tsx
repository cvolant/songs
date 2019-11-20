import React, { MouseEventHandler, ReactNode } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    marginRight: theme.spacing(2),
    whiteSpace: 'nowrap',
  },
  folded: {
    color: theme.palette.font.color.black,
    opacity: theme.palette.font.opacity.light,
    marginRight: theme.spacing(2),
    whiteSpace: 'nowrap',
    '& > *': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  listItemText: {
    cursor: 'pointer',
    marginTop: 0,
    marginBottom: 0,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  titles: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flexGrow: 1,
  },
  unfolded: {
    marginRight: theme.spacing(2),
  },
  rightSide: {
    flexShrink: 0,
    marginLeft: theme.spacing(2),
  },
}));

interface IListLayoutItemTextProps {
  handleUnfold: MouseEventHandler<HTMLDivElement>;
  primary: ReactNode | ReactNode[];
  rightSide?: ReactNode;
  secondary?: ReactNode | ReactNode[];
  unfolded?: boolean;
}

export const ListLayoutItemText: React.FC<IListLayoutItemTextProps> = ({
  handleUnfold, primary, rightSide, secondary, unfolded = false,
}) => {
  const classes = useStyles();

  return (
    <ListItemText
      className={classes.listItemText}
      disableTypography
      onClick={handleUnfold}
      primary={(
        <div className={classes.container}>
          <Typography className={classes.titles} key="primary" variant="h6">
            {primary}
          </Typography>
          {rightSide && <Typography className={classes.rightSide} key="secondary" variant="h6">{rightSide}</Typography>}
        </div>
      )}
      secondary={(
        <div className={unfolded ? classes.unfolded : classes.folded}>
          {secondary}
        </div>
      )}
    />
  );
};

export default ListLayoutItemText;
