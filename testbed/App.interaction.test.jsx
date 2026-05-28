// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createRoot } from 'react-dom/client'
import { act } from 'react'
import { createElement } from 'react'

// Real DOM interaction test: does clicking an example fill the field and enable
// RUN, and does RUN (with no key) open the key dialog? This reproduces what a
// visitor does, so "buttons do nothing" is testable rather than guessed at.

function fireClick(el) {
  el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }))
}

let container
beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  // jsdom provides window/document; stub fetch so a RUN never hits the network.
  globalThis.fetch = vi.fn(() => new Promise(() => {}))
  container = document.createElement('div')
  document.body.appendChild(container)
})

async function mountApp() {
  const { default: App } = await import('./App.jsx')
  let root
  await act(async () => {
    root = createRoot(container)
    root.render(createElement(App))
  })
  return root
}

describe('App interaction (jsdom)', () => {
  it('clicking an example fills the decision field and enables RUN', async () => {
    await mountApp()

    const textarea = container.querySelector('textarea')
    expect(textarea).toBeTruthy()
    expect(textarea.value).toBe('')

    const runBtn = [...container.querySelectorAll('button')].find(b => b.textContent.startsWith('RUN'))
    expect(runBtn).toBeTruthy()
    expect(runBtn.disabled).toBe(true) // empty field → disabled

    // Find the "Boeing — bare facts" example row and click it.
    const example = [...container.querySelectorAll('div')].find(d => d.textContent === 'Boeing — bare facts')
    expect(example).toBeTruthy()
    await act(async () => { fireClick(example) })

    // The field should now hold the bare-facts prompt, and RUN should be enabled.
    expect(textarea.value.startsWith('We have committed to a major airline customer')).toBe(true)
    expect(runBtn.disabled).toBe(false)
  })

  it('clicking RUN with no key opens the key dialog', async () => {
    await mountApp()

    const example = [...container.querySelectorAll('div')].find(d => d.textContent === 'Boeing — full brief')
    await act(async () => { fireClick(example) })

    const runBtn = [...container.querySelectorAll('button')].find(b => b.textContent.startsWith('RUN'))
    expect(runBtn.disabled).toBe(false)
    await act(async () => { fireClick(runBtn) })

    // No key set → the dialog should appear.
    expect(document.body.textContent).toContain('RUN YOUR OWN DECISION')
  })
})
