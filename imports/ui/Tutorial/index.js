import React, { Suspense } from 'react';
import { Meteor } from 'meteor/meteor';
import { PropTypes } from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';

import Panel from '../utils/Panel';
import TutorialStepContent from './TutorialStepContent';

const steps = {
  SearchPage: ['globalNavigation', 'searchSong', 'chooseSong'],
  Editor: ['globalNavigation', 'displaySong', 'editSong', 'editParagraph'],
  SignIn : ['signIn', 'notSignedUp'],
  SignUp : ['signUp', 'alreadySignedUp'],
};

const useStyles = makeStyles(theme => ({
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
    width: ({ nbSteps }) => `${100 / nbSteps}%`,
    overflow: 'auto',
    overflowScrolling: 'touch',
    maxHeight: '40vh',
  },
  steps: {
    left: ({ activeStep }) => `${-100 * activeStep}%`,
    position: 'relative',
    transition: theme.transitions.create('left', { duration: theme.transitions.duration.shorter }),
    width: ({ nbSteps }) => `${100 * nbSteps}%`,
  },
  tutorial: {
    overflow: 'hidden',
  },
}));

export const Tutorial = ({ handleToggleTutorial, tutorialContentName }) => {  
  const nbSteps = steps[tutorialContentName].length;
  const [activeStep, setActiveStep] = React.useState(0);
  const classes = useStyles({ nbSteps, activeStep });

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  return (
    <Panel className={classes.root} handleClosePanel={handleToggleTutorial(false)}>
      {console.log('From Tutorial, return. tutorialContentName:', tutorialContentName)}
      <div className={classes.tutorial}>
        <div className={classes.steps}>
          {steps[tutorialContentName].map((step, key) => (
            <div className={classes.step} key={key}>
              <TutorialStepContent isAutenticated={Meteor.userId()} stepName={step} />
            </div>
          ))}
        </div>
        <MobileStepper
          variant="dots"
          steps={nbSteps}
          position="static"
          activeStep={activeStep}
          className={classes.stepper}
          nextButton={
            <Button size="small" onClick={handleNext} disabled={activeStep === nbSteps - 1}>
              Next
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
              <KeyboardArrowLeft />
              Back
        </Button>
          }
        />
      </div>
    </Panel>
  );
};

Tutorial.propTypes = {
  handleToggleTutorial: PropTypes.func.isRequired,
  tutorialContentName: PropTypes.string.isRequired,
};

export default Tutorial;