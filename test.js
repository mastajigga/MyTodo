const { spawn } = require("child_process");
const path = require("path");

async function testMCPServers() {
    console.log("Testing MCP servers...");
    
    const nodePath = process.execPath;  // Chemin vers node.exe
    const braveSearchPath = "./node_modules/@modelcontextprotocol/server-brave-search/dist/index.js";
    const sequentialThinkingPath = "./node_modules/@modelcontextprotocol/server-sequential-thinking/dist/index.js";

    const braveSearch = spawn(nodePath, [braveSearchPath]);
    const sequentialThinking = spawn(nodePath, [sequentialThinkingPath]);

    braveSearch.stdout.on("data", (data) => {
        console.log(`Brave Search: ${data}`);
    });

    sequentialThinking.stdout.on("data", (data) => {
        console.log(`Sequential Thinking: ${data}`);
    });

    braveSearch.stderr.on("data", (data) => {
        console.error(`Brave Search Error: ${data}`);
    });

    sequentialThinking.stderr.on("data", (data) => {
        console.error(`Sequential Thinking Error: ${data}`);
    });
}

testMCPServers();
