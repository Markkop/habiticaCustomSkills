import { logs, waitForExistance, checkAndSetTokens} from '../utils/common'
import { setDocumentStyle } from '../utils/style'
import { style, settings } from './settings'

/**
 * Execute this script
 */
async function main() {
    try {
        logs('Starting habitica chat script', { customSkills })
        settings.tokens = await checkAndSetTokens(settings)
        setDocumentStyle(style)
    } catch (error) {
        logs('Error on habiticaCustomSkills.user.js', { error })
    }
}
main()
