import React from "react";

const Sphere = () => {
  var elements = [];
  for(let i =0; i < 300; i++){
      elements.push(<div className="c" key={i} ></div>);
  }
  return <div className="wrap">{elements.map(e=> e)}</div>;
}

export default Sphere;
