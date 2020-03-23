/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-props-no-spreading */
import React, { ElementType, Suspense, ReactChildren } from 'react';
import ReactMarkDown from 'react-markdown';

import makeStyles from '@material-ui/core/styles/makeStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import { ThemeStyle } from '@material-ui/core/styles/createTypography';

const useStyles = makeStyles((theme) => ({
  heading2: {
    marginTop: theme.spacing(3),
  },
  list: {
    paddingTop: 0,
  },
  listItem: {
    '& > p::before': {
      content: '"-"',
      marginRight: theme.spacing(1),
    },
  },
  paragraph: {
    textAlign: 'justify',
  },
}));

const TypographyRenderer: React.FC<{ level?: number }> = ({ level, ...otherProps }) => {
  const classes = useStyles();
  const variant = (level ? `h${level}` : undefined) as ThemeStyle;
  const component = (level ? variant as ElementType<any> : undefined);
  const className = classes[`heading${level}` as 'heading2'];
  return (component
    ? (
      <Typography
        paragraph
        variant={variant}
        className={className}
        component={component}
        {...otherProps}
      />
    ) : <Typography paragraph className={classes.paragraph} {...otherProps} />
  );
};

interface IMarkDownListProps {
  tight: boolean;
  ordered: boolean;
  chilren: ReactChildren;
}
const ListItemRenderer: React.FC<IMarkDownListProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  children, tight, ordered, ...otherProps
}) => {
  const classes = useStyles();
  return (
    <ListItem className={classes.listItem} {...otherProps}>
      <Typography>
        {children}
      </Typography>
    </ListItem>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ListRenderer: React.FC<IMarkDownListProps> = ({ tight, ordered, ...otherProps }) => {
  const classes = useStyles();
  return <List className={classes.list} dense {...otherProps} />;
};

const renderers = {
  paragraph: TypographyRenderer,
  heading: TypographyRenderer,
  list: ListRenderer,
  listItem: ListItemRenderer,
};

interface IMarkDownTextProps {
  source: string;
}

export const MarkDownText: React.FC<IMarkDownTextProps> = ({ source }) => (
  <Suspense fallback={<CircularProgress />}>
    <ReactMarkDown source={source} renderers={renderers} />
  </Suspense>
);

export default MarkDownText;
