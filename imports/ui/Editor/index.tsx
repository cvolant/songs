import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { withTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Add from '@material-ui/icons/Add';

import { Songs, ISong } from '../../api/songs';

import PrintSong from '../PrintSong';
import Paragraph, { IParagraph } from './Paragraph';
import Screen from '../Screen';
import Title from './Title';
import EditorButtons from './EditorButtons';
import { createDetails, IDetails, IDetailTarget } from './Detail';

const useStyles = makeStyles((theme) => ({
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
  container: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    overflowY: 'scroll',
    overflowScrolling: 'touch',
    borderWidth: '0 0 1px 0',
    borderColor: 'transparent',
    borderStyle: 'solid',
    borderImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), gray, rgba(0, 0, 0, 0)) 100% 0%',
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
  },
  waitingContent: {
    height: '100%',
  },
}));

interface IEditorProps {
  goBack: () => void;
  logoMenuDeployed: boolean;
  song: ISong;
  viewer: (content: JSX.Element | null) => void;
}
interface IEditorWTData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meteorCall: (method: string, ...rest: any[]) => void;
  song: ISong;
}
interface IWrappedEditorProps
  extends IEditorProps, IEditorWTData {}

interface IPgState {
  [key: string]: number | boolean;
  pgIndex: number;
  selected: boolean;
  edit: boolean;
}
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
  goBack,
  meteorCall,
  logoMenuDeployed,
  song,
  viewer,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [edit, setEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const [details, setDetails] = useState(createDetails({}));
  const [pg, setPg] = useState<IParagraph[]>([]);
  const [pgStates, setPgStates] = useState<IPgState[]>([]);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');

  const indexOfObject = (
    array: Record<string | number, number | string | boolean>[],
    objectProperty: Record<string | number, number | string | boolean>,
  ): number => array
    .map((element) => element[Object.keys(objectProperty)[0]])
    .indexOf(Object.values(objectProperty)[0]);

  const handleCloseScreen = (): void => {
    viewer(null);
  };

  const handleDelete = (): void => {
    meteorCall('songs.remove', song._id.toHexString());
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
          value: nameValue,
        },
        type: {
          value: typeValue,
        },
      },
      checked,
      value: targetValue,
    } = target;
    const newDetails = JSON.parse(JSON.stringify(details));
    if (typeValue === 'bool') {
      newDetails[nameValue].value = !checked;
    } else if (typeValue === 'number') {
      const readValue = targetValue as string;
      let value = '';
      for (let i = 0; i < readValue.length; i += 1) {
        if (!Number.isNaN(parseInt(readValue[i], 10))) value += readValue[i];
      }
      newDetails[nameValue].value = value;
    } else {
      newDetails[nameValue].value = targetValue;
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

  const handleOpenScreen = (): void => {
    console.log('From Editor, handleOpenScreen. title:', title, 'pgStates:', pgStates);
    viewer(
      <Screen
        closeScreen={handleCloseScreen}
        print={(zoom: number): JSX.Element => (
          <PrintSong
            zoom={zoom}
            song={{
              title,
              subtitle,
              pg: pgStates
                .filter((pgState) => pgState.selected)
                .map((pgState) => (pg[pgState.pgIndex])),
              ...details,
            }}
          />
        )}
      />,
    );
  };

  const handlePgCancel = (pgIndex: number): void => {
    if (song.pg) {
      console.log('From Editor, handlePgCancel. song.pg[pgIndex]:', song.pg[pgIndex]);
      const newPg = JSON.parse(JSON.stringify(pg));
      newPg[pgIndex] = song.pg[pgIndex];
      setPg(newPg);
      handleEditPg(pgIndex);
    }
  };

  const handlePgChange = (
    target: { value: string } | null,
    pgIndex: number,
    part: 'label' | 'pg',
  ): void => {
    if (target) {
      const newPg = JSON.parse(JSON.stringify(pg));
      newPg[pgIndex][part] = target.value;
      setPg(newPg);
    }
  };

  const handleSaveAll = (): void => {
    const newPg = [];
    for (let i = 0; i < pgStates.length; i += 1) {
      newPg.push(pg[pgStates[i].pgIndex]);
    }
    const updates = {
      pg: newPg,
      annee: details.year.value,
      auteur: details.author.value,
      cote: details.classification.value,
      cnpl: details.cnpl.value,
      compositeur: details.compositor.value,
      editeur: details.editor.value,
      number: details.number.value,
      nouvelleCote: details.newClassification.value,
      sousTitre: subtitle,
      titre: title,
    };
    console.log('From Editor, handleSaveAll. details:', updates);
    meteorCall('songs.update', song._id.toHexString(), updates);
    setEdit(false);
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

  const handleToggleSelectAll = (): void => {
    const alreadySelected = pgStates.filter((pgState) => pgState.selected).length;
    const newPgStates = pgStates.map((pgState: IPgState) => {
      const newPgState = pgState;
      newPgState.selected = !alreadySelected;
      return newPgState;
    });
    setPgStates(newPgStates);
  };

  const handleTitleCancel = (): void => {
    const newDetails = JSON.parse(JSON.stringify(details));
    newDetails.author.value = song.auteur;
    newDetails.cnpl.value = song.cnpl;
    newDetails.classification.value = song.cote;
    newDetails.compositor.value = song.compositeur;
    newDetails.editor.value = song.editeur;
    newDetails.newClassification.value = song.nouvelleCote;
    newDetails.number.value = song.numero;
    newDetails.year.value = song.annee;
    setDetails(newDetails);
    setTitle(song.titre || '');
    setSubtitle(song.sousTitre || '');
    handleEditTitle();
  };

  const handleSubtitleChange = (e: { currentTarget: { value: string }}): void => {
    const newSubtitle = e.currentTarget.value;
    setSubtitle(newSubtitle);
  };

  const handleTitleChange = (e: { currentTarget: { value: string }}): void => {
    const newTitle = e.currentTarget.value;
    setTitle(newTitle);
  };

  const initSong = (ISongoInit: ISong): {
    details: IDetails;
    edit: boolean;
    pg: IParagraph;
    pgStates: IPgState[];
    title: string;
    subtitle: string;
  } => {
    console.log('From Editor, initSong. ISongoInit:', ISongoInit);
    const newPg = ISongoInit.pg
      ? JSON.parse(JSON.stringify(ISongoInit.pg))
      : []; // To copy song.pg properties in a new object.

    // Memory of moves and selections: pgStates order can change.
    //   pgStates[i].pgIndex: refer to the pg in his original position
    //   pgStates[i].selected
    const newPgStates = [] as IPgState[];
    newPg.forEach(() => {
      const l = newPgStates.length;
      const pgState = createPgState({
        pgIndex: l,
      });
      newPgStates.push(pgState);
    });
    const newDetails = createDetails({
      author: {
        value: ISongoInit.auteur || '',
      },
      classification: {
        value: ISongoInit.cote || '',
      },
      compositor: {
        value: ISongoInit.compositeur || '',
      },
      editor: {
        value: ISongoInit.editeur || '',
      },
      newClassification: {
        value: ISongoInit.nouvelleCote || '',
      },
      number: {
        value: ISongoInit.numero || 0,
      },
      year: {
        value: ISongoInit.annee || 0,
      },
      cnpl: {
        value: !!ISongoInit.cnpl || false,
      },
    });
    const newStates = {
      details: newDetails,
      edit: false,
      pg: newPg,
      pgStates: newPgStates,
      title: ISongoInit.titre || '',
      subtitle: ISongoInit.sousTitre || '',
    };
    setTitle(newStates.title);
    setSubtitle(newStates.subtitle);
    setPg(newStates.pg);
    setPgStates(newStates.pgStates);
    setDetails(newStates.details);
    console.log('From Editor, initSong. newStates:', newStates);
    return (newStates);
  };

  const handleAdd = (): void => {
    const pgLength = pg.length;
    const newPg = [...pg];
    const newPgStates = [...pgStates];
    newPg.push({ label: '', pg: '', index: pgLength });
    newPgStates.push(createPgState({
      pgIndex: pgLength,
      edit: true,
    }));
    setPgStates(newPgStates);
    setPg(newPg);
  };

  const handleCancelAll = (): void => {
    if (song) {
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
    if (song._id.toHexString()) {
      const subscription = Meteor.subscribe('song', song._id, () => {
        console.log('From Editor, useEffect, subscription callback. Songs.findOne(song._id):', Songs.findOne(song._id));
        const newSong = Songs.findOne(song._id) as ISong;
        if (!newSong) goBack();
        else initSong(newSong);
      });
      console.log('From Editor, useEffect. subscription:', subscription);
      return subscription.stop;
    }
    return (): void => {};
  }, [song._id.toHexString()]);

  if (song._id.toHexString()) {
    return (
      <>
        <Helmet>
          <title>{`Alleluia.plus - ${title}`}</title>
        </Helmet>
        <Card className={classes.root}>
          <div className={classes.container}>
            {title
              ? (
                <CardContent className={classes.content}>
                  <Title
                    edit={editTitle}
                    editGlobal={edit}
                    details={details}
                    title={title}
                    subtitle={subtitle}
                    handleEditTitle={handleEditTitle}
                    handleTitleChange={handleTitleChange}
                    handleSubtitleChange={handleSubtitleChange}
                    handleDetailChange={handleDetailChange}
                    handleTitleCancel={handleTitleCancel}
                    logoMenuDeployed={logoMenuDeployed}
                  />
                  <Grid className={classes.lyrics} container spacing={1}>
                    {pg.length > 0
                      ? pgStates.map(
                        (pgState) => (
                          <Paragraph
                            key={pgState.pgIndex}
                            paragraph={pg[pgState.pgIndex]}
                            editGlobal={edit}
                            edit={pgState.edit}
                            selected={pgState.selected}
                            handleDeletePg={(): void => { handleDeletePg(pgState.pgIndex); }}
                            handleEditPg={(): void => { handleEditPg(pgState.pgIndex); }}
                            handleLabelChange={(e): void => {
                              handlePgChange(e.currentTarget, pgState.pgIndex, 'label');
                            }}
                            handleMoveDown={(): void => { handleMove(pgState.pgIndex, 1); }}
                            handleMoveUp={(): void => { handleMove(pgState.pgIndex, -1); }}
                            handlePgCancel={(): void => { handlePgCancel(pgState.pgIndex); }}
                            handlePgChange={(e): void => {
                              handlePgChange(e.currentTarget, pgState.pgIndex, 'pg');
                            }}
                            handleSelect={(e): void => {
                              handleSelect(e.currentTarget, pgState.pgIndex);
                            }}
                          />
                        ),
                      )
                      : <p>{t('editor.No lyrics', 'No lyrics')}</p>}
                  </Grid>
                  <Button
                    variant="contained"
                    className={`${classes.button} ${edit ? '' : classes.displayNone}`}
                    onClick={handleAdd}
                  >
                    <Add />
                  </Button>
                </CardContent>
              )
              : (
                <CardContent className={classes.waitingContent}>
                  <CircularProgress className={classes.circularProgress} />
                </CardContent>
              )}
          </div>
          <EditorButtons
            edit={edit}
            goBack={goBack}
            handleDelete={handleDelete}
            handleCancelAll={handleCancelAll}
            handleOpenScreen={handleOpenScreen}
            handleSaveAll={handleSaveAll}
            handleToggleSelectAll={handleToggleSelectAll}
            isAuthenticated={!!Meteor.userId()}
            isThereParagraphs={!!pgStates.length}
            isThereSelected={!!pgStates.filter((pgState) => pgState.selected).length}
            setEdit={(setEditTo): void => setEdit(setEditTo)}
          />
        </Card>
      </>
    );
  }
  return null;
};

export const Editor = withTracker<IEditorWTData, IEditorProps>((props: { song: ISong }) => ({
  meteorCall: Meteor.call,
  song: { ...props.song, ...(Songs.findOne(props.song._id) as ISong) },
}))(WrappedEditor);

export default Editor;
