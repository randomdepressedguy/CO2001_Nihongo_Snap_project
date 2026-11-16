import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

const require = createRequire(import.meta.url);
const { build } = require(require.resolve('esbuild', { paths: [require.resolve('wrangler/package.json')] }));
const directory = await mkdtemp(join(tmpdir(), 'nihongo-handwriting-ui-'));
after(() => rm(directory, { recursive: true, force: true }));
const bundle = join(directory, 'components.cjs');
await build({
    stdin: {
        contents: "export { SearchField } from './components/study/Vocabulary';",
        resolveDir: process.cwd(), sourcefile: 'handwriting-test.tsx',
    },
    outfile: bundle, bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic', logLevel: 'silent',
    plugins: [{
        name: 'handwriting-test-context',
        setup(builder) {
            builder.onResolve({ filter: /^react(\/.*)?$/ }, args => ({ path: require.resolve(args.path), external: true }));
            builder.onResolve({ filter: /^(\.\/context|next\/navigation)$/ }, args => ({ path: args.path, namespace: 'test-context' }));
            builder.onLoad({ filter: /.*/, namespace: 'test-context' }, args => ({
                contents: args.path === './context'
                    ? 'export const useStudy=()=>({t:(vi)=>vi}); export const useStudyNow=()=>0; export const useStudyClock=()=>()=>1;'
                    : "export const usePathname=()=>'/dictionary'; export const useSearchParams=()=>new URLSearchParams();",
            }));
        },
    }],
});
const { SearchField } = require(bundle);
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

async function setup(t, initialValue = '') {
    const dom = new JSDOM('<!doctype html><div id="root"></div>', { url: 'https://nihongo.test' });
    const previous = new Map();
    const globals = {
        window: dom.window, document: dom.window.document, navigator: dom.window.navigator,
        HTMLElement: dom.window.HTMLElement, IS_REACT_ACT_ENVIRONMENT: true,
    };
    for (const [key, value] of Object.entries(globals)) {
        previous.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
        Object.defineProperty(globalThis, key, { value, writable: true, configurable: true });
    }
    const context = new Proxy({}, { get: () => () => {} });
    dom.window.HTMLCanvasElement.prototype.getContext = () => context;
    dom.window.HTMLCanvasElement.prototype.getBoundingClientRect = () => ({ left: 0, top: 0, width: 320, height: 230 });
    const oldFetch = globalThis.fetch;
    const requests = [];
    // Intentionally ignore AbortSignal: late upstream responses must stay harmless.
    globalThis.fetch = (url, options) => new Promise(resolve => requests.push({ url, options, resolve }));
    const root = createRoot(dom.window.document.getElementById('root'));
    let value = initialValue;
    let mounted = true;
    function ControlledSearch() {
        const [query, setQuery] = React.useState(initialValue);
        value = query;
        return React.createElement(SearchField, { value: query, onChange: setQuery, label: 'Search words' });
    }
    const doc = dom.window.document;
    const click = async element => act(async () => { assert.ok(element, 'Expected button'); element.click(); });
    const button = label => [...doc.querySelectorAll('button')].find(element => element.textContent.trim() === label);
    const mouse = async type => act(async () => {
        doc.querySelector('canvas').dispatchEvent(new dom.window.MouseEvent(type, {
            bubbles: true, button: 0, clientX: type === 'mousedown' ? 40 : 270, clientY: 110,
        }));
    });
    const stroke = async () => { await mouse('mousedown'); await mouse('mousemove'); await mouse('mouseup'); };
    const waitRequest = async () => act(async () => { await pause(180); });
    const respond = async (index, chars) => act(async () => {
        requests[index].resolve(Response.json(['SUCCESS', [['0', chars]]]));
        await pause(0);
    });
    const unmount = async () => { if (mounted) { await act(async () => root.unmount()); mounted = false; } };
    t.after(async () => {
        await unmount();
        globalThis.fetch = oldFetch;
        dom.window.close();
        for (const [key, descriptor] of previous) {
            if (descriptor) Object.defineProperty(globalThis, key, descriptor);
            else delete globalThis[key];
        }
    });
    await act(async () => root.render(React.createElement(ControlledSearch)));
    await click(doc.querySelector('.handwriting-trigger-btn'));
    return { dom, doc, requests, click, button, mouse, stroke, waitRequest, respond, unmount, value: () => value };
}

