"""Einfache Diagramme und Code-Kästen als native PowerPoint-Formen (für build_deck.py).

Eine Folie vom Typ `content` kann ein Feld `"diagram"` haben. Die Aufzählung steht dann links,
das Diagramm rechts. Unterstützte Arten (`kind`):

  flow     {"steps": ["A", "B", "C"], "note": "optional"}           Kästen untereinander mit Pfeilen
  layers   {"layers": ["oben", "mitte", "unten"], "note": ""}        gestapelte Schichten
  tree     {"root": "Eltern", "children": ["A", "B", "C"]}           ein Kasten, darunter Kinder
  compare  {"left": {"title": "", "items": []}, "right": {...}}     zwei Spalten
  cycle    {"steps": ["A", "B", "C"]}                                Kreislauf (3-4 Schritte, als Pfeilreihe im Quadrat)
  code     {"text": "zeilen\\nmit\\numbruch", "title": "Dateiname"}  Code-Kasten (Monospace)

Alle Maße in EMU. Der Bereich rechts ist X0..X0+W, Y0..Y0+H.
"""
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE, MSO_CONNECTOR
from pptx.enum.text import MSO_ANCHOR, PP_ALIGN
from pptx.oxml.ns import qn
from pptx.util import Emu, Pt

X0, Y0, W, H = 7000000, 1850000, 4350000, 4350000

GREEN = RGBColor(0x1E, 0x9E, 0x78)
DARK = RGBColor(0x2B, 0x3A, 0x42)
LIGHT = RGBColor(0xE3, 0xF4, 0xEE)
GREY = RGBColor(0xF2, 0xF2, 0xF2)
AMBER = RGBColor(0xFC, 0xE9, 0xD6)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
CODEBG = RGBColor(0xF6, 0xF8, 0xFA)
FONT = "Segoe UI"


def _text(shape, text, size, color=DARK, bold=False, align=PP_ALIGN.CENTER, font=FONT, anchor=MSO_ANCHOR.MIDDLE):
    tf = shape.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    tf.margin_left = tf.margin_right = Emu(70000)
    tf.margin_top = tf.margin_bottom = Emu(30000)
    lines = text.split("\n")
    for i, line in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        r = p.add_run()
        r.text = line
        r.font.size = Pt(size)
        r.font.bold = bold
        r.font.name = font
        r.font.color.rgb = color


def _box(slide, x, y, w, h, text, fill=LIGHT, line=GREEN, size=14, color=DARK, bold=False, shape=MSO_SHAPE.ROUNDED_RECTANGLE):
    s = slide.shapes.add_shape(shape, Emu(x), Emu(y), Emu(w), Emu(h))
    s.shadow.inherit = False
    s.fill.solid()
    s.fill.fore_color.rgb = fill
    if line is None:
        s.line.fill.background()
    else:
        s.line.color.rgb = line
        s.line.width = Pt(1.25)
    if shape == MSO_SHAPE.ROUNDED_RECTANGLE:
        s.adjustments[0] = 0.18
    _text(s, text, size, color=color, bold=bold)
    return s


def _arrow(slide, x1, y1, x2, y2):
    c = slide.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Emu(x1), Emu(y1), Emu(x2), Emu(y2))
    c.line.color.rgb = GREEN
    c.line.width = Pt(2)
    ln = c.line._get_or_add_ln()
    tail = ln.makeelement(qn("a:tailEnd"), {"type": "triangle", "w": "med", "len": "med"})
    ln.append(tail)
    return c


def _note(slide, text, y):
    s = slide.shapes.add_textbox(Emu(X0), Emu(y), Emu(W), Emu(380000))
    _text(s, text, 12, color=RGBColor(0x59, 0x59, 0x59), align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.TOP)
    return s


