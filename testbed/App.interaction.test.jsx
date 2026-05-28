// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createRoot } from 'react-dom/client'
import { act } from 'react'
import { createElement } from 'react'

// Real DOM interaction test: does clicking an example fill the field and arm RUN,
// does RUN with no key open the key dialog, and does clicking RUN while empty
// guide the user (focus the field) instead of doing nothing?

function fireClick(el) {
  el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }))
}

let container
beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  globalThis.fetch = vi.fn(() => new Promise(() => {}))
  window.HTMLElement.prototype.scrollIntoView = vi.fn() // jsdom has no scrollIntoView
  document.body.innerHTML = '' // isolate: drop any container/modal from a prior test
  container = document.createElement('div')
  document.body.appendChild(container)
})

async function mountApp() {
  const { default: App } = await import('./App.jsx')
  await act(async () => { createRoot(container).render(createElement(App)) })
}

const runButton = () => [...container.querySelectorAll('button')].find(b => b.textContent.startsWith('RUN'))
const exampleRow = label => [...container.querySelectorAll('div')].find(d => d.textContent === label)

describe('App interaction (jsdom)', () => {
  it('clicking an example fills the decision field and arms RUN', async () => {
    await mountApp()
    const textarea = container.querySelector('textarea')
    expect(textarea.value).toBe('')
    expect(runButton().textContent).toContain('load or type a decision')

    await act(async () => { fireClick(exampleRow('Boeing — bare facts')) })

    expect(textarea.value.startsWith('We have committed to a major airline customer')).toBe(true)
    expect(runButton().textContent).not.toContain('load or type a decision')
  })

  it('clicking RUN with no key (after loading a decision) opens the key dialog', async () => {
    await mountApp()
    await act(async () => { fireClick(exampleRow('Boeing — full brief')) })
    await act(async () => { fireClick(runButton()) })
    expect(document.body.textContent).toContain('RUN YOUR OWN DECISION')
  })

  it('clicking RUN while empty focuses the field and does NOT open the dialog', async () => {
    await mountApp()
    const textarea = container.querySelector('textarea')
    await act(async () => { fireClick(runButton()) })
    expect(document.activeElement).toBe(textarea)
    expect(document.body.textContent).not.toContain('RUN YOUR OWN DECISION')
  })
})
