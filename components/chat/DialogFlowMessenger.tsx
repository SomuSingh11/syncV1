"use client";

import { useEffect } from "react";
import Script from "next/script";

const DialogFlowMessenger = () => {
  useEffect(() => {
    const dfMessenger = document.createElement("df-messenger");
    dfMessenger.setAttribute("project-id", "smartsearchapproval-7f28b");
    dfMessenger.setAttribute(
      "agent-id",
      "5c97e25d-ef09-41fe-b471-9b734a62d2ac"
    );
    dfMessenger.setAttribute("language-code", "en");
    dfMessenger.setAttribute("max-query-length", "-1");

    const chatBubble = document.createElement("df-messenger-chat-bubble");
    chatBubble.setAttribute("chat-title", "SyncCity-Assistant");
    dfMessenger.appendChild(chatBubble);

    document.body.appendChild(dfMessenger);

    const style = document.createElement("style");
    style.textContent = `
      df-messenger {
        z-index: 999;
        position: fixed;
        --df-messenger-font-color: #000;
        --df-messenger-font-family: Google Sans;
        --df-messenger-chat-background: #f3f6fc;
        --df-messenger-message-user-background: #d3e3fd;
        --df-messenger-message-bot-background: #fff;
        top:626px;
        right:16px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.body.removeChild(dfMessenger);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      <Script
        src="https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js"
        strategy="afterInteractive"
      />
      <link
        rel="stylesheet"
        href="https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css"
      />
    </>
  );
};

export default DialogFlowMessenger;
