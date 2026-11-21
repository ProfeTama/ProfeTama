"""
Sonidos originales de la plantilla "CuadernoRetro".
Uso: python3 scripts/sonidos_cuaderno.py   (requiere numpy y scipy)
Genera en public/audio: musica-cuaderno.wav (bucle de 16 s), sfx-pegar.wav, sfx-pegatina.wav, sfx-pagina.wav
"""
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, fftconvolve, sosfilt

SR = 44100
rng = np.random.default_rng(11)

def t_(d): return np.arange(int(d * SR)) / SR
def filt(x, f, tipo): return sosfilt(butter(2, f, tipo, fs=SR, output="sos"), x)
def nota(n): return 440 * 2 ** ((n - 69) / 12)
def env(n, a=0.005, r=0.05):
    e = np.ones(n); na = min(int(a * SR), n); nr = min(int(r * SR), n)
    e[:na] = np.linspace(0, 1, na); e[n - nr:] *= np.linspace(1, 0, nr); return e
def saw(f, d): return 2 * ((t_(d) * f) % 1) - 1
def guardar(nombre, x):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.9
    wavfile.write(f"public/audio/{nombre}.wav", SR, (x * 32767).astype(np.int16))

# ── Música: pop ochentero alegre, 120 BPM, 8 compases = 16 s (se repite sin cortes) ──
BPM = 120; beat = 0.5; compas = 2.0; DUR = 16.0
L = int(DUR * SR); mix = np.zeros(L + SR * 2)
def add(x, t0, g=1.0):
    i = int(t0 * SR); mix[i:i + len(x)] += x[: len(mix) - i] * g
acordes = [(48, [60, 64, 67]), (43, [59, 62, 67]), (45, [57, 60, 64]), (41, [57, 60, 65])]  # C G Am F
kick = np.sin(2 * np.pi * np.cumsum(45 + 110 * np.exp(-t_(0.3) * 30)) / SR) * np.exp(-t_(0.3) * 10)
tt = t_(0.25)
snare = (np.sin(2 * np.pi * 200 * tt) * np.exp(-tt * 30) * 0.5 + filt(rng.standard_normal(len(tt)), [1500, 8000], "band") * np.exp(-tt * 12)) * 0.6
clap = filt(rng.standard_normal(int(0.15 * SR)), [1000, 5000], "band") * np.exp(-t_(0.15) * 25) * 0.4
hat = filt(rng.standard_normal(int(0.04 * SR)), 8000, "high") * np.exp(-t_(0.04) * 90) * 0.2
for b in range(8):
    tb = b * compas; raiz, triada = acordes[b % 4]
    for q in range(4):
        add(kick, tb + q * beat, 0.9)
        if q in (1, 3): add(snare, tb + q * beat); add(clap, tb + q * beat + 0.01)
        for e in range(2): add(hat, tb + q * beat + e * beat / 2)
    for e in range(8):  # bajo saltarín
        n = raiz - 12 + (12 if e % 2 else 0)
        s = filt(saw(nota(n), 0.22), 1100, "low") * env(int(0.22 * SR), 0.003, 0.05)
        add(s * 0.35, tb + e * beat / 2)
    for q in range(4):  # acordes "staccato" de sintetizador en el contratiempo
        s = sum(filt(saw(nota(n), 0.18) + saw(nota(n) * 1.004, 0.18), 3000, "low") for n in triada)
        add(s * env(len(s), 0.004, 0.06) * 0.06, tb + q * beat + beat / 2)
    for sx in range(16):  # campanitas
        n = triada[sx % 3] + 12
        s = np.sin(2 * np.pi * nota(n) * t_(0.3)) * np.exp(-t_(0.3) * 12)
        add(s * 0.07, tb + sx * beat / 4)
mel = [72, 74, 76, 79, 76, 74, 72, 67, 69, 72, 74, 72, 71, 67, 69, 71]
for k, n in enumerate(mel * 2):  # melodía en compases 1-8, una nota cada medio compás
    if k % 4 == 3: continue
    d = 0.45; tt = t_(d)
    ph = 2 * np.pi * np.cumsum(nota(n) * (1 + 0.005 * np.sin(2 * np.pi * 5 * tt))) / SR
    s = (np.sin(ph) * 0.6 + (2 * ((ph / (2 * np.pi)) % 1) - 1) * 0.3) * env(len(tt), 0.01, 0.1)
    add(filt(s, 4000, "low") * 0.12, k * 0.5)
# la cola que sobra vuelve al principio para que el bucle sea continuo
cola = mix[L:]; mix = mix[:L]; mix[: len(cola)] += cola
mix = np.tanh(mix * 1.3)
guardar("musica-cuaderno", mix)

# ── Pegar foto: golpe de papel + tirón de cinta ──
golpe = filt(rng.standard_normal(int(0.08 * SR)), [200, 3000], "band") * np.exp(-t_(0.08) * 50)
golpe[: int(0.03 * SR)] += np.sin(2 * np.pi * 90 * t_(0.03)) * 0.8
cinta = filt(rng.standard_normal(int(0.25 * SR)), 2500, "high") * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 70 * t_(0.25)))) * np.linspace(1, 0.2, int(0.25 * SR)) * 0.35
x = np.zeros(int(0.6 * SR)); x[: len(golpe)] += golpe; i = int(0.2 * SR); x[i:i + len(cinta)] += cinta
guardar("sfx-pegar", x)

# ── Pegatina: "pop" ──
tt = t_(0.12)
pop = np.sin(2 * np.pi * np.cumsum(500 + 900 * np.exp(-tt * 40)) / SR) * np.exp(-tt * 35)
guardar("sfx-pegatina", pop * 0.7)

# ── Vuelta de página: roce de papel ──
d = 0.7; tt = t_(d)
roce = filt(rng.standard_normal(len(tt)), [800, 7000], "band") * np.sin(np.pi * tt / d) ** 2
roce *= 0.7 + 0.3 * np.sin(2 * np.pi * 13 * tt)
guardar("sfx-pagina", roce)
print("OK")
