import { defineConfig } from 'unocss'
import ruleUnoCss from './utils/ruleUnoCss'
import presetUno from '@unocss/preset-uno'

export default defineConfig({
  // presets
  uno: true, // enabled `@unocss/preset-uno`
  icons: true, // enabled `@unocss/preset-icons`
  attributify: true, // enabled `@unocss/preset-attributify`,
  shortcuts: [],
  // @ts-ignore
  rules: ruleUnoCss,
  // @ts-ignore
  presets: [presetUno()],
})
