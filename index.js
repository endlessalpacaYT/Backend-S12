// BTW: this file is for starting the frontend and backend

const { spawn } = require('child_process');
const path = require('path');
const chalk = require('chalk');

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// Wont lie i used chatgpt for this function, im gonna go sleep now i might start going crazy PS: marv pls dont hate me for this
function startBackend() {
    return new Promise((resolve, reject) => {
        const backendDir = path.join(__dirname, 'backend');
        const indexPath = path.join(backendDir, 'index.js');

        const child = spawn('node', [indexPath], {
            cwd: backendDir,
            stdio: 'inherit' 
        });

        child.on('close', (code) => {
            console.log(`index.js process exited with code ${code}`);
            resolve(code);
        });

        child.on('error', (err) => {
            console.error(`Failed to start process: ${err.message}`);
            reject(err);
        });
    });
}

(async () => {
    try {
        startBackend();
        // added this deleay cuz i wanted the log to show after it started yk, its the little things that count :)
        await delay(1000);
        console.log(`${chalk.keyword('orange')('[Main]')} Backend Process Started!`);
    } catch (error) {
        console.error(`Error occurred: ${error.message}`);
    }
})();
