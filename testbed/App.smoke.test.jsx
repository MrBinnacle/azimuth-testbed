import { describe, it, expect, beforeAll } from 'vitest'
import { renderToString } from 'react-dom/server'
import { createElement } from 'react'

// Minimal window stub so useWindowWidth's initial useState(window.innerWidth)
// runs under SSR (effects don't fire in renderToString, so listeners aren't
// needed). This is a render-time smoke test: it catches ReferenceErrors and
// bad imports that the build does not.
beforeAll(() => {
  globalThis.window = { innerWidth: 1400, addEventListener() {}, removeEventListener() {} }
})

describe('App smoke render', () => {
  it('renders the shell, value prop, prestaged Boeing runs, and no key wall on load', async () => {
    const { default: App } = await import('./App.jsx')
    const html = renderToString(createElement(App))
    expect(html).toContain('AZIMUTH')
    expect(html).toContain('v1.5.0')                       // version chip from skill-bundle.json
    expect(html).toContain('pressure-tests a big decision') // plain-language value prop
    expect(html).toContain('Boeing — full brief')          // prestaged run + variant label
    expect(html).toContain('ADD KEY')                      // key is optional; affordance shown (no key in test)
    // The key dialog must NOT wall the page on load — cold visitors see the demo first.
    expect(html).not.toContain('RUN YOUR OWN DECISION')
  })
})
