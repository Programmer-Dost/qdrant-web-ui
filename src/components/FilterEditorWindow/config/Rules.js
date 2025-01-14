export const options = {
  scrollBeyondLastLine: false,
  readOnly: false,
  fontSize: 12,
  wordWrap: "on",
  minimap: { enabled: false },
  automaticLayout: true,
  mouseWheelZoom: true,
  glyphMargin: true,
  wordBasedSuggestions: false,
};

export function btnconfig(commandId) {
  return {
    provideCodeLenses: function (model, token) {
      let codeBlocks = GetCodeBlocks(model.getValue());
      let lenses = [];

      for (var i = 0; i < codeBlocks.length; ++i) {
        lenses.push({
          range: {
            startLineNumber: codeBlocks[i].blockStartLine,
            startColumn: 1,
            endLineNumber: codeBlocks[i].blockStartLine,
            endColumn: 1,
          },
          id: "RUN",
          command: {
            id: commandId,
            title: "RUN",
            arguments: [codeBlocks[i].blockText],
          },
        });
      }

      return {
        lenses: lenses,
        dispose: () => {},
      };
    },
    resolveCodeLens: function (model, codeLens, token) {
      return codeLens;
    },
  };
}

export function selectBlock(blocks, location) {
  for (var i = 0; i < blocks.length; ++i) {
    if (
      blocks[i].blockStartLine <= location &&
      location <= blocks[i].blockEndLine
    ) {
      return blocks[i];
    }
  }
  return null;
}

export function GetCodeBlocks(codeText) {
  const codeArray = codeText.replace(/\/\/.*$/gm, "").split(/\r?\n/);
  var blocksArray = [];
  var block = { blockText: "", blockStartLine: null, blockEndLine: null };
  var backetcount = 0;
  var codeStarLine = 0;
  var codeEndline = 0;
  for (var i = 0; i < codeArray.length; ++i) {
    // dealing for request which have JSON Body
    if (codeArray[i].includes("{")) {
      if (backetcount === 0) {
        codeStarLine = i+1;
      }
      backetcount = backetcount + codeArray[i].match(/{/gi).length;
    }
    if (codeArray[i].includes("}")) {
      backetcount = backetcount - codeArray[i].match(/}/gi).length;
      if (backetcount === 0) {
        codeEndline = i + 1;
      }
    }
    if (codeStarLine) {
      block.blockStartLine = codeStarLine;
      block.blockText = block.blockText + codeArray[i] + "\n";
      if (codeEndline) {
        block.blockEndLine = codeEndline;
        blocksArray.push(block);
        codeEndline = 0;
        codeStarLine = 0;
        block = { blockText: "", blockStartLine: null, blockEndLine: null };
      }
    }

  }
  return blocksArray;
}
