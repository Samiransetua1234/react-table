import React from "react";

function Header() {
  return (
    <header
      style={{
        height: "100px",
        border: "2px solid red",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:'blue',
        position:'absolute',
        top:0,
        width:'100%'
      }}
    >
      This is Header
    </header>
  );
}

export default Header;
