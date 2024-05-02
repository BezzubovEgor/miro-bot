"use client";

import Artyom from "artyom.js";
import { useState } from "react";
import { IconButton, IconMicrophone } from "@mirohq/design-system";

import { AIService } from "../model/services/client/AIService";

let artyom: Artyom;

if (typeof window !== "undefined") {
  artyom = new Artyom();

  const commandHello = {
    indexes: [
      "miro test *",
      "mirror test *",
      "mira test *",
      "neuro test *",
      "miro tests *",
      "mirror tests *",
      "mira tests *",
      "neuro tests *",

      "hey miro *",
      "hey mirror *",
      "hey mira *",
      "hey neuro *",
      "hey miro *",
      "hey mirror *",
      "hey mira *",
      "hey neuro *",
    ],
    smart: true,
    action: function (_actionIndex, prompt) {
      try {
        AIService.sendMessage(prompt.trim())
          .then(console.log)
          .catch(console.error);
        console.log({ prompt: prompt.trim() });
        console.log(prompt.trim());
      } catch (e) {
        console.error("Unexpected error", e);
      }
    },
  };

  artyom.addCommands([commandHello]);

  artyom.redirectRecognizedTextOutput(function (recognized, isFinal) {
    if (isFinal) {
      console.log("Final recognized text: " + recognized);
    } else {
      console.log(recognized);
    }
  });
}

function startContinuousArtyom() {
  artyom.fatality(); // use this to stop any instance

  setTimeout(function () {
    // if you use artyom.fatality , wait 250 ms to initialize again.
    artyom
      .initialize({
        lang: "en-GB", // A lot of languages are supported. Read the docs !
        continuous: true, // Artyom will listen forever
        listen: true, // Start recognizing
        speed: 1, // talk normally
        soundex: true,
      })
      .then(function () {
        console.log("Ready to work !");
      })
      .catch((e) => {
        console.error(e);
      });
  }, 250);
}

export const VoiceCommand: React.FC<{ css: any; disabled: boolean }> = (props) => {
  const [listening, setListening] = useState(false);
  const [listenAnimation, setListenAnimation] = useState<
    ReturnType<typeof setInterval> | undefined
  >(undefined);

  const toggleListening = () => {
    if (listening) {
      artyom.fatality();
      clearInterval(listenAnimation);
      miro.board.notifications.showInfo("Stopped listening!");
    } else {
      startContinuousArtyom();
      const wave = ".oOOo.oOOo.";
      const text = "Listening";
      const dots = (wave.length - text.length) / 2;
      let i = 0;
      setListenAnimation(
        setInterval(
          () =>
            miro.board.notifications.showInfo(
              [
                `<div style="text-align: center;">${".".repeat(
                  i % dots
                )}Listening${".".repeat(i % dots)}<div>`,
                `<br/>`,
                `${wave.slice(i % wave.length)}${wave.slice(
                  0,
                  i++ % wave.length
                )}`,
              ].join("")
            ),
          500
        )
      );
    }

    setListening((listening) => !listening);
  };

  return (
    <IconButton
      type="button"
      aria-label="search"
      variant={listening ? "solid-prominent" : "outline"}
      onPress={toggleListening}
      css={props.css}
      disabled={props.disabled}
    >
      <IconMicrophone />
    </IconButton>
  );
};