test('drawing immediately removes old candidates and ignores a late cancelled response', async t => {
    const ui = await setup(t);
    await ui.stroke(); await ui.waitRequest(); await ui.respond(0, ['一']);
    assert.equal(ui.doc.querySelector('.handwriting-candidate-btn').textContent, '一');
    await ui.mouse('mousedown');
    assert.equal(ui.doc.querySelectorAll('.handwriting-candidate-btn').length, 0);
    await ui.mouse('mouseup'); await ui.waitRequest();
    await ui.mouse('mousedown');
    assert.equal(ui.requests[1].options.signal.aborted, true);
    await ui.respond(1, ['木']);
    assert.equal(ui.doc.querySelectorAll('.handwriting-candidate-btn').length, 0);
    await ui.mouse('mouseup'); await ui.waitRequest(); await ui.respond(2, ['猫']);
    await ui.click(ui.doc.querySelector('.handwriting-candidate-btn'));
    assert.equal(ui.value(), '猫');
    assert.equal(ui.doc.querySelectorAll('.handwriting-candidate-btn').length, 0);
});

test('fallback exposes additional suggestions and labels their stroke-count origin', async t => {
    const ui = await setup(t);
    for (let i = 0; i < 3; i++) await ui.stroke();
    await ui.waitRequest();
    await act(async () => { ui.requests[0].resolve(new Response('unavailable', { status: 500 })); await pause(0); });
    assert.equal(ui.doc.querySelectorAll('.handwriting-candidate-btn').length, 8);
    assert.equal(ui.doc.querySelector('.handwriting-status-pill').textContent.trim(), 'Theo số nét');
    await ui.click(ui.doc.querySelector('.handwriting-more-btn'));
    const earth = [...ui.doc.querySelectorAll('.handwriting-candidate-btn')].find(element => element.textContent === '土');
    await ui.click(earth);
    assert.equal(ui.value(), '土');
    assert.match(ui.doc.querySelector('.handwriting-service-note').textContent, /Google/);
});

test('undo, clear and unmount cancel recognition; backspace preserves Unicode characters', async t => {
    const ui = await setup(t, '猫😀');
    await ui.click(ui.button('Xóa chữ'));
    assert.equal(ui.value(), '猫');
    await ui.stroke(); await ui.waitRequest(); await ui.click(ui.button('Hoàn tác'));
    assert.equal(ui.requests[0].options.signal.aborted, true);
    assert.equal(ui.button('Hoàn tác').disabled, true);
    await ui.stroke(); await ui.waitRequest(); await ui.click(ui.button('Xóa bảng'));
    assert.equal(ui.requests[1].options.signal.aborted, true);
    await ui.stroke(); await ui.waitRequest(); await ui.unmount();
    assert.equal(ui.requests[2].options.signal.aborted, true);
});

test('outside touch and Escape close the pad without changing the search query', async t => {
    const ui = await setup(t, '猫');
    await act(async () => ui.doc.body.dispatchEvent(new ui.dom.window.Event('touchstart', { bubbles: true })));
    assert.equal(ui.doc.querySelector('[role="dialog"]'), null);
    await ui.click(ui.doc.querySelector('.handwriting-trigger-btn'));
    await act(async () => ui.doc.body.dispatchEvent(new ui.dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })));
    assert.equal(ui.doc.querySelector('[role="dialog"]'), null);
    assert.equal(ui.value(), '猫');
});
