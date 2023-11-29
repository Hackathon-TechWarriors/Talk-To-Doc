import React from "react";
import "./chatLoader.scss";

export function ChatLoader() {
  return (
    <>
      <div id="container">
        <div id="loading-bubble" class="grey">
          <div class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
          </div>
        </div>
      </div>
    </>
  );
}
