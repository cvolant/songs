import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';
import Add from '@material-ui/icons/Add';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Cancel from '@material-ui/icons/Cancel';
import Check from '@material-ui/icons/Check';
import Clear from '@material-ui/icons/Clear';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Menu from '@material-ui/icons/Menu';
import Person from '@material-ui/icons/Person';
import Remove from '@material-ui/icons/Remove';
import Settings from '@material-ui/icons/Settings';

import InlineIcon from '../Common/InlineIcon';

export type IStepName =
| 'notWrittenYet'
| 'globalNavigation'
| 'searchSong'
| 'sortList'
| 'chooseSong'
| 'favorites'
| 'displaySong'
| 'editSong'
| 'editParagraph'
| 'signIn'
| 'signUp'
| 'notSignedUp'
| 'alreadySignedUp';

interface ITutorialStepContentProps {
  isAutenticated: boolean;
  stepName: IStepName;
}
export const TutorialStepContent: React.FC<ITutorialStepContentProps> = ({
  isAutenticated, stepName,
}) => {
  const { t } = useTranslation();

  const steps = {
    notWrittenYet: {
      title: t('tutorial.notWrittenYet.title', 'Sorry'),
      body: t('tutorial.notWrittenYet.1', 'This part of the tutorial is not available yet...'),
    },
    globalNavigation: {
      title: t('tutorial.globalNavigation.title', 'Navigation'),
      body: (
        <>
          <Trans i18nKey="tutorial.globalNavigation.1">
            Click the logo to expand/shrink the menu buttons. Click the menu icon
            {' '}
            <InlineIcon Icon={Menu} />
            {' '}
            to open the full menu.
          </Trans>
          <br />
          {isAutenticated
            ? (
              <Trans i18nKey="tutorial.globalNavigation.auth">
                Click the personnal space icon
                {' '}
                <InlineIcon Icon={Person} />
                {' '}
                to access your personnal space.
              </Trans>
            )
            : (
              <Trans i18nKey="tutorial.globalNavigation.unAuth">
                You must be signed in to access your personnal space, data, songlists, ...
                Click the personnal space icon
                {' '}
                <InlineIcon Icon={Person} />
                {' '}
                to sign in.
              </Trans>
            )}
        </>
      ),
    },
    searchSong: {
      title: t('tutorial.searchSong.title', 'Song search'),
      body: (
        <Trans i18nKey="tutorial.searchSong.1">
          Write any keyword from a title, an author, an editor,
          or a classification in the search field.
          <br />
          If you get too much results you are not interested in,
          add more keywords or open the advanced search options:
          <InlineIcon Icon={Settings} />
          .
          <br />
          Click on an option, then type your keyword inside
          the corresponding brackets &quot;[ ]&quot;. Add as many options as you want.
          <br />
          Ex: silence $before[1910] $authors[bach]
        </Trans>
      ),
    },
    sortList: {
      title: t('tutorial.sortList.title', 'Sort songs list'),
      body: (
        <Trans i18nKey="tutorial.sortList.1">
          In the advanced options, you will find a &quot;sort&quot; button.
          Click on it to enable sorting.
          <br />
          A sorting header will appear above the list:
          click on a sorting option to sort the list, and a second time to sort in reverse order.
          <br />
          Click a third time to remove this sorting, or on the close icon
          {' '}
          <InlineIcon Icon={Clear} />
          {' '}
          to leave the sorting options.
        </Trans>
      ),
    },
    chooseSong: {
      title: t('tutorial.chooseSong.title', 'Choosing a song'),
      body: (
        <Trans i18nKey="tutorial.chooseSong.1">
          Once a list of songs is displayed,
          you can choose the one you were looking for by clicking the check mark
          {' '}
          <InlineIcon Icon={Check} />
          {' '}
          at its right.
          <br />
          You may not be sure which one to choose:
          just click on one song elsewhere than on the check mark to have a closer look at it.
        </Trans>
      ),
    },
    favorites: {
      title: t('tutorial.favorites.title', 'Mark favorites songs'),
      body: (
        <>
          {isAutenticated
            ? (
              <Trans i18nKey="tutorial.favorites.auth">
                In the list, you can also click the &quot;Favorite&quot; icon
                {' '}
                <InlineIcon Icon={FavoriteBorder} />
                {' '}
                of a song to mark it as a favorite. Click once again to unmark it.
                <br />
                Among the advanced search options,
                a &quot;Favorites&quot; button allows you to only display your favorites songs.
              </Trans>
            )
            : (
              <Trans i18nKey="tutorial.favorites.unAuth">
                When you are connected, you can mark the songs you like as favorites,
                and display only your favorite songs thanks to a new advanced search option.
              </Trans>
            )}
        </>
      ),
    },
    displaySong: {
      title: t('tutorial.displaySong.title', 'Display a song'),
      body: (
        <Trans i18nKey="tutorial.displaySong.1">
          Click on the paragraphs you want to select them,
          or on the &quot;Select all&quot; button to select all of them.
          <br />
          Then click the check button
          {' '}
          <InlineIcon Icon={Check} />
          {' '}
          to display the song in the viewer.
          <br />
          There, you can use the
          {' '}
          <InlineIcon Icon={Add} />
          {' '}
          and
          {' '}
          <InlineIcon Icon={Remove} />
          {' '}
          button to change the font size, and the
          {' '}
          <InlineIcon Icon={Clear} />
          {' '}
          button to close the viewer.
        </Trans>
      ),
    },
    editSong: {
      title: t('tutorial.editSong.title', 'Song edition'),
      body: (
        <>
          {isAutenticated
            ? (
              <Trans i18nKey="tutorial.editSong.auth">
                Click the edit button
                {' '}
                <InlineIcon Icon={Edit} />
                {' '}
                to enter the edit mode.
                <br />
                Once you are done,
                click on the &quot;Save all&quot;
                or the &quot;Cancel all&quot; button to quit editing.
                <br />
                You can erase the edited song by clicking on the bottom delete icon
                {' '}
                <InlineIcon Icon={Delete} />
                .
              </Trans>
            )
            : (
              <Trans i18nKey="tutorial.editSong.unAuth">
                Once signed in, you will be able to edit and save the song here.
                <br />
                Click the personnal space icon
                {' '}
                <InlineIcon Icon={Person} />
                {' '}
                in the top right menu to sign in.
              </Trans>
            )}
        </>
      ),
    },
    editParagraph: {
      title: t('tutorial.editParagraph.title', 'Paragraph edition'),
      body: (
        <>
          {isAutenticated
            ? (
              <Trans i18nKey="tutorial.editParagraph.auth">
                Once you have entered the edit mode, choose a paragraph and click its edit button
                {' '}
                <InlineIcon Icon={Edit} />
                {' '}
                to edit it.
                <br />
                Make any change to it, then click on its check icon
                {' '}
                <InlineIcon Icon={Check} />
                {' '}
                to save or its cancel icon
                {' '}
                <InlineIcon Icon={Cancel} />
                {' '}
                to dismiss your changes.
                <br />
                You can delete this paragraph by clicking on its delete icon
                {' '}
                <InlineIcon Icon={Delete} />
                .
                <br />
                You can also click its up and down arrows
                {' '}
                <InlineIcon Icon={ArrowUpward} />
                <InlineIcon Icon={ArrowDownward} />
                {' '}
                move it up or down and reorder the song.
                <br />
                Finally, you can edit the titles and data about the song the same way,
                using the edit button
                {' '}
                <InlineIcon Icon={Edit} />
                {' '}
                next to the title.
              </Trans>
            )
            : (
              <Trans i18nKey="tutorial.editParagraph.unAuth">
                Once signed in, you will be able edit the titles, data, paragraphs,
                and reorder them as you wish here.
                <br />
                Click the personnal space icon
                {' '}
                <InlineIcon Icon={Person} />
                {' '}
                in the top right menu to sign in.
              </Trans>
            )}
        </>
      ),
    },
    signIn: {
      title: t('tutorial.signIn.title', 'Signing in'),
      body: (
        <Trans i18nKey="tutorial.signIn.1">
          If you already signed up, you just need to enter here the email adress you used to sign up
          in the email field, and the password you chose in the password field.
        </Trans>
      ),
    },
    signUp: {
      title: t('tutorial.signUp.title', 'Signing up'),
      body: (
        <Trans i18nKey="tutorial.signUp.1">
          If you have not signed up yet, to do so,
          you just need to enter a valid email adress in the email field,
          and enter a password you will remember in the password field.
          <br />
          Your password must be at least 6 characters long.
        </Trans>
      ),
    },
    notSignedUp: {
      title: t('tutorial.notSignedUp.title', 'If have not signed up yet'),
      body: (
        <Trans i18nKey="tutorial.notSignedUp.1">
          If you have not signed up yet, click the &quot;Need an account?&quot; link to sign up.
        </Trans>
      ),
    },
    alreadySignedUp: {
      title: t('tutorial.alreadySignedUp.title', 'If you have already signed up'),
      body: (
        <Trans i18nKey="tutorial.alreadySignedUp.1">
          If you already signed up, click the &quot;Already have an account?&quot; link to sign in.
        </Trans>
      ),
    },
  };

  return (
    <>
      <Typography gutterBottom variant="h3">{steps[stepName].title}</Typography>
      <Typography>{steps[stepName].body}</Typography>
    </>
  );
};

export default TutorialStepContent;
