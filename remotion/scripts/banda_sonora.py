"""
Genera la banda sonora original (estilo synthwave años 80) sincronizada con
la composición "Colacion". Uso:  python3 scripts/banda_sonora.py
Requiere numpy y scipy. Salida: public/audio/banda-sonora.wav
"""
import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt
from scipy.io import wavfile

SR = 44100
FPS = 30
# Debe coincidir con ESCENAS en src/Colacion/config.ts (frames)
ESC = dict(canal=54, noticia=66, moderno=105, rebobinado=75, tituloRetro=120, fotos=360, final=120)
T = {}
acc = 0
for k, v in ESC.items():
    T[k] = acc / FPS
    acc += v
DUR = acc / FPS
N = int(DUR * SR) + SR
mix = np.zeros((N, 2))
rng = np.random.default_rng(7)

def t_(d):
    return np.arange(int(d * SR)) / SR

def lp(x, f, o=2):
    return sosfilt(butter(o, f, "low", fs=SR, output="sos"), x)

def hp(x, f, o=2):
    return sosfilt(butter(o, f, "high", fs=SR, output="sos"), x)

def bp(x, lo, hi, o=2):
    return sosfilt(butter(o, [lo, hi], "band", fs=SR, output="sos"), x)

def add(sig, start, gain=1.0, pan=0.0):
    i = int(start * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    l = gain * np.sqrt((1 - pan) / 2) * np.sqrt(2)
    r = gain * np.sqrt((1 + pan) / 2) * np.sqrt(2)
    if sig.ndim == 1:
        mix[i : i + len(sig), 0] += sig * l
        mix[i : i + len(sig), 1] += sig * r
    else:
        mix[i : i + len(sig)] += sig * [l, r]

def env(n, a=0.005, d=0.1, s=0.7, r=0.1, dur=None):
    total = n
    e = np.ones(total) * s
    na, nd, nr = int(a * SR), int(d * SR), int(r * SR)
    na = min(na, total); e[:na] = np.linspace(0, 1, na)
    nd2 = min(nd, total - na)
    e[na : na + nd2] = np.linspace(1, s, nd2)
    if nr > 0 and nr < total:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e

def saw(f, d, detune=0.0):
    t = t_(d)
    out = np.zeros_like(t)
    for dt in ([0] if detune == 0 else [-detune, 0, detune]):
        ff = f * (1 + dt)
        out += 2 * ((t * ff + rng.random()) % 1) - 1
    return out / (1 if detune == 0 else 3)

def square(f, d, pw=0.5):
    t = t_(d)
    return np.where((t * f) % 1 < pw, 1.0, -1.0)

def nota(n):  # n: número MIDI
    return 440 * 2 ** ((n - 69) / 12)

def echo(x, tiempo, fb=0.4, n=4):
    out = np.copy(x)
    d = int(tiempo * SR)
    out = np.concatenate([out, np.zeros(d * n)])
    for k in range(1, n + 1):
        out[d * k : d * k + len(x)] += x * (fb ** k)
    return out

def reverb(x, dur=1.2, mezcla=0.3):
    ir_t = t_(dur)
    ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 5)
    ir = lp(ir, 6000)
    wet = np.concatenate([fftconvolve(x, ir), [0.0]]) * 0.05
    out = np.concatenate([x, np.zeros(len(ir))]) * (1 - mezcla) + wet * mezcla
    return out

# ─────────── 1. Canal: estática + clics + encendido CRT ───────────
d = T["noticia"]
ruido = rng.standard_normal(int(d * SR))
ruido = bp(ruido, 300, 9000) * 0.35
# modulación tipo "lluvia" con cambios de canal
cambios = [0.0, 0.6, 1.2]
mod = np.ones_like(ruido)
for c in cambios:
    i = int(c * SR)
    mod[i : i + int(0.05 * SR)] = 0.05  # corte breve al cambiar
ruido *= mod * env(len(ruido), a=0.02, d=0.01, s=1, r=0.08)
add(ruido, 0, 0.8)
for c in cambios:  # clic mecánico de perilla
    k = rng.standard_normal(int(0.03 * SR)) * np.exp(-t_(0.03) * 200)
    add(hp(k, 1500), c + 0.05, 0.9)
thump = np.sin(2 * np.pi * 60 * t_(0.25)) * np.exp(-t_(0.25) * 18)
add(thump, 0, 0.6)
add(np.sin(2 * np.pi * 15600 * t_(d)) * 0.02, 0, 1)  # zumbido del flyback

