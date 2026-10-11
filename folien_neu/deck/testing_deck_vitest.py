#!/usr/bin/env python3
"""Stellt Testing_angular21.pptx von Karma/Jasmine auf Vitest um.

Aufruf:
    git show <Commit vor der Umstellung>:Testing_angular21.pptx > /tmp/testing_original.pptx
    python3 -I folien_neu/deck/testing_deck_vitest.py /tmp/testing_original.pptx Testing_angular21.pptx [terminal.png]

Das Skript geht immer vom Original aus (nie in-place). Alle Folienverweise beziehen sich auf die
Nummerierung des Originals (32 Folien). Es werden Texte, SmartArt-Diagramme, ein Screenshot und
Sprechtexte (Notizen) fuer die geaenderten Folien angepasst. Es ist keine allgemeine Bibliothek,
sondern dokumentiert genau diese Umstellung.
"""
import copy
import re
import sys

from lxml import etree
from pptx import Presentation

A = 'http://schemas.openxmlformats.org/drawingml/2006/main'
NS = {
    'a': A,
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'dgm': 'http://schemas.openxmlformats.org/drawingml/2006/diagram',
    'dsp': 'http://schemas.microsoft.com/office/drawing/2008/diagram',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
}
RT_DIAGRAM_DATA = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/diagramData'
RT_DIAGRAM_DRAW = 'http://schemas.microsoft.com/office/2007/relationships/diagramDrawing'


# --------------------------------------------------------------------------- Textwerkzeuge
def _clear_runs(p):
    for ch in list(p):
        if ch.tag in ('{%s}r' % A, '{%s}br' % A, '{%s}fld' % A):
            p.remove(ch)


def _first_rpr(p):
    r = p.find('a:r', NS)
    if r is not None and r.find('a:rPr', NS) is not None:
        return copy.deepcopy(r.find('a:rPr', NS))
    return None


def _mk_run(text, rpr):
    r = etree.SubElement(etree.Element('dummy'), '{%s}r' % A)
    if rpr is not None:
        rp = copy.deepcopy(rpr)
        for k in ('err', 'dirty'):
            rp.attrib.pop(k, None)
        for h in rp.findall('a:hlinkClick', NS):
            rp.remove(h)
        r.append(rp)
    t = etree.SubElement(r, '{%s}t' % A)
    t.text = text
    return r


def set_para_text(p, text):
    """Ersetzt den Text eines Absatzes, die Formatierung des ersten Runs bleibt."""
    rpr = _first_rpr(p)
    if rpr is None:
        e = p.find('a:endParaRPr', NS)
        rpr = copy.deepcopy(e) if e is not None else None
        if rpr is not None:
            rpr.tag = '{%s}rPr' % A
    _clear_runs(p)
    end = p.find('a:endParaRPr', NS)
    r = _mk_run(text, rpr)
    if end is not None:
        end.addprevious(r)
    else:
        p.append(r)


def set_lines(shape, lines):
    """Setzt den Text eines Textfelds zeilenweise.

    Hat das Feld mehrere Absaetze, wird ein Absatz je Zeile erzeugt; besteht es aus einem Absatz mit
    Zeilenumbruechen (a:br), bleibt es bei einem Absatz mit Umbruechen (kein Absatzabstand).
    """
    tx = shape._element.find('.//p:txBody', NS)
    if tx is None:
        tx = shape._element.find('.//a:txBody', NS)
    paras = tx.findall('a:p', NS)
    uses_br = len(paras) == 1 and paras[0].find('a:br', NS) is not None
    tmpl = next((p for p in paras if p.find('a:r', NS) is not None), paras[0])
    rpr = _first_rpr(tmpl)
    if rpr is None:
        e = tmpl.find('a:endParaRPr', NS)
        rpr = copy.deepcopy(e) if e is not None else None
        if rpr is not None:
            rpr.tag = '{%s}rPr' % A
    for p in paras:
        tx.remove(p)
    if uses_br:
        p = copy.deepcopy(tmpl)
        _clear_runs(p)
        end = p.find('a:endParaRPr', NS)
        for i, line in enumerate(lines):
            nodes = [_mk_run(line, rpr)]
            if i < len(lines) - 1:
                br = etree.Element('{%s}br' % A)
                if rpr is not None:
                    bp = copy.deepcopy(rpr)
                    br.append(bp)
                nodes.append(br)
            for n in nodes:
                if end is not None:
                    end.addprevious(n)
                else:
                    p.append(n)
        tx.append(p)
    else:
        for line in lines:
            p = copy.deepcopy(tmpl)
            _clear_runs(p)
            end = p.find('a:endParaRPr', NS)
            r = _mk_run(line, rpr)
            if end is not None:
                end.addprevious(r)
            else:
                p.append(r)
            tx.append(p)


