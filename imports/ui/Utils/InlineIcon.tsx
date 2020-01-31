import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { SvgIconProps } from '@material-ui/core/SvgIcon/SvgIcon';

const useStyles = makeStyles(() => ({
  inlineIcon: {
    height: '0.8em',
    margin: '0 3px',
    position: 'relative',
    top: '4px',
  },
}));

interface IInlineIconProps {
  Icon: (props: SvgIconProps) => JSX.Element;
}

export const InlineIcon: React.FC<IInlineIconProps> = ({ Icon }) => {
  const classes = useStyles();

  return (
    <Icon className={classes.inlineIcon} />
  );
};

export default InlineIcon;
