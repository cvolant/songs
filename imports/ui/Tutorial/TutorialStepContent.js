import React from 'react';
import Typography from '@material-ui/core/Typography';
import {
  Add,
  ArrowDownward,
  ArrowUpward,
  Cancel,
  Check,
  Clear,
  Delete,
  Edit,
  Menu,
  Person,
  Remove,
  Settings,
} from '@material-ui/icons';
import InlineIcon from '../utils/InlineIcon';


const steps = {
  globalNavigation: {
    title: "Navigation",
    body: isAutenticated =>
      <React.Fragment>
        Click the logo to expand/shrink the menu buttons. 
        Click the menu icon <InlineIcon Icon={Menu} /> to open the full menu.<br />
        {isAutenticated ?
          <React.Fragment>
            Click the personnal space icon <InlineIcon Icon={Person} /> to access your personnal space.
          </React.Fragment>
          :
          <React.Fragment>
            You must be signed in to access your personnal space, data, songlists, ...
            Click the "Sign in" button or the personnal space icon <InlineIcon Icon={Person} /> to sign in.
          </React.Fragment>
        }
      </React.Fragment>,
  },
  searchSong: {
    title: "Song search",
    body: () =>
      <React.Fragment>
        Write any keyword from a title, an author, an editor, or a classification in the search field.<br />
        If you get too much results you are not interested in, add more keywords or open the advanced search options:<InlineIcon Icon={Settings} />.<br />
        Click on an option, then type your keyword inside the corresponding brackets "[ ]". Add as many options as you want.<br />
        Ex: silence $before[1910] $authors[bach]
      </React.Fragment>,
  },
  chooseSong: {
    title: "Choosing a song",
    body: () =>
      <React.Fragment>
        Once a list of songs is displayed, you can choose the one you were looking for by clicking the check mark <InlineIcon Icon={Check} /> at its right.<br />
        You may not be sure which one to choose: just click on one song elsewhere than on the check mark to have a closer look at it.
      </React.Fragment>,
  },
  displaySong: {
    title: "Display a song",
    body: () =>
      <React.Fragment>
        Click on the paragraphs you want to select them, or on the "Select all" button to select all of them.<br />
        Then click the check button <InlineIcon Icon={Check} /> to display the song in the viewer.<br />
        There, you can use the <InlineIcon Icon={Add} /> and <InlineIcon Icon={Remove} /> button to change the font size, and the <InlineIcon Icon={Clear} /> button to close the viewer.
      </React.Fragment>,
  },
  editSong: {
    title: "Song edition",
    body: isAutenticated =>
        {isAutenticated ?
          <React.Fragment>
            Click the edit button <InlineIcon Icon={Edit} /> to enter the edit mode.<br />
            Once you are done, click on the "Save all" or the "Cancel all" button to quit editing.<br />
            You can erase the edited song by clicking on the bottom delete icon <InlineIcon Icon={Delete} />.
          </React.Fragment>
          :
          <React.Fragment>
            Once signed in, you will be able to edit and save the song here.<br />
            Click the personnal space icon <InlineIcon Icon={Person} /> in the top right menu to sign in.
          </React.Fragment>
        },
  },
  editParagraph: {
    title: "Paragraph edition",
    body: isAutenticated =>
      {isAutenticated ?
        <React.Fragment>
          Once you have entered the edit mode, choose a paragraph and click its edit button <InlineIcon Icon={Edit} /> to edit it.<br />
          Make any change to it, then click on its check icon <InlineIcon Icon={Check} /> to save or its cancel icon <InlineIcon Icon={Cancel} /> to dismiss your changes.<br />
          You can delete this paragraph by clicking on its delete icon <InlineIcon Icon={Delete} />.<br />
          You can also click its up and down arrows <InlineIcon Icon={ArrowUpward} /><InlineIcon Icon={ArrowDownward} /> move it up or down and reorder the song.<br />
          Finally, you can edit the titles and data about the song the same way, using the edit button <InlineIcon Icon={Edit} /> next to the title.
        </React.Fragment>
        :
        <React.Fragment>
          Once signed in, you will be able edit the titles, data, paragraphs, and reorder them as you wish here.<br />
          Click the personnal space icon <InlineIcon Icon={Person} /> in the top right menu to sign in.
        </React.Fragment>
      },
  },
  signIn: {
    title: "Signing In",
    body: () =>
      <React.Fragment>
        If you already signed up, you just need to enter here the email adress you used to sign up in the email field, and the password you chose in the password field. 
      </React.Fragment>,
  },
  signUp: {
    title: "Signing Up",
    body: () =>
      <React.Fragment>
        If you have not signed up yet, to do so, you just need to enter a valid email adress in the email field, and enter a password you will remember in the password field.<br />
        Your password must be at least 6 characters long.
      </React.Fragment>,
  },
  notSignedUp: {
    title: "If have not signed up yet",
    body: () =>
      <React.Fragment>
        If you have not signed up yet, click the "Need an account?" link to sign up.
      </React.Fragment>,
  },
  alreadySignedUp: {
    title: "If you have already signed up",
    body: () =>
    <React.Fragment>
      If you already signed up, click the "Already have an account?" link to sign in.
    </React.Fragment>,
  },
};

export const TutorialStepContent = ({ isAutenticated, stepName }) => (

  <React.Fragment>
    <Typography gutterBottom variant='h3'>{steps[stepName].title}</Typography>
    <Typography>{steps[stepName].body(isAutenticated)}</Typography>
  </React.Fragment>
);

export default TutorialStepContent;