def set_font(shape, sz):
    """Feste Schriftgroesse in allen Runs, Autofit-Verkleinerung entfernen."""
    el = shape._element
    for rp in el.iter('{%s}rPr' % A):
        rp.set('sz', str(sz))
    for e in el.iter('{%s}endParaRPr' % A):
        e.set('sz', str(sz))
    for bp in el.iter('{%s}bodyPr' % A):
        for ch in list(bp):
            if ch.tag in ('{%s}normAutofit' % A, '{%s}spAutoFit' % A):
                bp.remove(ch)


def shape_by_name(slide, name):
    for sh in slide.shapes:
        if sh.name == name:
            return sh
    raise KeyError(name)


def norm(s):
    return re.sub(r'\s+', ' ', s.replace('\xa0', ' ').replace('', '->')).strip()


# --------------------------------------------------------------------------- SmartArt
def diagram_parts(slide):
    data = draw = None
    for rel in slide.part.rels.values():
        if rel.reltype == RT_DIAGRAM_DATA:
            data = rel.target_part
        elif rel.reltype == RT_DIAGRAM_DRAW:
            draw = rel.target_part
    return data, draw


def edit_diagram_text(part, mapping, label):
    """mapping: normalisierter Alttext eines Absatzes -> Neutext. Jeder Eintrag muss mindestens einmal treffen."""
    root = etree.fromstring(part.blob)
    hits = {k: 0 for k in mapping}
    for p in root.iter('{%s}p' % A):
        old = norm(''.join(t.text or '' for t in p.iter('{%s}t' % A)))
        if old in mapping:
            set_para_text(p, mapping[old])
            hits[old] += 1
    missing = [k for k, v in hits.items() if v == 0]
    if missing:
        raise SystemExit('%s: Text nicht gefunden: %s' % (label, missing))
    part._blob = etree.tostring(root, xml_declaration=True, encoding='UTF-8', standalone=True)


def replace_browser_icon(draw):
    """Ersetzt das Jasmine-Symbol (rId3 PNG, rId4 SVG) durch ein schlichtes Browserfenster-Symbol."""
    from io import BytesIO
    from PIL import Image, ImageDraw
    blue = (59, 98, 177, 255)
    im = Image.new('RGBA', (384, 384), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([40, 70, 344, 314], radius=26, outline=blue, width=18)
    d.rectangle([40, 130, 344, 148], fill=blue)
    for k in range(3):
        d.ellipse([72 + k * 44, 94, 96 + k * 44, 118], fill=blue)
    buf = BytesIO()
    im.save(buf, 'PNG')
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 384"><g fill="none" stroke="#3b62b1" '
           'stroke-width="18"><rect x="49" y="79" width="286" height="226" rx="22"/></g><rect x="40" y="130" '
           'width="304" height="18" fill="#3b62b1"/><g fill="#3b62b1"><circle cx="84" cy="106" r="12"/>'
           '<circle cx="128" cy="106" r="12"/><circle cx="172" cy="106" r="12"/></g></svg>')
    draw.rels['rId3'].target_part._blob = buf.getvalue()
    draw.rels['rId4'].target_part._blob = svg.encode('utf-8')


# --------------------------------------------------------------------------- Folien klonen
def clone_slide(prs, src, insert_after_index):
    new = prs.slides.add_slide(src.slide_layout)
    for sh in list(new.shapes):
        sh._element.getparent().remove(sh._element)
    for sh in src.shapes:
        if sh.shape_type == 13:  # Bilder nicht kopieren
            continue
        new.shapes._spTree.append(copy.deepcopy(sh._element))
    lst = prs.slides._sldIdLst
    ids = list(lst)
    el = ids[-1]
    lst.remove(el)
    lst.insert(insert_after_index + 1, el)
    return new


def set_notes(slide, text):
    slide.notes_slide.notes_text_frame.text = text


