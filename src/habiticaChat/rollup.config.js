import banner from 'rollup-plugin-banner'
import { header } from './settings.js'

export default [
    {
        input: 'src/habiticaChat/main.js',
        output: {
            file: 'dist/habiticaChat.user.js',
            name: 'habiticaChat',
            format: 'iife',
        },
        plugins: [banner([header, '//'])],
    },
]
