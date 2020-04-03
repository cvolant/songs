import React, { createRef, useState } from 'react';
import { useHistory, match as IMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Clear from '@material-ui/icons/Clear';

import Editor from './Editor';
import PageLayout from '../Common/PageLayout';
import Screen from '../Broadcast/Screen';

import { IEditedSong } from '../../types/songTypes';

interface ISongPageProps {
  match: IMatch<{ authorSlug?: string; titleSlug: string }>;
}

export const SongPage: React.FC<ISongPageProps> = ({
  match: { params: { authorSlug, titleSlug } },
}) => {
  const { t } = useTranslation();
  const history = useHistory();

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
        title={t('search.Search songs', 'Search songs')}
        tutorialContentName="Editor"
        contentAreaRef={contentAreaRef}
      >
        <Editor
          goBack={handleGoBackFromEditor}
          handleOpenScreen={handleOpenScreen}
          song={{ slug: (authorSlug ? `${authorSlug}/` : '') + titleSlug }}
        />
      </PageLayout>
    )
  );
};

export default SongPage;
