import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { withTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import SelectAll from '@material-ui/icons/SelectAll';

import { useDeviceSize } from '../../hooks/contexts/app-device-size-context';
import { useUser } from '../../hooks/contexts/app-user-context';
import AddSongTo from './AddSongTo';
import FullCardLayout from '../utils/FullCardLayout';
import NoLyrics from './NoLyrics';
import Paragraph from './Paragraph';
import Title from './Title';
import { createDetails, IDetails, IDetailTarget } from './Detail';

import {
  IFolder,
  IParagraph,
  ISong,
  IUnfetched,
  IUser,
} from '../../types';
import { IPgState } from '../../types/songTypes';
import {
  IArrayIconButtonProps,
  IIconButtonProps,
  IIconButtonCallback,
} from '../../types/iconButtonTypes';

import Songs from '../../api/songs/songs';
import Folders from '../../api/folders/folders';
import { userCreatedSongRemove } from '../../api/users/methods';
import { songsUpdate } from '../../api/songs/methods';


const useStyles = makeStyles((theme) => ({
  actions: {
    paddingBottom: 0,
  },
  button: {
    margin: theme.spacing(1),
    padding: theme.spacing(1, 1.5),
  },
  circularProgress: {
    width: '6rem',
    height: '6rem',
    position: 'relative',
    top: 'calc(50% - 6rem)',
    left: 'calc(50% - 6rem)',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap', // !important ?
    overflowX: 'hidden',
    padding: '0',
  },
  displayNone: {
    display: 'none',
  },
  lyrics: {
    marginBottom: theme.spacing(2),
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(-2),
    },
    width: '100%',
  },
}));

interface IEditorProps {
  actionIconButtonsProps?: IArrayIconButtonProps<IUnfetched<ISong>>[];
  edit?: boolean;
  fab?: IIconButtonProps<IUnfetched<ISong>>;
  goBack: () => void;
  logoMenuDeployed: boolean;
  song: IUnfetched<ISong>;
}
interface IEditorWTData {
  folders: IFolder[];
  song: IUnfetched<ISong>;
  user?: IUser;
}
interface IWrappedEditorProps
  extends IEditorProps, IEditorWTData { }

const createPgState = (pgStateProps: Partial<IPgState>): IPgState => {
  const pgState = {
    pgIndex: 0,
    edit: false,
    selected: false,
    ...pgStateProps,
  };
  return pgState;
};

