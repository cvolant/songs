import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

import Panel from '../Utils/Panel';
import TutorialStepContent, { IStepName } from './TutorialStepContent';

const steps: ISteps = {
  Dashboard: ['notWrittenYet'],
  Folder: ['notWrittenYet'],
  Editor: ['globalNavigation', 'displaySong', 'editSong', 'editParagraph'],
  Search: ['globalNavigation', 'searchSong', 'sortList', 'chooseSong', 'favorites'],
  SignIn: ['signIn', 'notSignedUp'],
  SignUp: ['signUp', 'alreadySignedUp'],
  Station: ['notWrittenYet'],
};

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.secondary.light,
    bottom: 0,
    boxShadow: `${theme.spacing(0.25, 0.25, 1)} ${theme.palette.grey['800']}`,
    left: 0,
    margin: theme.spacing(2),
    opacity: 0.95,
    padding: theme.spacing(3),
    position: 'absolute',
    right: 0,
  },
  stepper: {
    background: 'transparent',
    flexGrow: 1,
    paddingBottom: 0,
  },
  step: {
    float: 'left',
    width: ({ nbSteps }: { nbSteps: number }): string | number | undefined => `${100 / nbSteps}%`,
    overflow: 'auto',
    overflowScrolling: 'touch',
    maxHeight: '40vh',
  },
  steps: {
    left: ({ activeStep }: { nbSteps: number; activeStep: number }): string | number => `${-100 * activeStep}%`,
    position: 'relative',
    transition: theme.transitions.create('left', { duration: theme.transitions.duration.shorter }),
    width: ({ nbSteps }: { nbSteps: number }): string => `${100 * nbSteps}%`,
  },
  tutorial: {
    overflow: 'hidden',
  },
}));

export type ITutorialContentName =
| 'Editor'
| 'Folder'
| 'Dashboard'
| 'Search'
| 'SignIn'
| 'SignUp'
| 'Station';

type ISteps = Record<ITutorialContentName, IStepName[]>

interface ITutorialProps {
  handleToggleTutorial: (deploy?: boolean) => () => void;
  tutorialContentName: ITutorialContentName;
}

export const Tutorial: React.FC<ITutorialProps> = ({
  handleToggleTutorial, tutorialContentName,
}) => {
  const { t } = useTranslation();
  const nbSteps = steps[tutorialContentName].length;
  const [activeStep, setActiveStep] = React.useState(0);
  const classes = useStyles({ nbSteps, activeStep });

  const handleNext = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Panel className={classes.root} handleClosePanel={handleToggleTutorial(false)} closeName={t('tutorial.Close tutorial', 'Close tutorial')}>
      <div className={classes.tutorial}>
        <div className={classes.steps}>
          {steps[tutorialContentName].map((step) => (
            <div className={classes.step} key={step}>
              <TutorialStepContent isAutenticated={!!Meteor.userId()} stepName={step} />
            </div>
          ))}
        </div>
        <MobileStepper
          variant="dots"
          steps={nbSteps}
          position="static"
          activeStep={activeStep}
          className={classes.stepper}
          nextButton={(
            <Button size="small" onClick={handleNext} disabled={activeStep === nbSteps - 1}>
              {t('Next')}
              <KeyboardArrowRight />
            </Button>
          )}
          backButton={(
            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
              <KeyboardArrowLeft />
              {t('Back')}
            </Button>
          )}
        />
      </div>
    </Panel>
  );
};

export default Tutorial;
