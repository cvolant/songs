import React, { createRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Clear from '@material-ui/icons/Clear';

import Editor from './Editor';
import PageLayout from '../Common/PageLayout';
import Screen from '../Station/Screen';

import { IEditedSong } from '../../types/songTypes';

interface ISongPageProps {
  slug: string;
}

export const SongPage: React.FC<ISongPageProps> = ({
  slug,
}) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [logoMenuDeployed, setLogoMenuDeployed] = useState(true);
  const contentAreaRef = createRef<HTMLDivElement>();
  const [viewSong, setViewSong] = useState<IEditedSong | undefined>();

  const handleCloseScreen = (): void => {
    setViewSong(undefined);
  };

  const handleOpenScreen = (song: IEditedSong) => (): void => {
    setViewSong(song);
  };

  const handleGoBackFromEditor = (): void => {
    history.goBack();
  };

  const handleToggleLogoMenu = (oc?: boolean) => (): void => {
    setLogoMenuDeployed(typeof oc === 'undefined' ? !logoMenuDeployed : oc);
  };

  // console.log('From SongPage. render.');

  return (viewSong
    ? (
      <Screen
        disableLogoMenu
        headerAction={{
          Icon: Clear,
          label: t('Close'),
          onClick: handleCloseScreen,
        }}
        headerSubheader={viewSong.subtitle}
        headerTitle={viewSong.title}
        song={viewSong}
        title={`Alleluia.plus - ${viewSong.title}`}
      />
    ) : (
      <PageLayout
        menuProps={{ handleToggleLogoMenu, logoMenuDeployed }}
        title={t('search.Search songs', 'Search songs')}
        tutorialContentName="Editor"
        contentAreaRef={contentAreaRef}
      >
        <Editor
          goBack={handleGoBackFromEditor}
          handleOpenScreen={handleOpenScreen}
          logoMenuDeployed={logoMenuDeployed}
          song={{ slug }}
        />
      </PageLayout>
    )
  );
};

export default SongPage;