export const WrappedEditor: React.FC<IWrappedEditorProps> = ({
  actionIconButtonsProps,
  edit: initEdit = false,
  folders,
  goBack,
  logoMenuDeployed,
  song,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const user = useUser();
  const smallDevice = useDeviceSize('sm', 'down');

  const [edit, setEdit] = useState(initEdit);
  const [editTitle, setEditTitle] = useState(false);
  const [details, setDetails] = useState(createDetails({}));
  const [lyrics, setLyrics] = useState<IParagraph[]>(song.lyrics || []);
  const [pgStates, setPgStates] = useState<IPgState[]>([]);
  const [title, setTitle] = useState(song.title || '');
  const [subtitle, setSubtitle] = useState(song.title || '');
  const [open, setOpen] = useState(false);

  const handleClickOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const indexOfObject = (
    array: Record<string | number, number | string | boolean>[],
    objectProperty: Record<string | number, number | string | boolean>,
  ): number => array
    .map((element) => element[Object.keys(objectProperty)[0]])
    .indexOf(Object.values(objectProperty)[0]);

  const handleDelete = (): void => {
    userCreatedSongRemove.call({ _id: song._id });
    goBack();
  };

  const handleDeletePg = (pgIndex: number): void => {
    const pgStateIndex = indexOfObject(pgStates, { pgIndex });
    const newPgStates = [...pgStates];
    newPgStates.splice(pgStateIndex, 1);
    setPgStates(newPgStates);
  };

  const handleDetailChange = (target: IDetailTarget): void => {
    console.log('From Editor, handleDetailChange. target:', target);
    const {
      attributes: {
        name: {
          value: detailKeyName,
        },
      },
      checked,
      value: targetValue,
    } = target;
    const detailType = details[detailKeyName as keyof IDetails].type;

    const newDetails = JSON.parse(JSON.stringify(details));
    if (detailType === 'bool') {
      newDetails[detailKeyName].value = !checked;
    } else if (detailType === 'number') {
      const value = (
        Number.isInteger(targetValue as number) && targetValue
      ) || (
        Number.isInteger(parseInt(targetValue as string, 10)) && parseInt(targetValue as string, 10)
      ) || undefined;
      newDetails[detailKeyName].value = value;
    } else {
      newDetails[detailKeyName].value = targetValue;
    }
    setDetails(newDetails);
  };

  const handleEditPg = (pgIndex: number): void => {
    const pgStateIndex = indexOfObject(pgStates, { pgIndex });
    console.log('From Editor, handleEditPg. pgIndex:', pgIndex, 'title:', title, 'pgStates:', pgStates, 'pgStateIndex:', pgStateIndex);
    const newPgStates = JSON.parse(JSON.stringify(pgStates));
    newPgStates[pgStateIndex].edit = !pgStates[pgStateIndex].edit;
    setPgStates(newPgStates);
  };

  const handleEditSong = (): void => {
    if (!!Meteor.userId() && Meteor.userId() === song.userId) {
      setEdit(!edit);
    }
  };

  const handleEditTitle = (): void => {
    setEditTitle(!editTitle);
  };

  const handleMove = (pgIndex: number, movement: number): void => {
    console.log('From Editor => handleMove. movement:', movement, 'pgStates:', pgStates);
    const pgStateIndex = indexOfObject(pgStates, { pgIndex });
    const movedPgState = pgStates.splice(pgStateIndex, 1);
    let newPgStateIndex = pgStateIndex + movement;
    if (newPgStateIndex < 0) {
      newPgStateIndex = pgStates.length;
    } else if (newPgStateIndex > pgStates.length) {
      newPgStateIndex = 0;
    }
    console.log('From Editor => handleMove. pgStateIndex:', pgStateIndex);
    console.log('From Editor => handleMove. movedPgState:', movedPgState);
    console.log('From Editor => handleMove. spliced pgStates:', pgStates);
    const newPgStates = [
      ...pgStates.slice(0, newPgStateIndex),
      ...movedPgState,
      ...pgStates.slice(newPgStateIndex),
    ];
    console.log('From Editor => handleMove. After. pgStates:', pgStates);
    setPgStates(newPgStates);
  };

  const handlePgCancel = (pgIndex: number): void => {
    console.log('From Editor, handlePgCancel. song.lyrics:', song.lyrics, 'pgStates:', pgStates);
    if (song.lyrics) {
      const newLyrics = JSON.parse(JSON.stringify(lyrics));
      newLyrics[pgIndex] = song.lyrics[pgIndex];
      setLyrics(newLyrics);
    }
    handleEditPg(pgIndex);
  };

  const handlePgChange = (
    target: { value: string } | null,
    pgIndex: number,
    part: 'label' | 'pg',
  ): void => {
    console.log('From Editor, handlePgChange. target:', target, 'pgIndex:', pgIndex, 'part:', part);
    if (target) {
      const newLyrics = JSON.parse(JSON.stringify(lyrics));
      newLyrics[pgIndex][part] = target.value;
      setLyrics(newLyrics);
    }
  };

  const handleSaveAll = (): void => {
    if (title && pgStates.length) {
      const newLyrics = [];
      for (let i = 0; i < pgStates.length; i += 1) {
        newLyrics.push(lyrics[pgStates[i].pgIndex]);
      }
      const songUpdates = {
        _id: song._id,
        lyrics: newLyrics,
        year: details.year.value,
        author: details.author.value,
        classification: details.classification.value,
        cnpl: details.cnpl.value,
        compositor: details.compositor.value,
        editor: details.editor.value,
        number: details.number.value,
        newClassification: details.newClassification.value,
        subtitle,
        title,
      };
      console.log('From Editor, handleSaveAll. details:', songUpdates);
      songsUpdate.call({ songUpdates });
      setEdit(false);
    }
  };

  const handleSelect = (target: EventTarget | null, index: number): void => {
    if (target) {
      const { localName } = target as unknown as { localName: string };
      if (localName && !['path', 'button', 'svg'].includes(localName)) {
        const newPgStates = JSON.parse(JSON.stringify(pgStates)) as IPgState[];
        newPgStates[index].selected = !pgStates[index].selected;
        setPgStates(newPgStates);
      }
    }
  };

  const handleToggleSelectAll = (callback?: (err: Meteor.Error, res: void) => void) => (): void => {
    const alreadySelected = pgStates.filter((pgState) => pgState.selected).length;
    const newPgStates = pgStates.map((pgState: IPgState) => {
      const newPgState = pgState;
      newPgState.selected = !alreadySelected;
      return newPgState;
    });
    setPgStates(newPgStates);
    if (callback) {
      callback(undefined as unknown as Meteor.Error);
    }
  };

  const handleTitleCancel = (): void => {
    const newDetails = JSON.parse(JSON.stringify(details));
    newDetails.author.value = song.author;
    newDetails.cnpl.value = song.cnpl;
    newDetails.classification.value = song.classification;
    newDetails.compositor.value = song.compositor;
    newDetails.editor.value = song.editor;
    newDetails.newClassification.value = song.newClassification;
    newDetails.number.value = song.number;
    newDetails.year.value = song.year;
    setDetails(newDetails);
    setTitle(song.title || '');
    setSubtitle(song.subtitle || '');
    handleEditTitle();
  };

  const handleSubtitleChange = (e: { currentTarget: { value: string } }): void => {
    const newSubtitle = e.currentTarget.value;
    setSubtitle(newSubtitle);
  };

  const handleTitleChange = (e: { currentTarget: { value: string } }): void => {
    const newTitle = e.currentTarget.value;
    setTitle(newTitle);
  };

  const initSong = (songToInit: IUnfetched<ISong>): {
    details: IDetails;
    edit: boolean;
    lyrics: IParagraph[];
    pgStates: IPgState[];
    title: string;
    subtitle: string;
  } => {
    console.log('From Editor, initSong. songToInit:', songToInit);
    const newLyrics = songToInit.lyrics
      ? JSON.parse(JSON.stringify(songToInit.lyrics))
      : []; // To copy song.lyrics properties in a new object.

    // Memory of moves and selections: pgStates order can change.
    //   pgStates[i].pgIndex: refer to the pg in his original position
    //   pgStates[i].selected
    const newPgStates = [] as IPgState[];
    newLyrics.forEach(() => {
      const l = newPgStates.length;
      const pgState = createPgState({
        pgIndex: l,
      });
      newPgStates.push(pgState);
    });
    const newDetails = createDetails({
      author: {
        value: songToInit.author || '',
      },
      classification: {
        value: songToInit.classification || '',
      },
      compositor: {
        value: songToInit.compositor || '',
      },
      editor: {
        value: songToInit.editor || '',
      },
      newClassification: {
        value: songToInit.newClassification || '',
      },
      number: {
        value: songToInit.number || 0,
      },
      year: {
        value: songToInit.year || 0,
      },
      cnpl: {
        value: !!songToInit.cnpl || false,
      },
    });
    const newStates = {
      details: newDetails,
      edit: false,
      lyrics: newLyrics,
      pgStates: newPgStates,
      title: songToInit.title || '',
      subtitle: songToInit.subtitle || '',
    };
    setTitle(newStates.title);
    setSubtitle(newStates.subtitle);
    setLyrics(newStates.lyrics);
    setPgStates(newStates.pgStates);
    setDetails(newStates.details);
    console.log('From Editor, initSong. newStates:', newStates);
    return (newStates);
  };

  const handleAddPg = (): void => {
    const pgLength = lyrics.length;
    const newLyrics = [...lyrics];
    const newPgStates = [...pgStates];
    newLyrics.push({ label: 'paragraph', pg: '', index: pgLength });
    newPgStates.push(createPgState({
      pgIndex: pgLength,
      edit: true,
    }));
    setPgStates(newPgStates);
    setLyrics(newLyrics);
  };

  const handleCancelAll = (): void => {
    if (song._id && song.title) {
      const formerPgStates = JSON.parse(JSON.stringify(pgStates));
      const { pgStates: newPgStates } = initSong(song);
      formerPgStates.forEach((formerPgState: IPgState) => {
        if (formerPgState.selected) {
          newPgStates[formerPgState.pgIndex].selected = true;
        }
      });
      setPgStates(newPgStates);
      setEdit(false);
    }
  };

  useEffect(() => {
    if (user) {
      const foldersSubscription = Meteor.subscribe('user.folders');
      console.log('From Editor, useEffect[user._id]. foldersSubscription:', foldersSubscription);
      return foldersSubscription.stop;
    }
    return (): void => { /* Empty function */ };
  }, [user]);

  useEffect(() => {
    if (song._id.toHexString()) {
      const songSubscription = Meteor.subscribe('song', song._id, () => {
        const newSong = Songs.findOne(song._id) as ISong;
        console.log('From Editor, useEffect[song._id.toHexString()], songSubscription callback. Songs.findOne(song._id):', newSong);
        if (!newSong) goBack();
        else initSong(newSong);
      });
      console.log('From Editor, useEffect[song._id.toHexString()]. songSubscription:', songSubscription);
      return songSubscription.stop;
    }
    return (): void => { /* Empty function */ };
  }, [goBack, song._id]);

  console.log('From Editor. lyrics:', lyrics, 'pgStates:', pgStates);

  if (song._id.toHexString()) {
    return (
      <>
        <Helmet>
          <title>{`Alleluia.plus - ${title}`}</title>
        </Helmet>
        <FullCardLayout<IUnfetched<ISong>>
          actions={[
            undefined && {/* <EditorButtons
              actionIconButtonsProps={actionIconButtonsProps}
              edit={edit}
              folders={folders}
              handleCancelAll={handleCancelAll}
              handleDelete={handleDelete}
              handleEditSong={handleEditSong}
              handleSaveAll={handleSaveAll}
              handleToggleSelectAll={handleToggleSelectAll}
              isThereParagraphs={!!pgStates.length}
              isThereTitle={!!title}
              selectedPg={pgStates
                .filter((pgState) => pgState.selected)
                .map((pgState) => (lyrics[pgState.pgIndex]))}
              song={song}
            /> */},
            ...edit
              ? [
                {
                  Component: IconButton,
                  Icon: Delete,
                  key: 'delete',
                  label: t('Delete'),
                  onClick: handleDelete,
                },
                {
                  Component: Button,
                  key: 'cancel-all',
                  label: t('editor.Cancel all', 'Cancel all'),
                  labelVisible: true,
                  onClick: handleCancelAll,
                },
                {
                  color: 'primary',
                  Component: Button,
                  disabled: !title,
                  key: 'save-all',
                  label: t('editor.Save all', 'Save all'),
                  labelVisible: true,
                  onClick: handleSaveAll,
                },
              ]
              : [
                user && user._id && user._id === song.userId && {
                  Component: Button,
                  Icon: Edit,
                  key: 'edit',
                  label: t('editor.Edit', 'Edit'),
                  labelVisible: !smallDevice,
                  onClick: handleEditSong,
                },
                user && user._id && {
                  Component: Button,
                  key: 'add',
                  label: t('Add'),
                  onClick: handleClickOpen,
                  labelVisible: !smallDevice,
                  Icon: Add,
                },
                ...actionIconButtonsProps || [],
              ],
          ]}
          actionsProps={{ className: classes.actions }}
          className={classes.root}
          contentProps={{ className: classes.content }}
          element={song}
          fabs={{
            disabled: !pgStates.length,
            Icon: SelectAll,
            label: pgStates.filter((pgState) => pgState.selected).length
              ? t('editor.Unselect all', 'Unselect all')
              : t('editor.Select all', 'Select all'),
            labelVisible: true,
            onClick: {
              build: ({ callback }: {
                callback?: IIconButtonCallback;
              }): () => void => handleToggleSelectAll(callback),
              callback: true,
            },
          }}
          handleReturn={goBack}
          otherParams={{ isThereSelected: pgStates.filter((pgState) => pgState.selected).length }}
        >
          {title
            ? [
              <Title
                edit={editTitle}
                editGlobal={edit}
                details={details}
                handleEditTitle={handleEditTitle}
                handleTitleChange={handleTitleChange}
                handleSubtitleChange={handleSubtitleChange}
                handleDetailChange={handleDetailChange}
                handleTitleCancel={handleTitleCancel}
                key="title"
                logoMenuDeployed={logoMenuDeployed}
                subtitle={subtitle}
                title={title}
              />,
              <Grid className={classes.lyrics} container key="lyrics" spacing={1}>
                {pgStates.length > 0
                  ? pgStates.map(
                    (pgState) => (
                      <Paragraph
                        key={pgState.pgIndex}
                        paragraph={lyrics[pgState.pgIndex]}
                        editGlobal={edit}
                        edit={pgState.edit}
                        selected={pgState.selected}
                        handleDeletePg={(): void => { handleDeletePg(pgState.pgIndex); }}
                        handleEditPg={(): void => { handleEditPg(pgState.pgIndex); }}
                        handleLabelChange={(e): void => {
                          handlePgChange(e.target, pgState.pgIndex, 'label');
                        }}
                        handleMoveDown={(): void => { handleMove(pgState.pgIndex, 1); }}
                        handleMoveUp={(): void => { handleMove(pgState.pgIndex, -1); }}
                        handlePgCancel={(): void => { handlePgCancel(pgState.pgIndex); }}
                        handlePgChange={(e): void => {
                          handlePgChange(e.target, pgState.pgIndex, 'pg');
                        }}
                        handleSelect={(e): void => {
                          handleSelect(e.currentTarget, pgState.pgIndex);
                        }}
                      />
                    ),
                  )
                  : <NoLyrics />}
              </Grid>,
              <Button
                className={`${classes.button} ${edit ? '' : classes.displayNone}`}
                key="addParagraph"
                onClick={handleAddPg}
                variant="contained"
              >
                <Add />
              </Button>,
            ]
            : <CircularProgress className={classes.circularProgress} />}
        </FullCardLayout>
        <AddSongTo
          folders={folders}
          open={open}
          onClose={handleClose}
          song={song}
        />
      </>
    );
  }
  return null;
};

export const Editor = withTracker<IEditorWTData, IEditorProps>(({
  song: propsSong,
}: { song: IUnfetched<ISong> }) => {
  console.log('From Editor, withTracker. Songs:', Songs);
  return ({
    song: { ...propsSong, ...(Songs.findOne(propsSong._id) as ISong) },
    user: Meteor.user() as IUser | undefined,
    folders: Folders.find({}).fetch(),
  });
})(WrappedEditor);

export default Editor;
