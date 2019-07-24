import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Helmet } from "react-helmet";
import { PropTypes } from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';

import { Songs } from '../../api/songs';

import PrintSong from '../PrintSong';
import Paragraph from './Paragraph';
import Screen from '../Screen';
import Title from './Title';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Fab,
    Grid,
    IconButton,
    Typography
} from '@material-ui/core';
import { Add, ArrowBackIos, Check, Edit, Delete } from '@material-ui/icons';

const styles = theme => ({
    actions: {
        justifyContent: 'space-between',
        position: 'relative',
    },
    bottomFab: {
        margin: theme.spacing(0.5),
    },
    bottomFabs: {
        '& div': {
            display: 'flex',
        },
        [theme.breakpoints.down('sm')]: {
            position: 'absolute',
            right: 0,
            top: 0,
            verticalAlign: 'bottom',
            width: '100%',

            '& > div': {
                position: 'absolute',
                bottom: theme.spacing(0.25),
                right: 0,
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
            },
        },
    },
    button: {
        margin: theme.spacing(1),
        padding: theme.spacing(1, 1.5),
    },
    card: {
        margin: theme.spacing(1),
    },
    choiceFabs: {
        flexWrap: 'wrap-reverse',
        justifyContent: 'flex-end',
        alignItems: 'center',
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
    fag: {
        position: 'absolute',
        bottom: '5rem',
        right: '8rem',
    },
    grow: {
        flexGrow: 1,
    },
    instructions: {
        flexGrow: 1,
        textAlign: 'center',
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
    shadowTop: {
        position: 'absolute',
        height: 0,
        width: '100%',
        top: 0,
        left: 0,

        '& > div': {
            position: 'absolute',
            bottom: 0,
            height: theme.spacing(0.5),
            background: `linear-gradient(to top, ${theme.palette.grey['500']}, transparent)`,
            width: '100%',
            borderRadius: theme.spacing(0, 0, 0.5, 0.5),
        },
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
    waitingContent: {
        height: '100%',
    },
});


export class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subscription: undefined,
            editTitle: false,
            printSong: false,
            screenOpacity: 0,
            details: {},
            edit: false,
            pg: [],
            pgStates: [],
            title: '',
            subtitle: '',
            ...this.initSong(this.props.song),
        };
    };

    componentDidMount() {
        const subscription = Meteor.subscribe('song', this.props.song._id, function () {
            console.log('From Editor, componentDidMount, subscription callback. Songs.findOne(this.props.song._id):', Songs.findOne(this.props.song._id));
            if (!Songs.findOne(this.props.song._id)) this.props.goBack();
        }.bind(this));
        this.setState({ subscription });
        console.log('From Editor, componentDidMount. subscription:', subscription);
        /* 
                if (this.refs.title && this.refs.body) {
                    if (this.props.song.title) {
                        this.refs.body.focus();
                    } else {
                        this.refs.title.focus();
                    }
                }
         */
    }
    componentDidUpdate(prevProps, prevState) {
        const currentSongId = this.props.song ? this.props.song._id._str : undefined;
        const prevNodeId = prevProps && prevProps.song ? prevProps.song._id._str : undefined;

        if (currentSongId && currentSongId !== prevNodeId) {
            this.setState(this.initSong(this.props.song));
        }

        if (JSON.stringify(prevProps.song) != JSON.stringify(this.props.song)) {
            this.setState(this.initSong(this.props.song));
        }
    }
    componentWillUnmount() {
        if (this.state.subscription.stop) this.state.subscription.stop();
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
        if (!song || !song.pg) return;

        const t = this.props.t;
        console.log('From Editor, initSong. song:', song);
        const pg = JSON.parse(JSON.stringify(song.pg)); // To copy song.pg properties in a new object.

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
            this.setState({ pgStates, edit: false });
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
        if (this.props.song) {
            const { classes, goBack, logoMenuDeployed, t } = this.props;
            return (
                <React.Fragment>
                    <Helmet>
                        <title>{`Alleluia.plus - ${this.state.title}`}</title>
                    </Helmet>
                    <Card className={classes.root}>
                        <div className={classes.container}>
                            {this.state.title ?
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
                                        logoMenuDeployed={logoMenuDeployed}
                                    />
                                    <Grid className={classes.lyrics} container spacing={1}>
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
                                            <p>{t('editor.No lyrics', 'No lyrics')}</p>
                                        }
                                    </Grid>
                                    <Button
                                        variant='contained'
                                        className={`${classes.button} ${this.state.edit ? '' : classes.displayNone}`}
                                        onClick={this.handleAdd.bind(this)}
                                    >
                                        <Add />
                                    </Button>
                                </CardContent>
                                :
                                <CardContent className={classes.waitingContent}>
                                    <CircularProgress className={classes.circularProgress} />
                                </CardContent>
                            }
                        </div>
                        <CardActions className={classes.actions}>
                            <div className={classes.shadowTop}><div /></div>
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
                                            {t('editor.Cancel all', 'Cancel all')}
                                        </Button>
                                        <Button
                                            variant='outlined'
                                            className={classes.button}
                                            color='primary'
                                            onClick={this.handleSaveAll.bind(this)}
                                        >
                                            {t('editor.Save all', 'Save all')}
                                        </Button>
                                    </div>
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    <Button
                                        color='primary'
                                        onClick={() => goBack()}
                                        size='large'
                                        variant='outlined'
                                    >
                                        <ArrowBackIos />
                                        {t('editor.Return', 'Return')}
                                    </Button>
                                    <Typography variant="body1" className={classes.instructions}>
                                        {!this.state.pgStates.length ? '' :
                                            t('editor.Select paragraphs', 'Select paragraphs')
                                        }
                                    </Typography>
                                    <div className={classes.bottomFabs}>
                                        <div>
                                            {Meteor.userId() &&
                                                <Fab
                                                    aria-label={t("editor.Edit", "Edit")}
                                                    className={classes.bottomFab}
                                                    disabled={!this.state.title}
                                                    onClick={() => this.setState({ edit: true })}
                                                >
                                                    <Edit />
                                                </Fab>
                                            }
                                            <div className={classes.choiceFabs}>
                                                <Fab
                                                    aria-label={("editor.Select or unselect all", "Select or unselect all")}
                                                    disabled={!this.state.pgStates.length}
                                                    className={classes.bottomFab}
                                                    onClick={this.handleToggleSelectAll.bind(this)}
                                                    variant="extended"
                                                >
                                                    {!this.state.pgStates.filter(pgState => pgState.selected).length ? t('editor.Select all', 'Select all') : t('editor.Unselect all', 'Unselect all')}
                                                </Fab>
                                                <Fab
                                                    aria-label={("editor.Validate", "Validate")}
                                                    className={classes.bottomFab}
                                                    color='primary'
                                                    disabled={!this.state.pgStates.filter(pgState => pgState.selected).length}
                                                    onClick={this.handleOpenScreen.bind(this)}
                                                >
                                                    <Check />
                                                </Fab>
                                            </div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            }
                        </CardActions>
                    </Card>
                </React.Fragment>
            );
        }
    }
}

Editor.propTypes = {
    classes: PropTypes.object.isRequired,
    goBack: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
    meteorCall: PropTypes.func.isRequired,
    logoMenuDeployed: PropTypes.bool,
    song: PropTypes.object,
    t: PropTypes.func.isRequired,
    viewer: PropTypes.func.isRequired,
}

export default withTracker(props => ({
    meteorCall: Meteor.call,
    song: { ...props.song, ...Songs.findOne(props.song._id) },
}))(withStyles(styles)(withTranslation()(Editor)));