def flow(slide, d):
    steps = d["steps"]
    n = len(steps)
    note_h = 450000 if d.get("note") else 0
    gap = 250000 if n <= 5 else 180000
    h = min(780000, int((H - note_h - gap * (n - 1)) / n))
    size = 15 if h > 600000 else 13
    for i, t in enumerate(steps):
        y = Y0 + i * (h + gap)
        last = i == n - 1
        _box(slide, X0, y, W, h, t, fill=GREEN if last and d.get("highlight_last") else LIGHT,
             color=WHITE if last and d.get("highlight_last") else DARK, size=size, bold=last and d.get("highlight_last", False))
        if not last:
            _arrow(slide, X0 + W // 2, y + h, X0 + W // 2, y + h + gap)
    if d.get("note"):
        _note(slide, d["note"], Y0 + n * h + (n - 1) * gap + 60000)


def layers(slide, d):
    items = d["layers"]
    n = len(items)
    note_h = 450000 if d.get("note") else 0
    gap = 90000
    h = min(900000, int((H - note_h - gap * (n - 1)) / n))
    fills = [GREEN, RGBColor(0x5B, 0xB9, 0x9C), RGBColor(0xA8, 0xDC, 0xCB), LIGHT, GREY]
    for i, t in enumerate(items):
        f = fills[min(i, len(fills) - 1)]
        col = WHITE if i < 2 else DARK
        _box(slide, X0, Y0 + i * (h + gap), W, h, t, fill=f, line=None, color=col, size=15, bold=i < 2)
    if d.get("note"):
        _note(slide, d["note"], Y0 + n * h + (n - 1) * gap + 60000)


def tree(slide, d):
    kids = d["children"]
    n = len(kids)
    cols = 2 if n > 3 else n
    rows = (n + cols - 1) // cols
    root_h = 700000
    gap_y = 450000
    gap_x = 150000
    cw = int((W - gap_x * (cols - 1)) / cols)
    ch = min(750000, int((H - root_h - gap_y - 120000 * (rows - 1)) / rows))
    _box(slide, X0 + W // 4, Y0, W // 2, root_h, d["root"], fill=GREEN, line=None, color=WHITE, size=15, bold=True)
    for i, t in enumerate(kids):
        r, c = divmod(i, cols)
        # letzte Zeile zentrieren
        in_row = cols if (r + 1) * cols <= n else n - r * cols
        total = in_row * cw + (in_row - 1) * gap_x
        x = X0 + (W - total) // 2 + c * (cw + gap_x)
        y = Y0 + root_h + gap_y + r * (ch + 120000)
        _box(slide, x, y, cw, ch, t, size=13)
        if r == 0:
            _arrow(slide, X0 + W // 2, Y0 + root_h, x + cw // 2, y)


def compare(slide, d):
    gap = 150000
    cw = (W - gap) // 2
    for i, key in enumerate(("left", "right")):
        side = d[key]
        x = X0 + i * (cw + gap)
        head = _box(slide, x, Y0, cw, 600000, side["title"], fill=GREEN if i == 0 else DARK, line=None, color=WHITE, size=15, bold=True)
        items = side["items"]
        ih = min(620000, int((H - 600000 - 100000 - 90000 * (len(items) - 1)) / max(1, len(items))))
        for j, t in enumerate(items):
            _box(slide, x, Y0 + 700000 + j * (ih + 90000), cw, ih, t, fill=LIGHT if i == 0 else GREY,
                 line=GREEN if i == 0 else RGBColor(0x8A, 0x96, 0x9C), size=13)


def cycle(slide, d):
    steps = d["steps"]
    n = len(steps)
    bw, bh = 1850000, 700000
    pos = [(X0, Y0 + 200000), (X0 + W - bw, Y0 + 200000), (X0 + W - bw, Y0 + 2400000), (X0, Y0 + 2400000)][:n]
    for t, (x, y) in zip(steps, pos):
        _box(slide, x, y, bw, bh, t, size=14)
    for i in range(n):
        (x1, y1), (x2, y2) = pos[i], pos[(i + 1) % n]
        if y1 == y2:
            if x2 > x1:
                _arrow(slide, x1 + bw, y1 + bh // 2, x2, y2 + bh // 2)
            else:
                _arrow(slide, x1, y1 + bh // 2, x2 + bw, y2 + bh // 2)
        else:
            if y2 > y1:
                _arrow(slide, x1 + bw // 2, y1 + bh, x2 + bw // 2, y2)
            else:
                _arrow(slide, x1 + bw // 2, y1, x2 + bw // 2, y2 + bh)
    if d.get("note"):
        _note(slide, d["note"], Y0 + 1550000)


def code(slide, d):
    lines = d["text"].split("\n")
    size = 14 if len(lines) <= 9 and max(len(l) for l in lines) <= 36 else 12
    title = d.get("title")
    top = Y0
    if title:
        _box(slide, X0, top, W, 380000, title, fill=DARK, line=None, color=WHITE, size=12, shape=MSO_SHAPE.RECTANGLE)
        top += 380000
    h = min(H - (380000 if title else 0), int(len(lines) * size * 1.35 * 12700) + 220000)
    s = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Emu(X0), Emu(top), Emu(W), Emu(h))
    s.shadow.inherit = False
    s.fill.solid()
    s.fill.fore_color.rgb = CODEBG
    s.line.color.rgb = RGBColor(0xC8, 0xD0, 0xD6)
    s.line.width = Pt(1)
    _text(s, d["text"], size, color=DARK, align=PP_ALIGN.LEFT, font="Consolas", anchor=MSO_ANCHOR.TOP)
    s.text_frame.margin_left = Emu(120000)
    s.text_frame.margin_top = Emu(90000)
    if d.get("note"):
        _note(slide, d["note"], top + h + 60000)


KINDS = {"flow": flow, "layers": layers, "tree": tree, "compare": compare, "cycle": cycle, "code": code}


def validate(d, where):
    """Gibt eine Fehlermeldung oder None zurück."""
    if not isinstance(d, dict) or d.get("kind") not in KINDS:
        return "%s: diagram.kind muss eine von %s sein" % (where, ", ".join(KINDS))
    k = d["kind"]
    need = {"flow": "steps", "layers": "layers", "tree": "children", "compare": "left", "cycle": "steps", "code": "text"}[k]
    if need not in d:
        return "%s: diagram (%s) braucht '%s'" % (where, k, need)
    if k == "tree" and "root" not in d:
        return "%s: diagram (tree) braucht 'root'" % where
    if k == "compare" and "right" not in d:
        return "%s: diagram (compare) braucht 'right'" % where
    if k == "cycle" and not 3 <= len(d["steps"]) <= 4:
        return "%s: diagram (cycle) braucht 3 oder 4 Schritte" % where
    if k == "flow" and not 2 <= len(d["steps"]) <= 6:
        return "%s: diagram (flow) braucht 2 bis 6 Schritte" % where
    if k == "layers" and not 2 <= len(d["layers"]) <= 6:
        return "%s: diagram (layers) braucht 2 bis 6 Ebenen" % where
    if k == "tree" and not 2 <= len(d["children"]) <= 6:
        return "%s: diagram (tree) braucht 2 bis 6 Kinder" % where
    if k == "code" and len(d["text"].split("\n")) > 16:
        return "%s: diagram (code) höchstens 16 Zeilen" % where
    return None


def draw(slide, d):
    KINDS[d["kind"]](slide, d)
