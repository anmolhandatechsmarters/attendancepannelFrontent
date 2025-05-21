import "./ToolTip.scss";
import React from "react";

function ToolTip({ data, isShow, position, color }) {
  if (!isShow) return null;


  const top = position.top + window.pageYOffset - 30; 
  const left = position.left + window.pageXOffset + 10; 

  return (
    <div style={{ top, left, backgroundColor: color }} className="tooltip-wrapper">
      <p className="tooltip-label">{data.label}</p>
      <p className="tooltip-value">{data.raw}</p>
    </div>
  );
}

export default ToolTip;
