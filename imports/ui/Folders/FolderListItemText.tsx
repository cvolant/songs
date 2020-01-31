import React, { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

import Typography from '@material-ui/core/Typography';

import { useDeviceSize } from '../../hooks/contexts/app-device-size-context';
import Songs from '../../api/songs/songs';

import { IFolder } from '../../types';
import { ListLayoutItemText } from '../ListLayout';
import CalendarDate from '../Utils/CalendarDate';

interface IFolderListItemTextProps {
  handleUnfold: MouseEventHandler<HTMLDivElement>;
  folder: IFolder;
  unfolded: boolean;
}

export const FolderListItemText: React.FC<IFolderListItemTextProps> = ({
  folder, handleUnfold, unfolded,
}) => {
  const { t } = useTranslation();
  const smallDevice = useDeviceSize('sm', 'down');

  const { date, name, songs } = folder;


  return (
    <ListLayoutItemText
      handleUnfold={handleUnfold}
      primary={name || <em>{t('folder.Untitled folder', 'Untitled folder')}</em>}
      rightSide={<CalendarDate date={date} />}
      secondary={(!smallDevice || unfolded) && (
        <Typography>
          {Songs.find({ _id: { $in: songs.map((song) => song._id) } }).map((song) => song.title).join(', ')}
        </Typography>
      )}
      unfolded={unfolded}
    />
  );
};

export default FolderListItemText;
