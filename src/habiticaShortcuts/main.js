import { logs, waitForExistance, checkAndSetTokens} from '../utils/common'
import { setDocumentStyle } from '../utils/style'
import { style, settings } from './settings'
// import { shortcutsTree } from './shortcuts'
// import { createSpell, getSpellCard } from './functions/element'

/**
 * Execute this script
 */
async function main() {
    try {
        // // logs('Starting habiticaCustomSkills script', { customSkills })
        settings.tokens = await checkAndSetTokens(settings)
        // const spellCard = await waitForExistance(getSpellCard)
        // customSkills.forEach(createSpell, spellCard)
        setDocumentStyle(style)
    } catch (error) {
        logs('Error on habiticaCustomSkills.user.js', { error })
    }
}
main()
