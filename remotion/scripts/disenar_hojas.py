# Diseña cada hoja del álbum: agrupa fotos por forma y las ubica SIN recortar (proporción original)
import json, random, itertools, math
S = "/tmp/claude-0/-home-user-ProfeTama/ad84fd2c-aee5-5e50-8a1b-3f41395a4531/scratchpad"
OUT = "/home/user/ProfeTama/remotion/src/Album/paginas.json"
e = json.load(open(f"{S}/album_estado.json"))
por = {v["archivo"][:-4]: v for v in e.values()}
chicos = ["a157","a158","a150","a153","a155","a156","a151","a161","a149","a154","a148","a147",
          "a142","a141","a145","a144","a143","a034","a032","a030","a027","a033","a029","a026","a139","a028","a031"]
final = "a002"
resto = [k for k in sorted(por) if k not in chicos and k != final]
random.Random(2026).shuffle(resto)
resto = [k for k in resto if k not in ("a112", "a093")]   # fotos repetidas

# área útil dentro de la hoja (coordenadas de la hoja 1800x1000)
AX, AY, AW, AH = 215, 90, 1520, 820
GAP = 60      # espacio entre fotos (deja lugar para marcos y cintas)
M = 16        # borde blanco del marco alrededor de la foto

def asp(k): return por[k]["ancho"] / por[k]["alto"]

def particiones(items, maxg=3):
    if not items: yield []; return
    first, rest = items[0], items[1:]
    for p in particiones(rest, maxg):
        for i in range(len(p)):
            yield p[:i] + [[first] + p[i]] + p[i+1:]
        if len(p) < maxg: yield [[first]] + p

def layout_filas(grupos):
    # cada fila: fotos una al lado de otra con la misma altura (sin recorte)
    alturas = []
    for g in grupos:
        s = sum(asp(k) for k in g)
        alturas.append((AW - GAP * (len(g) - 1) - 2 * M * len(g)) / s)
    total = sum(alturas) + GAP * (len(grupos) - 1) + 2 * M * len(grupos)
    esc = min(1.0, AH / total)
    res = []; y = AY + (AH - total * esc) / 2
    for g, h0 in zip(grupos, alturas):
        h = h0 * esc
        ancho = sum(asp(k) * h for k in g) + (GAP * esc) * (len(g) - 1) + 2 * M * len(g)
        x = AX + (AW - ancho) / 2
        for k in g:
            w = asp(k) * h
            res.append((k, x + M + w / 2, y + M + h / 2, w, h)); x += w + 2 * M + GAP * esc
        y += h + 2 * M + GAP * esc
    return res

def layout_columnas(grupos):
    anchos = []
    for g in grupos:
        s = sum(1 / asp(k) for k in g)
        anchos.append((AH - GAP * (len(g) - 1) - 2 * M * len(g)) / s)
    total = sum(anchos) + GAP * (len(grupos) - 1) + 2 * M * len(grupos)
    esc = min(1.0, AW / total)
    res = []; x = AX + (AW - total * esc) / 2
    for g, w0 in zip(grupos, anchos):
        w = w0 * esc
        alto = sum(w / asp(k) for k in g) + (GAP * esc) * (len(g) - 1) + 2 * M * len(g)
        y = AY + (AH - alto) / 2
        for k in g:
            h = w / asp(k)
            res.append((k, x + M + w / 2, y + M + h / 2, w, h)); y += h + 2 * M + GAP * esc
        x += w + 2 * M + GAP * esc
    return res

def mejor_layout(fotos):
    mejor = None
    for p in particiones(list(fotos)):
        for f in (layout_filas, layout_columnas):
            lug = f(p)
            area = sum(w * h for _, _, _, w, h in lug) / (AW * AH)
            menor = min(min(w, h) for _, _, _, w, h in lug)       # evita fotos diminutas
            pareja = min(w * h for *_, w, h in lug) / max(w * h for *_, w, h in lug)
            score = area + 0.2 * pareja + (0 if menor > 210 else -1)
            if mejor is None or score > mejor[0]: mejor = (score, area, lug)
    return mejor

TARGET = 4.3
def armar(lista, ventana, ordenado):
    paginas = []; pool = list(lista)
    while pool:
        cand = pool[:ventana]; best = None
        for n in range(3, 7):
            if n > len(pool): break
            if 0 < len(pool) - n < 3: continue   # que no quede una hoja casi vacía
            combos = [tuple(cand[:n])] if ordenado else itertools.combinations(cand, n)
            for c in combos:
                if ordenado is False and cand[0] not in c: continue   # avanza siempre
                sc, area, lug = mejor_layout(c)
                total = sc - 0.18 * abs(n - TARGET)
                if best is None or total > best[0]: best = (total, c, lug, area)
        if best is None:  # queda 1 sola
            sc, area, lug = mejor_layout(tuple(pool[:1])); best = (sc, tuple(pool[:1]), lug, area)
        paginas.append(best[2]); [pool.remove(k) for k in best[1]]
    return paginas

pag = armar(chicos, 6, ordenado=False) + armar(resto, 9, ordenado=False)
pag.append(mejor_layout((final,))[2])

# pegatinas en los espacios libres (sin tapar fotos)
def libre(x, y, s, rects):
    if x - s/2 < 150 or x + s/2 > 1785 or y - s/2 < 18 or y + s/2 > 985: return False
    for (cx, cy, w, h) in rects:
        if abs(x - cx) < (w/2 + 4 + s/2) and abs(y - cy) < (h/2 + 4 + s/2): return False
    return True
salida = []
for i, lug in enumerate(pag):
    r = random.Random(500 + i)
    rects = [(cx, cy, w, h) for _, cx, cy, w, h in lug]
    stickers = []; figuras = []
    for s in (190, 160, 135, 115):
        for _ in range(400):
            if len(stickers) >= 4: break
            x, y = r.uniform(160, 1780), r.uniform(25, 980)
            ocupado = rects + [(sx, sy, ss, ss) for sx, sy, ss, _ in stickers]
            if libre(x, y, s, ocupado): stickers.append((x, y, s, r.randrange(17)))
    for _ in range(600):
        if len(figuras) >= 9: break
        s = r.uniform(40, 70); x, y = r.uniform(160, 1780), r.uniform(25, 980)
        ocupado = rects + [(sx, sy, ss, ss) for sx, sy, ss, _ in stickers] + [(fx, fy, fs, fs) for fx, fy, fs, _ in figuras]
        if libre(x, y, s, ocupado): figuras.append((x, y, s, r.randrange(70)))
    salida.append({
        "fotos": [{"archivo": f"album/{k}.jpg", "cx": round(cx, 1), "cy": round(cy, 1), "w": round(w, 1), "h": round(h, 1),
                   "rot": round(r.uniform(-2.2, 2.2), 2)} for k, cx, cy, w, h in lug],
        "pegatinas": [{"x": round(x), "y": round(y), "s": s, "tipo": t, "rot": round(r.uniform(-18, 18))} for x, y, s, t in stickers],
        "figuras": [{"x": round(x), "y": round(y), "s": round(s), "tipo": t, "rot": round(r.uniform(-30, 30))} for x, y, s, t in figuras],
    })
json.dump(salida, open(OUT, "w"))
areas = [sum(f["w"]*f["h"] for f in p["fotos"])/(AW*AH) for p in salida]
print(len(salida), "hojas | fotos:", sum(len(p["fotos"]) for p in salida), "| relleno medio", round(sum(areas)/len(areas), 2), "min", round(min(areas), 2))
from collections import Counter; print(Counter(len(p["fotos"]) for p in salida))
