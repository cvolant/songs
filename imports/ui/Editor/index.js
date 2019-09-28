import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { withTranslation } from 'react-i18next';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Add from '@material-ui/icons/Add';

import { Songs } from '../../api/songs';

import PrintSong from '../PrintSong';
import Paragraph from './Paragraph';
import Screen from '../Screen';
import Title from './Title';
import EditorButtons from './EditorButtons';

const styles = (theme) => ({
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
    flexWrap: 'nowrap!important',
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
});


export class Editor extends React.Component {
  static indexOfObject(array, objectProperty) {
    return array
      .map((e) => e[Object.keys(objectProperty)[0]])
      .indexOf(Object.values(objectProperty)[0]);
  }

  constructor(props) {
    super(props);
    const { song } = props;
    this.state = {
      subscription: undefined,
      editTitle: false,
      screenOpacity: 0,
      details: {},
      edit: false,
      pg: [],
      pgStates: [],
      title: '',
      subtitle: '',
      ...this.initSong(song),
    };
  }

  componentDidMount() {
    const { song, goBack } = this.props;
    const subscription = Meteor.subscribe('song', song._id, () => {
      console.log('From Editor, componentDidMount, subscription callback. Songs.findOne(this.props.song._id):', Songs.findOne(song._id));
      if (!Songs.findOne(song._id)) goBack();
    });
    this.setState({ subscription });
    console.log('From Editor, componentDidMount. subscription:', subscription);
  }

  componentDidUpdate(prevProps, prevState) {
    const { song } = this.props;
    const currentSongId = song ? song._id._str : undefined;
    const prevNodeId = prevProps && prevProps.song ? prevProps.song._id._str : undefined;

    if (currentSongId && currentSongId !== prevNodeId) {
      this.setState(this.initSong(song));
    }

    if (JSON.stringify(prevProps.song) !== JSON.stringify(song)) {
      this.setState(this.initSong(song));
    }
  }

  componentWillUnmount() {
    const { subscription: { stop } } = this.state;
    if (stop) stop();
  }

  createPgState(pgIndex, edit = false, selected = false) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;

    const pgState = { pgIndex, edit, selected };
    pgState.handlePgCancel = function () {
      that.handlePgCancel(this.pgIndex);
    }.bind(pgState);
    pgState.handleDeletePg = function () {
      that.handleDeletePg(this.pgIndex);
    }.bind(pgState);
    pgState.handleEditPg = function () {
      that.handleEditPg(this.pgIndex);
    }.bind(pgState);
    pgState.handleLabelChange = function (e) {
      that.handlePgChange(e.target, this.pgIndex, 'label');
    }.bind(pgState);
    pgState.handleMoveDown = function () {
      that.handleMove(this.pgIndex, 1);
    }.bind(pgState);
    pgState.handleMoveUp = function () {
      that.handleMove(this.pgIndex, -1);
    }.bind(pgState);
    pgState.handlePgChange = function (e) {
      that.handlePgChange(e.target, this.pgIndex, 'pg');
    }.bind(pgState);
    pgState.handleSelect = function (e) {
      that.handleSelect(e.target, this.pgIndex);
    }.bind(pgState);

