import React, { Suspense, useState, ReactNode } from 'react';
import { Helmet } from 'react-helmet';

import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { ITutorialContentName } from '../Tutorial';
import LogoMenu from '../LogoMenu';

const Tutorial = React.lazy(() => import('../Tutorial'));

const useStyles = makeStyles((theme) => ({
  contentArea: {
    display: 'flex',
    overflow: 'hidden',
  },
  pageContent: {
    flexGrow: 1,
    height: '100%',
    overflowY: 'scroll',
    overflowScrolling: 'touch',

    '& > *': {
      height: '100%',
      padding: theme.spacing(4, 4, 4, 4),
      position: 'relative',
    },
  },
  root: {
    background: theme.palette.background.page,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    padding: theme.spacing(2),
    width: '100vw',
  },
  suspense: {
    background: 'black',
    borderRadius: '16px 16px 0 0',
    bottom: 0,
    left: 0,
    padding: theme.spacing(4),
    position: 'absolute',
    opacity: 0.5,
    right: 0,
    textAlign: 'center',

    '& > div': {
      color: 'white',
    },
  },
  viewerContainer: {
    position: 'absolute',
    width: '100vw',

    '& > *': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
    },
  },
}));

interface IPageLayoutProps {
  children: ReactNode;
  contentAreaRef?: React.RefObject<HTMLDivElement>;
  menuProps?: {
    logoMenuDeployed: boolean;
    handleToggleLogoMenu: (deploy?: boolean) => () => void;
  };
  scrollDown?: () => void;
  sidePanel?: JSX.Element;
  smallDevice?: boolean;
  title?: string;
  tutorialContentName?: ITutorialContentName;
  viewer?: React.ReactNode;
}

export const PageLayout: React.FC<IPageLayoutProps> = ({
  children,
  contentAreaRef,
  menuProps,
  scrollDown,
  sidePanel,
  smallDevice,
  title,
  tutorialContentName,
  viewer,
}) => {
  const classes = useStyles();
  const [showTutorial, setShowTutorial] = useState(false);

  const tutorialAvailable = !!tutorialContentName;

  const handleToggleTutorial = (open: boolean | undefined) => (): void => {
    if (smallDevice && scrollDown) scrollDown();
    setShowTutorial(typeof open === 'undefined' ? !showTutorial : open);
    console.log('From PageLayout, handleToggleTutorial.');
  };

  return (
    <div className={classes.root}>
      <Helmet>
        <title>{`Alleluia.plus - ${title}`}</title>
      </Helmet>
      <LogoMenu
        handleToggleTutorial={handleToggleTutorial}
        showTutorial={showTutorial}
        tutorialAvailable={tutorialAvailable}
        logoMenuDeployed={menuProps && menuProps.logoMenuDeployed}
        handleToggleLogoMenu={menuProps && menuProps.handleToggleLogoMenu}
      />
      <Grid
        container
        spacing={4}
        className={classes.pageContent}
        onScroll={sidePanel && smallDevice && scrollDown ? scrollDown : undefined}
      >
        {console.log('From PageLayout, return. sidePanel:', sidePanel)}
        {!!sidePanel
          && (
            <Grid item sm={12} md={4} lg={3}>
              {sidePanel}
            </Grid>
          )}
        <Grid
          item
          xs={12}
          md={sidePanel ? 8 : undefined}
          lg={sidePanel ? 9 : undefined}
          ref={contentAreaRef}
          className={classes.contentArea}
        >
          {children}
          {showTutorial && tutorialContentName
            && (
              <Suspense fallback={<div className={classes.suspense}><CircularProgress /></div>}>
                <Tutorial
                  handleToggleTutorial={handleToggleTutorial}
                  tutorialContentName={tutorialContentName}
                />
              </Suspense>
            )}
        </Grid>
      </Grid>
      {viewer}
    </div>
  );
};

export default PageLayout;
