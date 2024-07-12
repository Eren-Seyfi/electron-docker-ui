const run = require("./lib/command.js");
const docker = require("./lib/docker.js");
const commands = ["dir", "echo Hello World", "error command"];

async function runMain(data) {
  try {
    const result = await run(data);
    console.log(result);
  } catch (error) {
    console.error("Error:", error);
  }
}

// runMain(commands);

function dockerMain() {
  
  docker("node")
    .then((data) => {
      // console.log("API Response Data with Rate Plans:", data);
      data.map((json) => {
        console.log(json.id);
        console.log(json);
      });
    })
    .catch((error) => {
      console.error("API Request Error:", error.message);
    });
}

dockerMain();
