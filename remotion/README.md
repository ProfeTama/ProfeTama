# ProfeTama · Remotion

Proyecto de vídeo con [Remotion](https://www.remotion.dev/) (v4).

```bash
cd remotion
npm install
npm run dev      # abre Remotion Studio para previsualizar
npm run render   # genera out/hola-mundo.mp4
```

Las composiciones están en `src/Root.tsx`; la de ejemplo es `src/HolaMundo.tsx`.

## Plantilla "CuadernoRetro" (collage en cuaderno)

Fotos pegadas en un cuadernillo con papel rasgado, cinta washi y pegatinas.

1. Copia las fotos a `public/fotos/`.
2. Edita `src/Cuaderno/config.ts`: lista de fotos (archivo y tamaño), textos de la tapa,
   notas por página (`""` = sin texto) y `fotosPorPagina` (1, 2 o 3).
3. `npx remotion render src/index.ts CuadernoRetro out/cuaderno.mp4`

La duración se ajusta sola según la cantidad de fotos. Música y efectos: `python3 scripts/sonidos_cuaderno.py`.
