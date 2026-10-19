#!/usr/bin/env python3
"""Prüft alle Code-Beispiele der Foliendateien mit dem echten TypeScript-Compiler.

Aufruf (aus dem Repo-Wurzelordner, nach `npm install` in 01_typescript_primer):
    python3 -I folien_neu/deck/verify_ts_snippets.py [content_tsprimer_*.json ...]

Jede Folie mit `"type": "code"` kann diese Zusatzfelder haben (werden von build_deck.py ignoriert):
    "_verify":  "ok"          Code muss ohne Compilerfehler übersetzbar sein (Standard, wenn das Feld fehlt)
                "error:TS2322"  Der Code soll GENAU diesen Fehlercode melden (Beispiel, das einen Fehler zeigt)
                "skip"        keine Prüfung (z. B. Konsolenausgabe, JSON, Befehle)
    "_prelude": Code, der vor dem Beispiel eingefügt wird (nicht auf der Folie sichtbar), z. B. das Interface Customer

Geprüft wird mit: strict, Ziel ES2022, lib ES2022+DOM, experimentalDecorators (wie die invoice-app).
Jede Folie wird als eigene Datei übersetzt (mit `export {};`, damit sich Namen nicht stören).
Exit-Code 1, wenn ein Beispiel nicht der Erwartung entspricht.
"""
import glob
import json
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TSC = os.path.join(ROOT, '01_typescript_primer', 'node_modules', 'typescript', 'bin', 'tsc')
FLAGS = ['--noEmit', '--strict', '--noImplicitReturns', '--target', 'ES2022', '--module', 'ESNext',
         '--moduleResolution', 'bundler', '--lib', 'ES2022,DOM', '--experimentalDecorators', '--skipLibCheck']


def check(code, prelude):
    with tempfile.TemporaryDirectory() as tmp:
        path = os.path.join(tmp, 'snippet.ts')
        with open(path, 'w', encoding='utf-8') as fh:
            fh.write((prelude + '\n' if prelude else '') + code + '\n\nexport {};\n')
        res = subprocess.run(['node', TSC, *FLAGS, path], capture_output=True, text=True, cwd=tmp)
        out = (res.stdout + res.stderr).replace(tmp + os.sep, '')
        return re.findall(r'error (TS\d+)', out), out


def main(files):
    if not os.path.exists(TSC):
        raise SystemExit('TypeScript fehlt: bitte `npm install` in 01_typescript_primer ausführen.')
    bad = checked = 0
    for f in files:
        data = json.load(open(f, encoding='utf-8'))
        for b in data.get('blocks', []):
            for s in b.get('slides', []):
                if s.get('type') != 'code':
                    continue
                mode = s.get('_verify', 'ok')
                if mode == 'skip':
                    continue
                codes, out = check(s['code'], s.get('_prelude', ''))
                checked += 1
                if mode == 'ok':
                    good = not codes
                elif mode.startswith('error:'):
                    want = mode.split(':', 1)[1]
                    good = want in codes
                else:
                    print('FEHLER  %s: unbekanntes _verify %r' % (os.path.basename(f), mode)); bad += 1; continue
                if good:
                    print('ok      %s  %s' % (os.path.basename(f), s['title']))
                else:
                    bad += 1
                    print('FEHLER  %s  %s  (erwartet: %s, gefunden: %s)' % (os.path.basename(f), s['title'], mode, codes or 'keine Fehler'))
                    print('\n'.join('          ' + l for l in out.strip().splitlines()[:6]))
    print('\n%d Beispiele geprüft, %d Abweichungen' % (checked, bad))
    return 1 if bad else 0


if __name__ == '__main__':
    files = sys.argv[1:] or sorted(glob.glob(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'content_tsprimer_*.json')))
    sys.exit(main(files))
