import React from "react";
import { Link } from "react-router-dom";

import LogoMenu from './LogoMenu';

export default () => {
  return (
    <div className="boxed-view">
      <LogoMenu />
      <div className="boxed-view__box">
        <h1>404 - Not found</h1>
        <p>... Hmmm, sorry! :/</p>
        <Link className='button button--link' to='/'>Head home</Link>
      </div>
    </div>
  );
};
