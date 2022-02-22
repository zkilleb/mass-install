#!/usr/bin/env node

const currentDir = './';
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const readline = require('readline');

const rl = readline.createInterface(process.stdin, process.stdout);

let packagePaths = [];

function readDirectory(directory) {
    try {
        fs.readdirSync(directory).forEach((file) => {
            if(directory !== 'node_modules' && directory !== '.git' && file !== 'node_modules' && file !== '.git') {
                let fullPath = path.join(directory, file);
                if(file === 'package.json') {
                    packagePaths.push(directory);
                    console.log(`Found package.json at ${fullPath}. Installing dependencies...`);
                    child_process.exec('npm install', { cwd: directory }, () => {
                        console.log(`Install complete for ${fullPath}.`);
                    });
                }
                if(fs.lstatSync(fullPath).isDirectory()) {
                    readDirectory(fullPath);
                }
            }
        });
    } catch(e) {
        console.log(e);
    }
}

function askPrompt() {
    rl.question('We found a .gitignore. Do you want to add the new node_modules directories to it? (Y/N): ', (answer)  => {
        if(answer === 'Y' || answer === 'y') {
            rl.close();
            updateGitignore();
        }
        else if (answer !== 'N' && answer !== 'n') askPrompt();
        else rl.close();
    });
}

function updateGitignore() {
    let writeString = '\n# Automatically added by mass-install\n';;
    try {
        packagePaths.forEach((path) => {
            if(path === './') writeString += `/node_modules\n`;
            else writeString += `/${path}/node_modules\n`;
        });
        fs.appendFileSync(`${currentDir}/.gitignore`, writeString);
    } catch (e) {
        console.log(e);
    }
}

function main() {
    readDirectory(currentDir);
    if(fs.existsSync('.gitignore') && !process.argv.includes('--no-update')) {
        fs.readFile(`${currentDir}/.gitignore`, (e, data) => {
            if (e) console.log(e);
            packagePaths.forEach((path, index) => {
                if(data.includes(path)) packagePaths.splice(index, 1);
            });
            if(packagePaths.length > 0) askPrompt();
        });
    }
}

main();