    return pgState;
  }


  initSong(song) {
    if (!song || !song.pg) return null;

    const { t } = this.props;
    console.log('From Editor, initSong. song:', song);
    const pg = JSON.parse(JSON.stringify(song.pg)); // To copy song.pg properties in a new object.

    // Memory of moves and selections: pgStates order can change.
    //   pgStates[i].pgIndex: refer to the pg in his original position
    //   pgStates[i].selected
    const pgStates = [];
    const that = this;
    pg.forEach(() => {
      const l = pgStates.length;
      const pgState = that.createPgState(l, false, false);
      pgStates.push(pgState);
    });
    const details = {
      author: {
        name: 'Author',
        type: 'string',
        value: song.auteur,
        max: 50,
      },
      classification: {
        name: 'Classification',
        type: 'string',
        value: song.cote,
        min: 0,
      },
      compositor: {
        name: 'Compositor',
        type: 'string',
        value: song.compositeur,
        max: 50,
      },
      editor: {
        name: 'Editor',
        type: 'string',
        value: song.editeur,
        max: 50,
      },
      newClassification: {
        name: 'New classification',
        type: 'string',
        value: song.nouvelleCote,
        min: 0,
      },
      number: {
        name: 'Number',
        type: 'number',
        value: song.numero,
        min: 0,
      },
      year: {
        name: 'Year',
        type: 'number',
        value: song.annee,
        min: 0,
        max: new Date().getFullYear(),
      },
      cnpl: {
        name: 'CNPL',
        type: 'bool',
        value: !!song.cnpl,
      },
    };
    console.log('From Editor, initSong. details:', details);
    return ({
      details,
      edit: false,
      pg,
      pgStates,
      title: song.titre,
      subtitle: song.sousTitre,
    });
  }


  handleAdd() {
    const { pg } = this.state;
    const { pgStates } = this.state;
    const pgLength = pg.length;
    pg.push({ label: '', pg: '' });
    pgStates.push(this.createPgState(pgLength, true, false));
    this.setState({ pg, pgStates });
  }

  handleCancelAll() {
    const {
      state: { pgStates: formerPgStates },
      props: { song },
    } = this;
    if (song) {
      this.initSong(song);
      const { pgStates } = this.state;
      formerPgStates.forEach((formerPgState) => {
        if (formerPgState.selected) {
          pgStates[formerPgState.pgIndex].selected = true;
        }
      });
      this.setState({ pgStates, edit: false });
    }
  }

  handleCloseScreen() {
    const { viewer } = this.props;
    viewer(null);
  }

  handleDelete() {
    const { meteorCall, song, setSelectedSongId } = this.props;
    meteorCall('songs.remove', song._id._str);
    setSelectedSongId(undefined);
  }

  handleDeletePg(pgIndex) {
    const { pg, pgStates } = this.state;
    const pgStateIndex = Editor.indexOfObject(pgStates, { pgIndex });
    console.log('From Editor, handleDeletePg. Before splice. pg:', pg, 'pgStates:', pgStates);
    pgStates.splice(pgStateIndex, 1);
    console.log('From Editor, handleDeletePg. After splice. pg:', pg, 'pgStates:', pgStates);
    this.setState({ pgStates });
  }

  handleDetailChange(e) {
    const { details } = this.state;
    const {
      target: {
        attributes: {
          keyname: {
            value: keynameValue,
          },
          type: {
            value: typeValue,
          },
        },
        checked,
        value: targetValue,
      },
    } = e;
    const detailsCopy = JSON.parse(JSON.stringify(details));
    if (typeValue === 'bool') {
      detailsCopy[keynameValue].value = !checked;
    } else if (typeValue === 'number') {
      const readValue = targetValue;
      let value = '';
      for (let i = 0; i < readValue.length; i += 1) {
        if (!isNaN(readValue[i])) value += readValue[i];
      }
      detailsCopy[keynameValue].value = value;
    } else {
      detailsCopy[keynameValue].value = targetValue;
    }
    this.setState({ details: detailsCopy });
  }

  handleEditPg(pgIndex) {
    const { pgStates } = this.state;
    const pgStateIndex = Editor.indexOfObject(pgStates, { pgIndex });
    pgStates[pgStateIndex].edit = !pgStates[pgStateIndex].edit;
    this.setState({ pgStates });
  }

  handleEditTitle() {
    this.setState((formerState, formerProps) => ({ editTitle: !formerState.editTitle }));
  }

  handleMove(pgIndex, movement) {
    const { pgStates: previousPgStates } = this.state;
    console.log('From Editor => handleMove. movement:', movement, 'previousPgStates:', previousPgStates);
    const previousPgStateIndex = Editor.indexOfObject(previousPgStates, { pgIndex });
    const movedPgState = previousPgStates.splice(previousPgStateIndex, 1);
    let pgStateIndex = previousPgStateIndex + movement;
    if (pgStateIndex < 0) {
      pgStateIndex = previousPgStates.length;
    } else if (pgStateIndex > previousPgStates.length) {
      pgStateIndex = 0;
    }
    console.log('From Editor => handleMove. previousPgStateIndex:', previousPgStateIndex);
    console.log('From Editor => handleMove. movedPgState:', movedPgState);
    console.log('From Editor => handleMove. spliced previousPgStates:', previousPgStates);
    const pgStates = [
      ...previousPgStates.slice(0, pgStateIndex),
      ...movedPgState,
      ...previousPgStates.slice(pgStateIndex),
    ];
    console.log('From Editor => handleMove. After. pgStates:', pgStates);
    this.setState({ pgStates });
  }

  handleOpenScreen() {
    setTimeout(() => this.setState({ screenOpacity: 1 }), 10);
    const {
      details,
      pg,
      pgStates,
      screenOpacity,
      subtitle,
      title,
    } = this.state;
    const { viewer } = this.props;

    viewer(
      <Screen
        closeScreen={this.handleCloseScreen.bind(this)}
        opacity={screenOpacity}
        print={(zoom) => (
          <PrintSong
            zoom={zoom}
            song={{
              title,
              subtitle,
              pg: pgStates
                .filter((pgState) => pgState.selected)
                .map((pgState) => pg[pgState.pgIndex]),
              ...details,
            }}
          />
        )}
      />,
    );
  }

  handlePgCancel(pgIndex) {
    const { pg: statePg } = this.state;
    const { song: { pg: propsPg } } = this.props;
    console.log('From Editor, handlePgCancel. this.props.song.pg[pgIndex]:', propsPg[pgIndex]);
    statePg[pgIndex] = propsPg[pgIndex];
    this.setState({ pg: statePg });
    this.handleEditPg(pgIndex);
  }

  handlePgChange(target, pgIndex, part) {
    const { pg: statePg } = this.state;
    const pg = JSON.parse(JSON.stringify(statePg));
    pg[pgIndex][part] = target.value;
    this.setState({ pg });
  }

  handleSaveAll() {
    const {
      details,
      statePg,
      pgStates,
      subtitle,
      title,
    } = this.state;
    const { meteorCall, song } = this.props;
    const pg = [];
    for (let i = 0; i < pgStates.length; i += 1) {
      pg.push(statePg[pgStates[i].pgIndex]);
    }
    const updates = {
      pg,
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
    meteorCall('songs.update', song._id._str, updates);
    this.setState({ edit: false });
  }

  handleSelect(target, index) {
    if (!['path', 'button', 'svg'].includes(target.localName)) {
      const { pgStates } = this.state;
      pgStates[index].selected = !pgStates[index].selected;
      this.setState({ pgStates });
    }
  }

  handleToggleSelectAll() {
    const { pgStates } = this.state;
    const alreadySelected = pgStates.filter((pgState) => pgState.selected).length;
    const newPgStates = pgStates.map((pgState) => {
      const newPgState = pgState;
      newPgState.selected = !alreadySelected;
      return newPgState;
    });
    this.setState({ pgStates: newPgStates });
  }

  handleTitleCancel() {
    const { song } = this.props;
    const { details } = this.state;
    details.author.value = song.auteur;
    details.cnpl.value = song.cnpl;
    details.classification.value = song.cote;
    details.compositor.value = song.compositeur;
    details.editor.value = song.editeur;
    details.newClassification.value = song.nouvelleCote;
    details.number.value = song.numero;
    details.year.value = song.annee;
    this.setState({
      details,
      subtitle: song.sousTitre,
      title: song.titre,
    });
    this.handleEditTitle();
  }

  handleSubtitleChange(e) {
    const subtitle = e.target.value;
    this.setState({ subtitle });
  }

  handleTitleChange(e) {
    const title = e.target.value;
    this.setState({ title });
  }


  render() {
    const {
      edit,
      editTitle,
      details,
      subtitle,
      title,
      pg,
      pgStates,
    } = this.state;
    const { song } = this.props;
    if (song) {
      const {
        classes, goBack, logoMenuDeployed, t,
      } = this.props;
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
                      handleEditTitle={this.handleEditTitle.bind(this)}
                      handleTitleChange={this.handleTitleChange.bind(this)}
                      handleSubtitleChange={this.handleSubtitleChange.bind(this)}
                      handleDetailChange={this.handleDetailChange.bind(this)}
                      handleTitleCancel={this.handleTitleCancel.bind(this)}
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
                              {...pgState}
                            />
                          ),
                        )
                        : <p>{t('editor.No lyrics', 'No lyrics')}</p>}
                    </Grid>
                    <Button
                      variant="contained"
                      className={`${classes.button} ${edit ? '' : classes.displayNone}`}
                      onClick={this.handleAdd.bind(this)}
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
              handleDelete={this.handleDelete.bind(this)}
              handleCancelAll={this.handleCancelAll.bind(this)}
              handleOpenScreen={this.handleOpenScreen.bind(this)}
              handleSaveAll={this.handleSaveAll.bind(this)}
              handleToggleSelectAll={this.handleToggleSelectAll.bind(this)}
              isAuthenticated={!!Meteor.userId()}
              isThereParagraphs={!!pgStates.length}
              isThereSelected={!!pgStates.filter((pgState) => pgState.selected).length}
              setEdit={(setEditTo) => this.setState({ edit: setEditTo })}
            />
          </Card>
        </>
      );
    }
    return null;
  }
}

Editor.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired,
  goBack: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  i18n: PropTypes.object.isRequired,
  meteorCall: PropTypes.func.isRequired,
  logoMenuDeployed: PropTypes.bool,
  setSelectedSongId: PropTypes.bool,
  song: PropTypes.shape({
    _id: PropTypes.string,
    auteur: PropTypes.string,
    cnpl: PropTypes.bool,
    cote: PropTypes.string,
    compositeur: PropTypes.string,
    editeur: PropTypes.string,
    nouvelleCote: PropTypes.string,
    numero: PropTypes.number,
    annee: PropTypes.number,
    sousTitre: PropTypes.string,
    titre: PropTypes.string,
    pg: PropTypes.array,
  }),
  t: PropTypes.func.isRequired,
  viewer: PropTypes.func.isRequired,
};

export default withTracker((props) => ({
  meteorCall: Meteor.call,
  song: { ...props.song, ...Songs.findOne(props.song._id) },
}))(withStyles(styles)(withTranslation()(Editor)));