# ─────────── 2. Noticia: cortina de noticiero ───────────
t0 = T["noticia"]
def stab(notas, d, g=0.25):
    s = sum(saw(nota(n), d, 0.004) for n in notas)
    s = lp(s, 3500) * env(len(s), a=0.005, d=0.15, s=0.6, r=0.15)
    return s * g
add(stab([62, 66, 69, 74], 0.18), t0 + 0.05, 0.9)
add(stab([62, 66, 69, 74], 0.18), t0 + 0.30, 0.9)
add(stab([64, 67, 71, 76], 1.6), t0 + 0.55, 0.9)
timbal = np.sin(2 * np.pi * 70 * t_(1.0) * (1 + 0.3 * np.exp(-t_(1.0) * 20))) * np.exp(-t_(1.0) * 4)
add(timbal, t0 + 0.55, 0.8)
# pulso tipo teletipo
for k in range(14):
    add(square(1200, 0.025) * env(int(0.025 * SR), a=0.001, d=0.01, s=0.5, r=0.01) * 0.05, t0 + 0.6 + k * 0.1, 1, 0.4)
# ráfaga de estática al cortar al presente
br = bp(rng.standard_normal(int(0.3 * SR)), 300, 8000) * 0.3 * env(int(0.3 * SR), a=0.005, d=0.1, s=0.8, r=0.1)
add(br, T["moderno"] - 0.05, 1)

# ─────────── 3. Presente: ambiente moderno limpio ───────────
t0 = T["moderno"]
dur_mod = T["rebobinado"] - t0
moderno = np.zeros(int(dur_mod * SR) + SR)
pluck_notas = [72, 76, 79, 83, 79, 76, 74, 79]
for k in range(int(dur_mod / 0.25)):
    n = pluck_notas[k % len(pluck_notas)]
    s = np.sin(2 * np.pi * nota(n) * t_(0.6)) * np.exp(-t_(0.6) * 7)
    i = int(k * 0.25 * SR)
    moderno[i : i + len(s)] += s * 0.18
pad = sum(np.sin(2 * np.pi * nota(n) * t_(dur_mod + 1)) for n in [48, 55, 60, 64]) * 0.05
moderno[: len(pad)] += pad * env(len(pad), a=0.5, d=0.1, s=1, r=0.6)
sub = np.sin(2 * np.pi * 50 * t_(0.4)) * np.exp(-t_(0.4) * 8)
for k in range(int(dur_mod / 1.0)):
    i = int(k * 1.0 * SR); moderno[i : i + len(sub)] += sub * 0.4
moderno = reverb(moderno, 1.5, 0.35)[: len(moderno)]
seg = moderno[: int(dur_mod * SR)]
# "tape stop" en los últimos 0.35 s
nstop = int(0.35 * SR)
cola = seg[-nstop:]
idx = np.cumsum(np.linspace(1, 0.05, nstop)); idx = (idx / idx[-1] * (nstop - 1)).astype(int)
seg = np.concatenate([seg[:-nstop], cola[idx] * np.linspace(1, 0, nstop)])
add(seg, t0, 1)

# ─────────── 4. Rebobinado: chirrido de cinta ───────────
t0 = T["rebobinado"]
dur_rew = T["tituloRetro"] - t0
rew = moderno[::-1]
idx = (np.arange(int(dur_rew * SR)) * 3.2) % len(rew)
rew = rew[idx.astype(int)]
warble = 1 + 0.4 * np.sin(2 * np.pi * 9 * t_(dur_rew))
rew = hp(rew, 600) * warble * 0.9
hiss = hp(rng.standard_normal(len(rew)), 4000) * 0.06
motor = np.sin(2 * np.pi * (900 + 500 * t_(dur_rew) / dur_rew) * t_(dur_rew)) * 0.04
r = (rew + hiss + motor) * env(len(rew), a=0.05, d=0.1, s=1, r=0.12)
add(r, t0, 1)
# "clac" del PLAY
clac = hp(rng.standard_normal(int(0.05 * SR)) * np.exp(-t_(0.05) * 120), 800)
add(clac, T["tituloRetro"] - 0.08, 1.2)

# ─────────── 5. Synthwave (desde el PLAY hasta el final) ───────────
t0 = T["tituloRetro"]
BPM = 120
beat = 60 / BPM
compas = 4 * beat
fin_musica = DUR
n_compases = int(np.ceil((fin_musica - t0) / compas))
# Am – F – C – G
acordes = [(57, [57, 60, 64]), (53, [53, 57, 60]), (48, [48, 52, 55]), (55, [55, 59, 62])]

def kick():
    tt = t_(0.35)
    f = 45 + 110 * np.exp(-tt * 30)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-tt * 9) * 0.9

