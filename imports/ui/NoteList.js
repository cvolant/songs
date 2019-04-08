import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { PropTypes } from 'prop-types';
import FlipMove from 'react-flip-move';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';

import { Notes } from '../api/notes';
import NoteListItem from './NoteListItem';
import NoteListHeader from './NoteListHeader';
import NoteListEmptyItem from './NoteListEmptyItem';

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.secondary.light,
    },
});

export const NoteList = props => {
    const { classes } = props;
    const [searchEntry, setSearchEntry] = useState('');
    const [delay, setDelay] = useState(undefined);

    const handleSearch = (e) => {
        const newEntry = e.target.value;
        setSearchEntry(newEntry);

        const specificEntries = newEntry.match(/\$\w+\[.*?(\]|\$|$)/g) || [];
        console.log('specificEntries:', specificEntries);

        let specificQueries = {};

        if (specificEntries.length > 0) {
            specificEntries.map(specificEntry => {
                const queryFirstChar = specificEntry.indexOf('[') + 1;
                const queryLastChar = specificEntry[specificEntry.length - 1] == ']' ? specificEntry.length - 1 : specificEntry.length;
                const field = specificEntry.substring(1, queryFirstChar - 1);
                const query = new RegExp(specificEntry.substring(queryFirstChar, queryLastChar), 'i');
                specificQueries[field] = query;
            });
            console.log('specificQueries:', specificQueries);
        }

        const globalQuery = newEntry.replace(/(\$.*?\[.*?(\]|\$|$))|\$\w+(\W|$)/g, '').replace(/(\W\w\W)|\W+/g, ' ').trim();
        
        ////////// Differer la recherche de qq secondes ////////////
        clearTimeout(delay);
        setDelay(setTimeout(() => {
            console.log('Time out');
            if(specificQueries === {}) Session.set('search', { globalQuery, specificQueries: '' });
            else Session.set('search', { globalQuery, specificQueries });
            props.filtre();
        }, 700));
    }
    
    return (
        <div className='item-list__container'>
            <NoteListHeader handleSearch={handleSearch} searchEntry={searchEntry} />
            <List component="nav" className='item-list'>
                {props.notes.length === 0 ?
                    <NoteListEmptyItem />
                    :
                    <FlipMove maintainContainerHeight={true}>
                        {props.notes.map(note => {
                            return (
                                <NoteListItem key={note._id} note={note} />
                            );
                        })}
                    </FlipMove>
                }
            </List>
        </div>
    );
};

NoteList.propTypes = {
    notes: PropTypes.array.isRequired,
    filtre: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withTracker(props => {

    let subscription;
    subscription = Meteor.subscribe('notes', Session.get('search'));

    const filtre = () => {
        if (subscription) subscription.stop();
    }

    return {
        notes: Notes.find({}, { sort: { updatedAt: -1 } }).fetch(),
        filtre
    };
})(withStyles(styles)(NoteList));