# --------------------------------------------------------------------------- Inhalt
def main(src, dst, terminal_png):
    prs = Presentation(src)
    S = {i: s for i, s in enumerate(prs.slides, 1)}
    assert len(S) == 32, 'Erwartet wird das Original mit 32 Folien'
    notes = {}

    # 1 Titel
    sub = shape_by_name(S[1], 'Untertitel 2')
    first = sub.text_frame.paragraphs[0]._p
    set_para_text(first, 'Unit Tests (Vitest)')
    notes[1] = ('Folie: „Testing“.\n\n'
                'Dieses Kapitel behandelt das automatische Testen von Angular-Anwendungen. Für kleine Tests einzelner '
                'Bausteine, die „Unit Tests“, wird jetzt „Vitest“ verwendet. Vitest ist das Werkzeug, das ab Angular 21 '
                'standardmäßig mitgeliefert wird. Für Tests, die die ganze Anwendung im Browser durchspielen, den '
                '„End-to-End-Tests“, werden „Cypress“ und „Playwright“ genannt.')

    # 3 Test-Runner (SmartArt)
    S[3].shapes.title.text_frame.text = 'Angular Test-Runner: Vitest (Default ab v21)'
    data, draw = diagram_parts(S[3])
    m = {
        'Karma': 'Vitest',
        'TaskRunner (Start Testbed, Reporting Testresults)':
            'Test-Runner und Framework: startet die Tests, stellt Mocks und Matcher bereit, meldet die Ergebnisse',
        'Jasmine': 'jsdom',
        'API/Framework for the individual Test (Expectations , …)':
            'Simulierte Browser-Umgebung: Komponenten laufen im Test ohne echten Browser',
    }
    edit_diagram_text(data, m, 'Folie 3 data')
    edit_diagram_text(draw, m, 'Folie 3 drawing')
    replace_browser_icon(draw)
    notes[3] = ('Folie: „Angular Test-Runner: Vitest (Default ab v21)“.\n\n'
                'Ein „Test-Runner“ ist ein Programm, das die Tests startet und das Ergebnis anzeigt. Früher benutzte Angular '
                'dafür „Karma“ zusammen mit „Jasmine“. Ab Angular 21 ist „Vitest“ der Standard. Vitest startet die Tests, '
                'bietet Funktionen zum Prüfen und zum Nachbauen von Abhängigkeiten und zeigt die Ergebnisse in der Konsole.\n\n'
                '„jsdom“ ist ein Programm, das einen Browser nachbildet. Dadurch laufen die Komponenten im Test sehr schnell, '
                'ohne dass ein echter Browser geöffnet werden muss.')

    # 4 Vitest Standard
    S[4].shapes.title.text_frame.text = 'Vitest – Standard-Test-Runner ab Angular 21'
    set_lines(shape_by_name(S[4], 'Rectangle 1'), [
        '// Neue Projekte (ng new) und alle Übungsprojekte nutzen Vitest',
        '// angular.json',
        '"test": {',
        '  "builder": "@angular/build:unit-test",',
        '  "options": { "tsConfig": "tsconfig.spec.json", "runner": "vitest" }',
        '}',
        '',
        '// Start: ng test   (einmalig: ng test --watch=false)',
        '// describe / it / expect / beforeEach / afterEach: wie gewohnt',
        '// Mocks und Spies: vi.fn() und vi.spyOn()',
        '// Bestandsprojekte mit Karma/Jasmine laufen weiter (Umstieg: siehe nächste Folien)',
    ])
    notes[4] = ('Codefolie „Vitest – Standard-Test-Runner ab Angular 21“.\n\n'
                'In der Datei „angular.json“ steht, wie Tests gestartet werden. Der Eintrag „builder“ nennt das Werkzeug '
                '„@angular/build:unit-test“, und „runner“ ist auf „vitest“ eingestellt. Mit dem Befehl „ng test“ startet man '
                'die Tests. Mit „ng test --watch=false“ laufen sie einmal durch und das Programm beendet sich danach.\n\n'
                'Die Grundbausteine „describe“, „it“, „expect“, „beforeEach“ und „afterEach“ sind wie gewohnt. Zum Nachbauen '
                'von Abhängigkeiten gibt es „vi.fn()“ und „vi.spyOn()“. Projekte, die noch Karma und Jasmine nutzen, laufen '
                'weiter. Wie der Umstieg gelingt, zeigen die nächsten Folien.')

    # 5 package.json
    S[5].shapes.title.text_frame.text = 'Konfiguration Vitest package.json'
    set_lines(shape_by_name(S[5], 'Rectangle 1'), [
        '"devDependencies": {',
        '  ..',
        '  "@angular/build": "^21.0.0",',
        '  "jsdom": "^28.0.0",',
        '  "typescript": "~5.9.0",',
        '  "vitest": "~4.0.18",',
        '  ..',
        '}',
    ])
    notes[5] = ('Codefolie „Konfiguration Vitest package.json“.\n\n'
                'Die Datei „package.json“ listet alle Pakete, die ein Projekt braucht. Für die Tests sind drei Pakete wichtig: '
                '„@angular/build“ enthält das Angular-Werkzeug zum Starten der Tests, „vitest“ ist der Test-Runner selbst und '
                '„jsdom“ ist der nachgebaute Browser. Die Pakete von Karma und Jasmine werden nicht mehr gebraucht. In den '
                'Übungsprojekten ist „vitest“ auf die Version 4.0.18 festgelegt, weil die Installation mit älteren '
                'npm-Versionen bei neueren Vitest-Versionen abbrechen kann.')

    # 6 angular.json (Pfeil auf runner-Zeile verschieben)
    S[6].shapes.title.text_frame.text = 'Konfiguration Vitest angular.json'
    set_lines(shape_by_name(S[6], 'Rectangle 1'), [
        '"test": {',
        '  "builder": "@angular/build:unit-test",',
        '  "options": {',
        '    "tsConfig": "tsconfig.spec.json",',
        '    "runner": "vitest"',
        '  }',
        '}',
    ])
    arrow = shape_by_name(S[6], 'Grafik 4')
    line_pitch = int(11 * 1.1 * 12700)
    arrow.top = arrow.top + (4 - 7) * line_pitch + 110000
    arrow.left = 1987680 + 91440 + int(22 * 5.5 * 12700) + 30000
    S[6].shapes[[s.name for s in S[6].shapes].index('Footer Placeholder 11')].text_frame.text = 'angular.json'
    notes[6] = ('Codefolie „Konfiguration Vitest angular.json“.\n\n'
                'Im Abschnitt „test“ der Datei „angular.json“ steht, wie die Tests laufen. Der „builder“ ist das Werkzeug, '
                'das die Tests ausführt: „@angular/build:unit-test“. Die Zeile „runner“ mit dem Wert „vitest“ wählt Vitest '
                'aus. Der Pfeil zeigt auf diese Zeile. Die frühere Einstellung mit Karma, mit Polyfills für „zone.js“, '
                'fällt weg.')

    # 7 tsconfig.spec.json (Pfeil nach rechts verschieben, weil Zeile laenger)
    S[7].shapes.title.text_frame.text = 'Konfiguration Vitest tsconfig.spec.json'
    r7 = shape_by_name(S[7], 'Rectangle 1')
    ts = r7.text_frame.text.replace('\x0b', '\n').split('\n')
    ts = [x.replace('https://angular.io/config/tsconfig', 'https://angular.dev/reference/configs/file-structure') for x in ts]
    ts = [x.replace('"jasmine"', '"vitest/globals"') for x in ts]
    set_lines(r7, ts)
    notes[7] = ('Codefolie „Konfiguration Vitest tsconfig.spec.json“.\n\n'
                'Die Datei „tsconfig.spec.json“ steuert, wie TypeScript die Testdateien liest. Im Eintrag „types“ steht jetzt '
                '„vitest/globals“ statt „jasmine“. Dadurch kennt TypeScript die Funktionen „describe“, „it“, „expect“ und '
                '„vi“, ohne dass man sie in jeder Testdatei einzeln importieren muss.')

    # 8 Test Runner (Screenshot ersetzen)
    S[8].shapes[[s.name for s in S[8].shapes].index('Footer Placeholder 4')].text_frame.text = 'Vitest Test Result'
    ph = shape_by_name(S[8], 'Inhaltsplatzhalter 4')
    pic = ph._element
    blip = pic.find('.//a:blip', NS)
    rid = blip.get('{%s}embed' % NS['r'])
    img_part = S[8].part.related_part(rid)
    with open(terminal_png, 'rb') as f:
        img_part._blob = f.read()
    # Zuschnitt des alten Screenshots entfernen
    for sr in pic.findall('.//a:srcRect', NS):
        sr.getparent().remove(sr)
    notes[8] = ('Folie: „Test Runner“.\n\n'
                'Mit dem Befehl „ng test“ werden die Tests gestartet. Das Bild zeigt die Ausgabe in der Konsole. Jede Zeile '
                'mit einem Haken steht für eine Testdatei, in der alle Tests bestanden haben. Dahinter steht, wie viele Tests '
                'es in der Datei gibt. Unten fasst Vitest zusammen: Alle sieben Dateien und alle 49 Tests waren erfolgreich. '
                'Wenn ein Test fehlschlägt, zeigt Vitest die Datei, den Test und die Abweichung an.')

    # 9 Vokabular (SmartArt)
    S[9].shapes.title.text_frame.text = 'Vitest Vokabular'
    data, draw = diagram_parts(S[9])
    m = {
        'Suites – describe(String, function)': 'Suites – describe(name, fn)',
        'Specs – it(string, function)': 'Tests (Specs) – it(name, fn)',
        'Eine Suite definiert eine Meng von Spezifikationen': 'Eine Suite bündelt zusammengehörige Tests (describe-Block)',
        'vordefinierte HelferFunktionen für gemeinsame Expectations. z.B.: toBe(expected), toEqual(expected).':
            'vordefinierte Hilfsfunktionen für Erwartungen, z. B.: toBe, toEqual, toContain, toHaveLength, toHaveBeenCalledWith.',
        'komplette Liste (GitHub - JamieMason/Jasmine-Matchers: Write Beautiful Specs with Custom Matchers for Jest and Jasmine).':
            'komplette Liste: vitest.dev/api/expect',
    }
    edit_diagram_text(data, m, 'Folie 9 data')
    # In der Zeichnung steht der Matcher-Text in zwei Absaetzen im selben Shape; dort beide Absaetze mappen.
    edit_diagram_text(draw, {k: v for k, v in m.items()}, 'Folie 9 drawing')
    notes[9] = ('Folie: „Vitest Vokabular“.\n\n'
                'Vier Begriffe sind wichtig. Eine „Suite“ ist eine Gruppe zusammengehöriger Tests. Man schreibt sie mit '
                '„describe“, einem Namen und einer Funktion. Ein „Test“, oft „Spec“ genannt, ist ein einzelner Prüfablauf. '
                'Man schreibt ihn mit „it“, einem Namen und einer Funktion.\n\n'
                'Eine „Expectation“, auf Deutsch Erwartung, steht in der Zeile „expect(actual).toBe(expected)“. Sie '
                'vergleicht den tatsächlichen Wert mit dem erwarteten Wert und ergibt wahr oder falsch. Die Prüffunktionen '
                'wie „toBe“ oder „toEqual“ heißen „Matcher“. Vitest bringt viele davon mit, zum Beispiel für Texte, '
                'Listen und Funktionsaufrufe.')

    # 11 Setup/Teardown (SmartArt)
    data, draw = diagram_parts(S[11])
    m = {'einmal pro Spec (it)': 'einmal pro Test (it)'}
    edit_diagram_text(data, m, 'Folie 11 data')
    edit_diagram_text(draw, m, 'Folie 11 drawing')

    # 18 Mocking
    set_lines(shape_by_name(S[18], 'Rectangle 2'), [
        '// Ersatzobjekt mit Mock-Funktion statt echtem Service',
        'const greeterServiceSpy = { requestName: vi.fn() };',
        'beforeEach(() => {',
        '  TestBed.configureTestingModule({',
        '    imports: [GreeterComponent],',
        '    providers: [',
        '      { provide: GreeterService, useValue: greeterServiceSpy }',
        '    ]',
        '  });',
        '  // Rückgabewert festlegen',
        "  greeterServiceSpy.requestName.mockReturnValue('Tester');",
        '  fixture = TestBed.createComponent(GreeterComponent);',
        '});',
    ])
    notes[18] = ('Codefolie „Mocking Dependencies“.\n\n'
                 'Beim Testen einer Komponente soll nicht der echte Service laufen, der zum Beispiel Daten vom Server holt. '
                 'Stattdessen baut man einen Ersatz. Hier ist es ein einfaches Objekt mit der Funktion „requestName“. Die '
                 'Funktion wird mit „vi.fn()“ erzeugt. Das ist eine Mock-Funktion, die sich merkt, wie oft und womit sie '
                 'aufgerufen wurde.\n\n'
                 'In „providers“ sagt man Angular: Wenn jemand den „GreeterService“ anfordert, gib stattdessen dieses Objekt '
                 'heraus. Mit „mockReturnValue“ legt man fest, was die Mock-Funktion zurückgibt, hier den Text „Tester“.')

    # 20 Async result
    s20 = S[20]
    for nm in ('Rectangle 3', 'Rectangle 4'):
        e = shape_by_name(s20, nm)._element
        e.getparent().remove(e)
    r20 = shape_by_name(s20, 'Rectangle 2')
    r20.width = 8507457
    set_lines(r20, [
        "greeterServiceSpy.requestNames.mockReturnValue(of(['Tester1', 'Tester2']));",
        '...',
        "it('should show nothing at the beginning', async () => {",
        '  fixture.detectChanges();',
        '  await fixture.whenStable();',
        "  expect(componentRootElement.querySelector('p')).toBeNull();",
        '});',
        '',
        "it('after requesting data 2 p-elements should be visible', async () => {",
        '  component.requestNames();',
        '  fixture.detectChanges();',
        '  await fixture.whenStable();',
        "  expect(componentRootElement.querySelectorAll('p')).toHaveLength(2);",
        '});',
    ])
    set_font(r20, 1400)
    notes[20] = ('Codefolie „Async result“.\n\n'
                 'Hier wird ein Service nachgebaut, der seine Daten erst später liefert. „of“ erzeugt dafür ein Observable, '
                 'das sofort zwei Namen liefert. Der erste Test prüft, dass am Anfang noch kein Absatz sichtbar ist. Der '
                 'zweite Test ruft die Methode „requestNames“ auf und prüft danach, dass zwei Absätze erscheinen.\n\n'
                 'Wichtig ist das Wort „await“ vor „fixture.whenStable()“. Es lässt den Test warten, bis die Anzeige '
                 'aktualisiert ist. Ohne „await“ würde der Test schon enden, bevor die Prüfung läuft, und könnte falsch '
                 'bestanden werden. Die Prüfung der Anzahl heißt in Vitest „toHaveLength“.')

    # 21 Throw Error
    set_lines(shape_by_name(S[21], 'Rectangle 1'), [
        "greeterServiceSpy.requestNames.mockReturnValue(throwError(() => new Error('TestError')));",
    ])
    notes[21] = ('Codefolie „Throw Error“.\n\n'
                 'So testet man den Fehlerfall. Die Mock-Funktion liefert diesmal ein Observable, das sofort einen Fehler '
                 'meldet. Damit prüft man, ob die Komponente mit einem fehlgeschlagenen Aufruf richtig umgeht.')

    # 23 Uebung 1
    ph23 = shape_by_name(S[23], 'Inhaltsplatzhalter 4')
    for p in ph23.text_frame.paragraphs:
        t = ''.join(r.text for r in p.runs)
        if t.startswith('Mocke den Service'):
            set_para_text(p._p, 'Mocke den Service mit vi.fn() und gib 0, 1, 2 Kunden zurück')
    notes[23] = ('Folie: „Übung 1“.\n\n'
                 'Erklärung für die Dolmetscherin:\n'
                 'Die Teilnehmer testen die „CustomerListComponent“. Dabei ersetzen sie den Service durch ein Ersatzobjekt mit '
                 '„vi.fn()“, das keinen, einen oder zwei Kunden liefert, und prüfen, ob die Liste richtig aufgebaut ist. '
                 'Außerdem testen sie die Pipe „currentActiveCustomers“ mit verschiedenen Werten für „daysInPast“.')

    # 29 Cypress Attribut-Selektor (Reactive Forms sind nur noch Wahlthema)
    ph29 = shape_by_name(S[29], 'Inhaltsplatzhalter 2')
    for p in ph29.text_frame.paragraphs:
        for r in p.runs:
            if 'formControlName' in r.text:
                r.text = r.text.replace('[formControlName=username]', '[name=username]')

    # Neue Folie: Umstieg von Jasmine auf Vitest, hinter Folie 7
    idx7 = list(prs.slides._sldIdLst).index(
        [e for e in prs.slides._sldIdLst][6])
    new = clone_slide(prs, S[4], idx7)
    new.shapes.title.text_frame.text = 'Umstieg von Jasmine auf Vitest (Bestandsprojekte)'
    set_lines(shape_by_name(new, 'Rectangle 1'), [
        '// Jasmine / Karma   →   Vitest',
        'jasmine.createSpy()   →   vi.fn()',
        "jasmine.createSpyObj('S', ['a'])   →   { a: vi.fn() }",
        "spyOn(obj, 'm')   →   vi.spyOn(obj, 'm')",
        'spy.and.returnValue(x)   →   spy.mockReturnValue(x)',
        'spy.and.callFake(fn)   →   spy.mockImplementation(fn)',
        'spy.calls.count()   →   spy.mock.calls.length',
        'expect(list).toHaveSize(2)   →   expect(list).toHaveLength(2)',
        'it(..., (done) => { ...; done(); })   →   it(..., async () => { await ...; })',
        '// karma.conf.js, src/test.ts, polyfills.ts entfallen; Typen: "vitest/globals"',
    ])
    new.shapes[[s.name for s in new.shapes].index('Footer Placeholder 11')].text_frame.text = 'Vitest'
    notes_new = ('Codefolie „Umstieg von Jasmine auf Vitest (Bestandsprojekte)“.\n\n'
                 'Viele bestehende Projekte haben noch Tests im alten Stil mit Jasmine. Diese Folie ist ein Spickzettel für den '
                 'Umstieg. Links steht die alte Schreibweise, rechts die neue für Vitest. Die Funktionen „describe“, „it“ '
                 'und „expect“ bleiben gleich. Anders sind vor allem die Ersatzfunktionen: „jasmine.createSpy“ wird zu '
                 '„vi.fn“, „spyOn“ wird zu „vi.spyOn“, und „and.returnValue“ wird zu „mockReturnValue“.\n\n'
                 'Auch die Prüfung der Listenlänge heißt anders: Aus „toHaveSize“ wird „toHaveLength“. Tests mit „done“-'
                 'Funktion schreibt man mit „async“ und „await“ um. Die Dateien „karma.conf.js“, „test.ts“ und „polyfills.ts“ '
                 'werden nicht mehr gebraucht.')
    set_notes(new, notes_new)


    # Sprechtexte fuer die uebrigen (inhaltlich unveraenderten) Folien
    notes.update({
        2: ('Folie: „Testpyramide“.\n\n'
            'Die Pyramide zeigt, wie viele Tests es von welcher Art geben sollte. Unten stehen die „Unit Tests“. Das sind '
            'kleine, schnelle Tests für einzelne Bausteine, zum Beispiel einen Service oder eine Pipe. Davon gibt es viele. '
            'In der Mitte stehen die „Integrationstests“. Sie prüfen, ob mehrere Bausteine zusammen richtig arbeiten, zum '
            'Beispiel eine Komponente mit ihrem Template.\n\n'
            'Oben stehen die „Akzeptanztests“, auch „End-to-End-Tests“ genannt. Sie spielen die ganze Anwendung im Browser '
            'durch, so wie ein Benutzer. Sie sind langsam und aufwendig, deshalb gibt es nur wenige. Je weiter oben, desto '
            'weniger Tests, desto länger dauern sie.'),
        10: ('Folie: „Einfaches Beispiel – Testsubjekt ExampleService“.\n\n'
             'Das ist ein vollständiges, kleines Beispiel für eine Testdatei. Das „Testsubjekt“ ist die Klasse, die getestet '
             'wird, hier der „ExampleService“. Die Beschriftungen am Rand benennen die Bausteine. „describe“ bildet die '
             '„Suite“, also die Gruppe der Tests. „beforeEach“ ist das „Setup“, die Vorbereitung, die vor jedem einzelnen '
             'Test läuft. Hier wird der Service über „TestBed.inject“ bereitgestellt.\n\n'
             'Der Test selbst steht in „it“. Er enthält eine „Expectation“, auf Deutsch Erwartung: „expect(service)“ nimmt den '
             'Wert, und „toBeTruthy“ ist der „Matcher“, also die Prüfung. Er bedeutet: Der Service existiert. Dieser Test '
             'ist bei jedem neuen Service automatisch vorhanden.'),
        11: ('Kapitelfolie: „Setup, Teardown“.\n\n'
             '„Setup“ heißt Vorbereitung, „Teardown“ heißt Aufräumen. Die Folie zeigt, wann Vorbereitung und Aufräumen laufen. '
             '„beforeEach“ und „afterEach“ laufen vor und nach jedem einzelnen Test. „beforeAll“ und „afterAll“ laufen nur '
             'einmal für die ganze Suite, also einmal vor dem ersten und einmal nach dem letzten Test der Gruppe.'),
        12: ('Folie: „Setup initialisiere Testwelt“.\n\n'
             'In „beforeEach“ baut man vor jedem Test die „Testwelt“ auf, also eine saubere Umgebung. „TestBed.configureTestingModule“ '
             'richtet diese Umgebung ein. Man übergibt ein Objekt mit den Einstellungen, zum Beispiel welche Komponenten '
             'und Dienste gebraucht werden. Danach holt „TestBed.inject“ den Service aus dieser Umgebung. Weil das vor jedem '
             'Test neu passiert, beeinflussen sich die Tests nicht gegenseitig.'),
        13: ('Folie: „Expectation“.\n\n'
             'Ein Test hat zwei Teile. Mit „it“ beschreibt man in einem Satz, was der Test prüft, zum Beispiel „should be created“. '
             'Danach folgt der Testcode. Darin steht die „Expectation“: „expect“ nimmt den tatsächlichen Wert, und ein Matcher wie '
             '„toBeTruthy“ prüft ihn. Ist die Prüfung nicht erfüllt, schlägt der Test fehl, und Vitest meldet das in der Konsole.'),
        14: ('Folie: „UnitTest Component“.\n\n'
             'Hier wird das Beispiel für den Test einer Komponente vorgestellt. Links steht die „GreeterComponent“. Sie hat einen '
             'Namen als „Signal“ und ein Template. Rechts steht das Template. Es zeigt die Überschrift „Hello“ und den aktuellen Namen. '
             'Der Test soll prüfen, dass sich die Überschrift ändert, wenn der Name gesetzt wird.'),
        15: ('Codefolie „UnitTests Component – Setup“.\n\n'
             'Für Komponenten sieht die Vorbereitung ähnlich aus wie bei Services. Eine Standalone-Komponente wird bei „imports“ '
             'angegeben. Dann erzeugt „TestBed.createComponent“ die Komponente. Das Ergebnis ist ein „fixture“, das ist ein Steuerobjekt '
             'für den Test. Darüber erreicht man die Komponenteninstanz, ihr HTML-Element und das „debugElement“, mit dem man '
             'im HTML suchen kann. „fixture.detectChanges()“ löst das erste Zeichnen der Oberfläche aus.'),
        16: ('Codefolie „UnitTests Component – Set“.\n\n'
             'Der Test setzt zuerst den Namen im Signal auf „Tester“. Dann sorgt „detectChanges“ dafür, dass die Anzeige '
             'aktualisiert wird, und „await fixture.whenStable()“ wartet, bis alle laufenden Vorgänge beendet sind. Danach prüft der Test, '
             'dass in der Überschrift „Hello Tester“ steht. Es gibt zwei Wege, die Überschrift zu finden: über das HTML-Element mit '
             '„querySelector“ oder über das „debugElement“ mit „By.css“.'),
        17: ('Folie: „Dependency Injection“.\n\n'
             'Jetzt bekommt die Komponente ihren Namen von einem Service. Links holt sich die „GreeterComponent“ den „GreeterService“ mit '
             '„inject“ und setzt den Namen in „ngOnInit“. Rechts steht der Service. Er gibt aktuell immer „some example name“ zurück. '
             'Beim Testen soll nicht der echte Service laufen, sondern ein Ersatz. Wie das geht, zeigt die nächste Folie.'),
        19: ('Folie: „Async result“.\n\n'
             'Dieses Beispiel zeigt eine Abfrage, deren Ergebnis erst später ankommt. Links liefert der Service ein „Observable“, hier '
             'wäre ein Aufruf an den Server. Rechts steht die Komponente: Die Methode „requestNames“ abonniert das Ergebnis und '
             'speichert die Namen im Signal. Das Template zeigt jeden Namen mit „@for“ als Absatz an. Am Anfang ist die Liste leer.'),
        22: ('Folie: „Trigger Eventhandling“.\n\n'
             'Hier wird getestet, ob ein Klick richtig verarbeitet wird. Links hat jeder Name einen Klick-Handler. Er ruft '
             '„setSelectedName“ auf, und die Komponente sendet den Namen über „selected“ nach außen. Rechts steht der Test: Er '
             'merkt sich den gesendeten Namen, sucht alle Absätze, löst beim ersten Absatz mit „triggerEventHandler“ einen Klick aus '
             'und prüft, dass „Tester1“ gesendet wurde.'),
        24: ('Kapitelfolie: „Cypress“ – „End2End Tests“.\n\n'
             'Ab hier geht es um End-to-End-Tests, also Tests der ganzen Anwendung im Browser. „Cypress“ ist ein Werkzeug dafür. '
             'Es öffnet einen echten Browser, ruft die Anwendung auf und bedient sie wie ein Benutzer.'),
        25: ('Folie: „Installation Cypress“.\n\n'
             'Der Befehl „ng e2e“ startet die End-to-End-Tests. Angular bringt dafür kein Werkzeug mit. Deshalb meldet die '
             'Konsole, dass kein „e2e“-Ziel vorhanden ist, und schlägt mehrere Pakete vor, zum Beispiel Cypress, Playwright oder '
             'WebdriverIO. Die Frage, ob man ein Paket hinzufügen möchte, beantwortet man hier mit Cypress. Danach richtet '
             'Angular das Paket ein.'),
        26: ('Folie: „Konfig“.\n\n'
             'Das Bild zeigt die Dateien, die nach der Installation von Cypress im Projekt entstehen. Im neuen Ordner „cypress“ liegt '
             'unter „e2e“ die Testdatei „spec.cy.ts“. Weitere Ordner enthalten Beispieldaten („fixtures“) und Hilfsdateien („support“). '
             'Die Datei „tsconfig.json“ gehört zu den Cypress-Tests. Mit der Datei „spec.cy.ts“ arbeitet die folgende Übung.'),
        27: ('Codefolie „Bestandteile eines Tests“.\n\n'
             'Ein Cypress-Test ist ähnlich aufgebaut wie ein Unit Test. „describe“ ist die „Suite“, „it“ ist ein einzelner Test, die '
             '„Spec“. Der Test ruft mit „cy.visit“ die Startseite auf. „cy.pause“ hält den Test an, damit man im Browser zusehen kann. '
             'Danach sucht „cy.get“ das erste Listenelement und prüft mit „should“, dass es die Klasse „selected“ hat. Dieser Teil ist '
             'die Erwartung mit dem Matcher.'),
        28: ('Folie: „Übung 2“.\n\n'
             'Erklärung für die Dolmetscherin:\n'
             'Die Teilnehmer installieren Cypress mit dem Befehl „ng e2e“. Dann öffnen sie die erzeugte Testdatei „spec.cy.ts“ und ändern '
             'die erwartete Überschrift von „app is running“ in „Invoice Manager App“, denn so heißt die Überschrift in der Anwendung. '
             'Zum Schluss starten sie „ng e2e“ erneut und öffnen im Cypress-Fenster die Datei „spec.cy.ts“, um den Test laufen zu sehen.'),
        29: ('Folie: „Cypress Elements – DSL“.\n\n'
             'Eine Webseite besteht aus Elementen. Mit Cypress wählt man Elemente aus und bedient sie, und so schreibt man '
             'Tests für die Funktion. Man kann Elemente auf drei Arten finden: über eine eindeutige Kennung mit „#“, über ein Attribut in '
             'eckigen Klammern oder über den Namen des Elements, zum Beispiel „ul“. Mit „type“ trägt man Text in ein Feld ein, '
             'hier Benutzername und Passwort. „DSL“ bedeutet: Die Befehle lesen sich fast wie ein Satz.'),
        30: ('Folie: „Cypress Elements – Element API“.\n\n'
             'Die Tabelle zeigt wichtige Befehle für ein ausgewähltes Element. „type“ füllt ein Textfeld aus. „click“ klickt auf das '
             'Element oder wählt es aus. „first“ gibt das erste Element zurück, wenn es mehrere gibt. „focus“ setzt den Fokus auf das '
             'Element. „should“ leitet eine Prüfung ein. Dazu gibt es mehr auf der nächsten Folie.'),
        31: ('Folie: „Assertions und Matchers“.\n\n'
             'Eine „Assertion“ ist eine Prüfung. In Cypress beginnt sie mit „should“. Die Beispiele prüfen, ob ein Element existiert '
             'oder nicht existiert, ob es sichtbar ist oder eine bestimmte Klasse hat, ob ein Wert nicht einem bestimmten Text '
             'entspricht und ob die Adresse im Browser einen bestimmten Text enthält. Die Wörter in Anführungszeichen, zum Beispiel '
             '„be.visible“, sind die „Matcher“.'),
        32: ('Folie: „Übung 3“.\n\n'
             'Erklärung für die Dolmetscherin:\n'
             'Die Teilnehmer schreiben einen neuen Test mit dem Namen „navigation_works“. Er soll den ersten Eintrag der Kundenliste '
             'anklicken. Danach soll der Test prüfen, dass die Anwendung auf der Detailseite ist, und zwar mit einer Prüfung der Adresse. '
             'Außerdem soll er prüfen, dass das Datum der letzten Bestellung angezeigt wird.'),
    })

    for n, t in notes.items():
        set_notes(S[n], t)

    prs.save(dst)
    print('geschrieben:', dst, '| Folien:', len(prs.slides))


if __name__ == '__main__':
    if len(sys.argv) < 3:
        raise SystemExit(__doc__)
    main(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else 'terminal.png')
