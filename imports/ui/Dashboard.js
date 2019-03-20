import React from "react";

import PrivateHeader from "./PrivateHeader.js";

export default props => {
  return (
    <div>
      <PrivateHeader title="Dashboard" />
      <div className="page-content">
        Dashboard page content.
      </div>
    </div>
  );
};
