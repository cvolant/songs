import React, { ReactElement } from 'react';

import MuiTypography, { TypographyProps } from '@material-ui/core/Typography';

export const Typography = <C extends React.ElementType>(
  props: TypographyProps<C, { component?: C }>,
  // eslint-disable-next-line react/jsx-props-no-spreading
): ReactElement => <MuiTypography {...props} />;

export default Typography;
