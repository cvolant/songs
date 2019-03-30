import React from "react";

import NoteList from './NoteList';
import Editor from "./Editor.js";
import ButtonAppBar from "./ButtonAppBar.js";

export default () => {
  return (
    <div>
      <ButtonAppBar title="Notes" />
      <div className="page-content">
        <div className='page-content__sidebar'>
          <NoteList />
        </div>
        <div className='page-content__main'>
          <Editor />
        </div>
      </div>
    </div>
  );
};
