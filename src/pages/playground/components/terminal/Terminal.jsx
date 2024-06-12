import React, { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

function prompt(term) {
  term.write("\r\n$ ");
}

function runCommand(socket, command) {
  socket.send(command);
}
const XTermComponent = ({ socket, setFiles }) => {
  // Pass URL as a prop
  const terminalRef = useRef(null);

  useEffect(() => {
    const term = new Terminal({ cursorBlink: true }); // Optional customization
    const fitAddon = new FitAddon();

    term.prompt = () => {
      term.write("\r\n$ ");
    };
    prompt(term);

    socket.onmessage = (event) => {
      // console.log("the socket event ", event);
      const parsedData = JSON.parse(event.data);
      console.log("parsed data ", parsedData);
      if (parsedData.isTerminal) {
        term.write(parsedData.data);
      } else if (parsedData.isExplorer) {
        setFiles(parsedData.data);
      }
    };

    term.loadAddon(fitAddon);
    // term.loadAddon(attachAddon);

    // Handle output (optional)
    // term.onData((data) => {
    //   console.log("Terminal output:", data);
    // });

    term.open(terminalRef.current);
    fitAddon.fit();

    term.onKey((key) => {
      runCommand(socket, key.key);
    });

    // Cleanup on unmount
    return () => {
      term.destroy();
    };
  }, []); // Add URL to dependency array

  return (
    <div
      ref={terminalRef}
      style={{ width: "100%", height: "100%", backgroundColor: "#191919" }}
    />
  );
};

export default XTermComponent;