def snare():
    tt = t_(0.32)
    tono = np.sin(2 * np.pi * 190 * tt) * np.exp(-tt * 25) * 0.5
    ruido = bp(rng.standard_normal(len(tt)), 1200, 8000) * 0.6
    gate = np.ones(len(tt)); gate[int(0.26 * SR) :] = np.linspace(1, 0, len(tt) - int(0.26 * SR))
    return (tono + ruido * np.exp(-tt * 4) * gate) * 0.55  # "gated reverb" ochentero

def hat(abierto=False):
    d = 0.18 if abierto else 0.04
    return hp(rng.standard_normal(int(d * SR)), 8000) * np.exp(-t_(d) * (15 if abierto else 90)) * 0.18

K, S, H, HO = kick(), snare(), hat(), hat(True)
# melodía (en semicorcheas = índice, nota MIDI, duración en corcheas)
melodia = [
    [(0, 76, 3), (6, 74, 1), (8, 72, 2), (12, 69, 4)],
    [(0, 72, 2), (4, 69, 2), (8, 65, 4)],
    [(0, 67, 2), (4, 72, 2), (8, 76, 3), (14, 79, 1)],
    [(0, 74, 4), (8, 71, 2), (12, 74, 2)],
]
for b in range(n_compases):
    tb = t0 + b * compas
    raiz, triada = acordes[b % 4]
    primer = b == 0
    # golpe inicial grande
    if primer:
        crash = hp(rng.standard_normal(int(2.0 * SR)), 5000) * np.exp(-t_(2.0) * 2.2) * 0.25
        add(crash, tb, 1, 0.2)
    # batería
    for q in range(4):
        add(K, tb + q * beat, 1.0)
        if q in (1, 3):
            add(reverb(S, 0.6, 0.35), tb + q * beat, 0.9)
        for e in range(2):
            add(HO if (e == 1 and q == 3) else H, tb + q * beat + e * beat / 2, 1, 0.3)
    # bajo en corcheas con octava
    for e in range(8):
        f = nota(raiz - 12 + (12 if e % 2 else 0))
        s = saw(f, beat / 2 * 0.9)
        s = lp(s, 900) * env(len(s), a=0.003, d=0.08, s=0.6, r=0.03)
        add(s * 0.32, tb + e * beat / 2, 1)
    # pad
    s = sum(saw(nota(n), compas + 0.3, 0.006) for n in triada)
    s = lp(s, 1800) * env(len(s), a=0.15, d=0.2, s=0.8, r=0.3)
    add(s * 0.07, tb, 1, -0.3)
    add(s * 0.07, tb, 1, 0.3)
    # arpegio en semicorcheas con eco (rebota estéreo)
    arp_notas = [triada[0] + 12, triada[1] + 12, triada[2] + 12, triada[1] + 24]
    arp = np.zeros(int((compas + 1.5) * SR))
    for sx in range(16):
        n = arp_notas[sx % 4]
        sq = square(nota(n), beat / 4 * 0.8, 0.3)
        sq = lp(sq, 3200) * env(len(sq), a=0.002, d=0.05, s=0.3, r=0.02)
        i = int(sx * beat / 4 * SR)
        arp[i : i + len(sq)] += sq * 0.06
    arp = echo(arp, beat * 0.75, 0.35, 3)
    add(arp, tb, 1, 0.45 if b % 2 else -0.45)
    # melodía a partir del 2.º compás
    if b >= 1:
        for (pos, n, dur) in melodia[b % 4]:
            dd = dur * beat / 2
            tt = t_(dd)
            vib = 1 + 0.006 * np.sin(2 * np.pi * 5.5 * tt) * np.clip(tt * 4, 0, 1)
            ph = 2 * np.pi * np.cumsum(nota(n) * vib) / SR
            s = (2 * ((ph / (2 * np.pi)) % 1) - 1) * 0.5 + np.sin(ph) * 0.5
            s = lp(s, 4200) * env(len(s), a=0.01, d=0.1, s=0.75, r=0.08)
            add(reverb(echo(s * 0.09, beat * 0.5, 0.3, 2), 1.0, 0.3), tb + pos * beat / 4, 1)

# fundido final
i_f = int((DUR - 2.0) * SR)
mix[i_f:] *= np.linspace(1, 0, len(mix) - i_f)[:, None] ** 1.5
mix = mix[: int(DUR * SR)]
# masterización simple
mix = hp(mix.T, 25).T
mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 0.89
wavfile.write("public/audio/banda-sonora.wav", SR, (mix * 32767).astype(np.int16))
print(f"OK: {DUR:.2f} s")
