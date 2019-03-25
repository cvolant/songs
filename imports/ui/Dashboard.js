import React from "react";

import PrivateHeader from "./PrivateHeader.js";
import NoteList from './NoteList';
import Editor from "./Editor.js";

export default () => {
  return (
    <div>
      <PrivateHeader title="Dashboard" />
      <div className="page-content">
        <NoteList />
        <Editor />
      </div>
    </div>
  );
};
