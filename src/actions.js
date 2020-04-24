const { execSync } = require('child_process')
const inquirer = require('inquirer')

/**
 * Executes an action with the given script
 *
 * @param { String } script
 * @param { "build:watch" | "buid" | "test:watch" | "test" } action
 * @returns { String  } script
 */
function runCommand(script, action) {
    try {
        const command = {
            'build:watch': `rollup --config src/${script}/rollup.config.js --watch`,
            build: `rollup --config src/${script}/rollup.config.js`,
            test: `jest src/${script}`,
            'test:watch': `jest src/${script} --watch`,
        }
        execSync(command[action], { stdio: 'inherit' })
        return script
    } catch (error) {}
}

inquirer
    .prompt([
        {
            type: 'list',
            name: 'script',
            message: "Select which script you'd like to work with",
            choices: [
                { name: 'habiticaChat' },
                { name: 'habiticaCustomSkills' },
                { name: 'habiticaShortcuts' },
                { name: 'habiticaPomodoro' },
                { name: 'habiticaNotifications', disabled: 'WIP' },
            ],
        },
        {
            type: 'list',
            name: 'action',
            message: `Select which action you want to perform
    test: run test files
    build: merge script files in a single script in dist folder`,
            choices: [{ name: 'build:watch' }, { name: 'build' }, { name: 'test:watch' }, { name: 'test' }],
        },
    ])
    .then(({ script, action }) => runCommand(script, action))
