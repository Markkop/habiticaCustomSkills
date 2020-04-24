// ==UserScript== 
// @name        habiticaShorcuts 
// @version     0.0.1 
// @description  
// @include     http*://habitica.com* 
// @run-at 	    document-idle 
// @author       
// ==/UserScript== 

(function () {
    'use strict';

    /**
     * Logs a message and objects passed as arguments
     */
    function logs() {
        const [message, ...details] = [...arguments];
        const warning = details.reduce((parsedObject, object) => ({ ...parsedObject, ...object }), {});
        console.warn({ message, ...warning });
    }

    /**
     * Wait for the existance of a value
     * @param { function } getValueFunction function that returns the value
     * @param { number } time wait time before trying again
     * @param { number } maxTries max tries before stop waiting
     * @returns { Promise }
     */
    function waitForExistance(getValueFunction, time = 200, maxTries = 10) {
        return new Promise((resolve, reject) => {
            let tries = 0;
            let interval = setInterval(() => {
                const value = getValueFunction();
                if (!value) {
                    tries += 1;
                    return
                }

                if (tries >= maxTries) {
                    logs(`No value was found after ${tries} tries`, { getValueFunction });
                    clearInterval(interval);
                    return reject(null)
                }

                clearInterval(interval);
                return resolve(value)
            }, time);
        })
    }

    /**
     * Set user and api tokens by getting them from settings page
     */
    async function checkAndSetTokens(settings) {
        if (settings.debugMode) return settings.tokens

        let [user, api] = getCookies('hbt-user', 'hbt-api');
        if (user && api) {
            return {
                user: atob(user),
                api: atob(api),
            }
        }

        await clickOnSelector("[href='/user/settings/site']");
        await clickOnSelector("[href='/user/settings/api']");
        await clickOnSelector('.section .btn');

        const [userElement, apiElement] = document.querySelectorAll('.prettyprint');
        user = userElement && userElement.innerText;
        api = apiElement && apiElement.innerText;

        document.cookie = `hbt-user=${btoa(user)}`;
        document.cookie = `hbt-api=${btoa(api)}`;
        await clickOnSelector("[href='/']");

        return {
            user,
            api,
        }
    }

    /**
     * Click on an element found by document.querySelector(string)
     * @param { string } selector
     */
    async function clickOnSelector(selector) {
        const element = await waitForExistance(() => document.querySelector(selector), 100);
        element && element.click();
    }

    /**
     * Get cookies values
     * @param  {...string} keys cookie keys
     * @returns { string[] } cookie values
     */
    function getCookies(...keys) {
        const cookies = document.cookie.split(';');
        return keys.map(key => {
            const cookieMatched = cookies.find(cookie => cookie.includes(key));
            return cookieMatched && cookieMatched.split('=')[1]
        })
    }

    /**
     * Add css styles to the document
     * @param { String } styleSheet
     */
    function setDocumentStyle(styleSheet) {
        const lines = styleSheet.replace(/\;/g, '').match(/(.+)+/g);
        const rules = lines.reduce(parseStyleSheet, []);
        const style = document.createElement('style');
        document.head.appendChild(style);
        rules.forEach(addStyleSheetRule, style);
    }

    /**
     * Add a new CSS style rule
     * @param { String } rule
     */
    function addStyleSheetRule(rule) {
        this.sheet.insertRule(rule, this.sheet.cssRules.length);
    }

    /**
     * Parse stylesheet's lines in single css rules
     * @param { String[] } rules
     * @param { String } line
     */
    function parseStyleSheet(rules, line) {
        if (line[0] === '}') {
            return rules
        }

        if (line.includes('{')) {
            return rules.concat(line)
        }

        const previousRule = rules[rules.length - 1];
        const selector = previousRule.split('{')[0];
        if (!previousRule.includes('}')) {
            rules[rules.length - 1] = previousRule + line + '}';
            return rules
        }

        return rules.concat(selector + ' {' + line + '}')
    }

    const settings = {
        debugMode: false,
        tokens: {
            user: '',
            api: '',
        }
    };

    const style = `

`;

    // import { shortcutsTree } from './shortcuts'
    // import { createSpell, getSpellCard } from './functions/element'

    /**
     * Execute this script
     */
    async function main() {
        try {
            // // logs('Starting habiticaCustomSkills script', { customSkills })
            settings.tokens = await checkAndSetTokens(settings);
            // const spellCard = await waitForExistance(getSpellCard)
            // customSkills.forEach(createSpell, spellCard)
            setDocumentStyle(style);
        } catch (error) {
            logs('Error on habiticaCustomSkills.user.js', { error });
        }
    }
    main();

}());
