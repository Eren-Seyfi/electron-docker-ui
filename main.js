const run = require("./lib/command.js");

const commands = ["dir", "echo Hello World", "error command"];

async function main(data) {
  try {
    const result = await run(data);
    console.log(result);
  } catch (error) {
    console.error("Error:", error);
  }
}

main(commands);
