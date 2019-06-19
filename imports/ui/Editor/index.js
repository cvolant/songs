import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';

import { Songs } from '../../api/songs';

import PrintSong from '../PrintSong';
import Paragraph from './Paragraph';
import Screen from '../Screen';
import Title from './Title';
import {
    Button,
    CardActions,
    CardContent,
    Fab,
    IconButton,
    Typography
} from '@material-ui/core';
import { Add, Check, Edit, Delete } from '@material-ui/icons';

const styles = theme => ({
    actions: {
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    button: {
        margin: theme.spacing(1),
        padding: theme.spacing(1, 1.5),
    },
    card: {
        margin: theme.spacing(1),
    },
    container: {
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
        overflow: 'auto',
        borderBottom: '1px solid',
        borderImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), gray, rgba(0, 0, 0, 0)) 100% 0%',
    },
    content: {
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap!important',
    },
    displayNone: {
        display: 'none',
    },
    bottomFab: {
        margin: theme.spacing(1),
    },
    fag: {
        position: 'absolute',
        bottom: '5rem',
        right: '8rem',
    },
    grow: {
        flexGrow: 1,
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
        rightIcon: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
    },
});


export class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false,
            editTitle: false,
            printSong: false,
            screenOpacity: 0,
            details: {},
            pg: [],
            pgStates: [],
            subtitle: '',
            title: '',
        };
        this.componentDidUpdate();
    };

    componentDidMount() {
        if (this.refs.title && this.refs.body) {
            if (this.props.song.title) {
                //                this.refs.body.focus();
            } else {
                //                this.refs.title.focus();
            }
        }
    }
    componentDidUpdate(prevProps, prevState) {
        const currentSongId = this.props.song ? this.props.song._id._str : undefined;
        const prevNodeId = prevProps && prevProps.song ? prevProps.song._id._str : undefined;

        if (currentSongId && currentSongId !== prevNodeId) {
            this.initSong(this.props.song);
        }
    }
    componentWillUnmount() {
        Session.set('selectedSongId', undefined);
    }

    createPgState(pgIndex, edit = false, selected = false) {
        const that = this;

        const pgState = { pgIndex, edit, selected };
        pgState.handlePgCancel = function () { that.handlePgCancel(this.pgIndex) }.bind(pgState);
        pgState.handleDeletePg = function () { that.handleDeletePg(this.pgIndex) }.bind(pgState);
        pgState.handleEditPg = function () { that.handleEditPg(this.pgIndex) }.bind(pgState);
        pgState.handleLabelChange = function (e) { that.handlePgChange(e.target, this.pgIndex, 'label') }.bind(pgState);
        pgState.handleMoveDown = function () { that.handleMove(this.pgIndex, 1) }.bind(pgState);
        pgState.handleMoveUp = function () { that.handleMove(this.pgIndex, -1) }.bind(pgState);
        pgState.handlePgChange = function (e) { that.handlePgChange(e.target, this.pgIndex, 'pg') }.bind(pgState);
        pgState.handleSelect = function (e) { that.handleSelect(e.target, this.pgIndex) }.bind(pgState);

        return pgState;
    }
    indexOfObject(array, objectProperty) {
        return array.map(e => e[Object.keys(objectProperty)[0]]).indexOf(Object.values(objectProperty)[0]);
    }


    initSong(song) {
        console.log('From Editor, initSong. song:', song);
        const pg = JSON.parse(JSON.stringify(song.pg));

        // Memory of moves and selections: pgStates order can change.
        //   pgStates[i].pgIndex: refer to the pg in his original position
        //   pgStates[i].selected
        const pgStates = [];
        let that = this;
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
        this.setState({
            details,
            edit: false,
            pg,
            pgStates,
            title: song.titre,
            subtitle: song.sousTitre,
        });
        this.componentDidMount();
    }


    handleAdd() {
        const pg = this.state.pg;
        const pgStates = this.state.pgStates;
        const pgLength = pg.length;
        pg.push({ label: '', pg: '' });
        pgStates.push(this.createPgState(pgLength, true, false));
        this.setState({ pg, pgStates });
    }
    handleCancelAll() {
        const formerPgStates = this.state.pgStates;
        if (this.props.song) {
            this.initSong(this.props.song);
            const pgStates = this.state.pgStates;
            formerPgStates.forEach(formerPgState => {
                if (formerPgState.selected) {
                    pgStates[formerPgState.pgIndex].selected = true;
                }
            });
            this.setState({ pgStates });
        }
    }
    handleCloseScreen() {
        this.props.viewer(null);
    }
    handleDelete() {
        this.props.meteorCall('songs.remove', this.props.song._id._str);
        this.props.setSelectedSongId(undefined);
    }
    handleDeletePg(pgIndex) {
        const pgStates = this.state.pgStates;
        const pgStateIndex = this.indexOfObject(pgStates, { pgIndex });
        console.log('From Editor, handleDeletePg. Before splice. pg:', this.state.pg, 'pgStates:', pgStates);
        pgStates.splice(pgStateIndex, 1);
        console.log('From Editor, handleDeletePg. After splice. pg:', this.state.pg, 'pgStates:', pgStates);
        this.setState({ pgStates });
    }
    handleDetailChange(e) {
        let details = JSON.parse(JSON.stringify(this.state.details));
        const { keyname, type } = e.target.attributes;
        console.log('From Editor, handleDetailChange. keyname.value:', keyname.value, ', type.value:', type.value);
        console.log('From Editor, handleDetailChange. e.target.value:', e.target.value);
        console.log('From Editor, handleDetailChange. e.target.checked:', e.target.checked);
        if (type.value === 'bool') {
            details[e.target.attributes.keyname.value].value = !e.target.checked;
        } else if (type.value === 'number') {
            const readValue = e.target.value;
            let value = '';
            for (let i = 0; i < readValue.length; i++) {
                if (!isNaN(readValue[i])) value += readValue[i];
            }
            details[e.target.attributes.keyname.value].value = value;
        } else {
            details[e.target.attributes.keyname.value].value = e.target.value;
        }
        this.setState({ details });
    }
    handleEditPg(pgIndex) {
        const pgStates = this.state.pgStates;
        const pgStateIndex = this.indexOfObject(pgStates, { pgIndex });
        pgStates[pgStateIndex].edit = !pgStates[pgStateIndex].edit;
        this.setState({ pgStates });
    }
    handleEditTitle() {
        this.setState((formerState, formerProps) => ({ editTitle: !formerState.editTitle }));
    }
    handleMove(pgIndex, movement) {
        let previousPgStates = this.state.pgStates;
        console.log('From Editor => handleMove. movement:', movement, 'previousPgStates:', previousPgStates);
        const previousPgStateIndex = this.indexOfObject(previousPgStates, { pgIndex });
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
            ...previousPgStates.slice(pgStateIndex)
        ];
        console.log('From Editor => handleMove. After. pgStates:', pgStates);
        this.setState({ pgStates });
    }
    handleOpenScreen() {
        this.setState({ printSong: true })
        setTimeout(() => this.setState({ screenOpacity: 1 }), 10);

        this.props.viewer(
            <Screen
                closeScreen={this.handleCloseScreen.bind(this)}
                opacity={this.state.screenOpacity}
                print={zoom => <PrintSong
                    zoom={zoom}
                    song={{
                        title: this.state.title,
                        subtitle: this.state.subtitle,
                        pg: this.state.pgStates.filter(pgState => pgState.selected).map(pgState => this.state.pg[pgState.pgIndex]),
                        ...this.state.details,
                    }}
                />}
            />
        );
    }
    handlePgCancel(pgIndex) {
        const pg = this.state.pg;
        console.log('From Editor, handlePgCancel. this.props.song.pg[pgIndex]:', this.props.song.pg[pgIndex]);
        pg[pgIndex] = this.props.song.pg[pgIndex];
        this.setState({ pg });
        this.handleEditPg(pgIndex);
    }
    handlePgChange(target, pgIndex, part) {
        let pg = JSON.parse(JSON.stringify(this.state.pg));
        pg[pgIndex][part] = target.value;
        this.setState({ pg });
    }
    handleSaveAll() {
        const pg = [];
        for (let i = 0; i < this.state.pgStates.length; i++) {
            pg.push(this.state.pg[this.state.pgStates[i].pgIndex]);
        }
        const updates = {
            pg,
            annee: this.state.details.year.value,
            auteur: this.state.details.author.value,
            cote: this.state.details.classification.value,
            cnpl: this.state.details.cnpl.value,
            compositeur: this.state.details.compositor.value,
            editeur: this.state.details.editor.value,
            number: this.state.details.number.value,
            nouvelleCote: this.state.details.newClassification.value,
            sousTitre: this.state.subtitle,
            titre: this.state.title,
        };
        console.log('From Editor, handleSaveAll. details:', updates);
        this.props.meteorCall('songs.update', this.props.song._id._str, updates);
        this.setState({ edit: false });
    }
    handleSelect(target, index) {
        if (!['path', 'button', 'svg'].includes(target.localName)) {
            const pgStates = this.state.pgStates;
            pgStates[index].selected = !pgStates[index].selected;
            this.setState({ pgStates });
        }
    }
    handleToggleSelectAll() {
        const pgStates = this.state.pgStates;
        const alreadySelected = this.state.pgStates.filter(pgState => pgState.selected).length;
        pgStates.forEach(pgState => pgState.selected = !alreadySelected);
        this.setState({ pgStates });
    }
    handleTitleCancel() {
        const song = this.props.song;
        const details = this.state.details;
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
            title: song.titre
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
        const { classes } = this.props;
        if (this.props.song) {
            return (
                <React.Fragment>
                    <div className={classes.container}>
                        <CardContent className={classes.content}>
                            <Title
                                edit={this.state.editTitle}
                                editGlobal={this.state.edit}
                                details={this.state.details}
                                title={this.state.title}
                                subtitle={this.state.subtitle}
                                handleEditTitle={this.handleEditTitle.bind(this)}
                                handleTitleChange={this.handleTitleChange.bind(this)}
                                handleSubtitleChange={this.handleSubtitleChange.bind(this)}
                                handleDetailChange={this.handleDetailChange.bind(this)}
                                handleTitleCancel={this.handleTitleCancel.bind(this)}
                            />
                            {this.state.pg.length > 0 ?
                                this.state.pgStates.map(
                                    pgState => (
                                        <Paragraph
                                            key={pgState.pgIndex}
                                            paragraph={this.state.pg[pgState.pgIndex]}
                                            editGlobal={this.state.edit}
                                            {...pgState}
                                        />
                                    )
                                )
                                :
                                <p>No lyrics</p>
                            }
                            <Button
                                variant='contained'
                                className={`${classes.button} ${this.state.edit ? '' : classes.displayNone}`}
                                onClick={this.handleAdd.bind(this)}
                            >
                                <Add />
                            </Button>
                        </CardContent>
                    </div>
                    <CardActions className={classes.actions}>
                        {this.state.edit ?
                            <React.Fragment>
                                <IconButton
                                    onClick={this.handleDelete.bind(this)}
                                >
                                    <Delete />
                                </IconButton>
                                <div>
                                    <Button
                                        variant='outlined'
                                        className={classes.button}
                                        onClick={this.handleCancelAll.bind(this)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant='outlined'
                                        className={classes.button}
                                        color='primary'
                                        onClick={this.handleSaveAll.bind(this)}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <Typography variant="body1" className={classes.grow}>
                                    Select the paragraphs you want...
                                </Typography>
                                <Fab
                                    aria-label="Edit"
                                    className={classes.bottomFab}
                                    onClick={() => this.setState({ edit: true })}
                                >
                                    <Edit />
                                </Fab>
                                <Fab
                                    variant="extended"
                                    aria-label="Edit"
                                    className={classes.bottomFab}
                                    onClick={this.handleToggleSelectAll.bind(this)}
                                >
                                    Select / unselect all
                                    </Fab>
                                <Fab
                                    className={classes.bottomFab}
                                    color='primary'
                                    disabled={!this.state.pgStates.filter(pgState => pgState.selected).length}
                                    onClick={this.handleOpenScreen.bind(this)}
                                >
                                    <Check />
                                </Fab>
                            </React.Fragment>
                        }
                    </CardActions>
                </React.Fragment>
            );
        } else {
            return (
                <div className='editor__message'>
                    {(this.props.selectedSongId) ?
                        <Typography variant="body1" color="inherit" className={classes.grow}>
                            No song found yet.
                        </Typography>
                        :
                        <Typography variant="body1" color="inherit" className={classes.grow}>
                            Pick or create a song to get started.
                        </Typography>
                    }
                </div>
            );
        }
    }
}

Editor.propTypes = {
    classes: PropTypes.object.isRequired,
    setSelectedSongId: PropTypes.func.isRequired,
    meteorCall: PropTypes.func.isRequired,
    selectedSongId: PropTypes.string,
    song: PropTypes.object,
    viewer: PropTypes.func.isRequired,
}

export default withTracker(props => {
    const selectedSongId = Session.get('selectedSongId');
    const setSelectedSongId = newId => Session.set('selectedSongId', newId);

    return {
        selectedSongId,
        setSelectedSongId,
        meteorCall: Meteor.call,
        song: Songs.findOne(new Meteor.Collection.ObjectID(selectedSongId))
    };
})(withStyles(styles)(Editor));