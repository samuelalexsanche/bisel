---
slug: preparar-archivo-stl
titulo: "Cómo preparar tu archivo STL para imprimir en 3D"
descripcion: "Qué necesita un archivo STL para imprimirse sin problemas: sólido cerrado, milímetros, escala correcta y menos de 25×21×21 cm. Checklist, reparación de errores y cómo mandarlo a un taller."
keywords:
  - preparar archivo stl
  - archivo stl impresión 3d
  - cómo exportar un stl
  - reparar archivo stl
  - stl o 3mf
  - requisitos archivo stl
cluster: principiantes
tipo: soporte
fecha: 2026-09-15
actualizado: 2026-09-15
autor: Taller Bisel
extension_palabras: 1500
lectura_min: 7
faq: true
schema: BlogPosting + FAQPage
cta: cotiza
relacionados:
  - /blog/impresion-3d-para-principiantes
  - /blog/modelos-stl-gratis
  - /blog/como-pedir-impresion-3d-en-linea
  - /blog/tolerancias-precision
---

# Cómo preparar tu archivo STL para imprimir en 3D

**Un archivo STL listo para imprimir es un sólido cerrado, en milímetros, sin caras invertidas y dentro de 25 × 21 × 21 cm.** Si tu archivo cumple eso, el taller lo imprime tal cual; si no, el rebanador (slicer) hace cosas raras o la pieza sale incompleta. La buena noticia es que casi todos los errores de un STL se detectan en dos minutos y se arreglan gratis antes de mandarlo.

Esta guía explica qué revisar, cómo exportar bien desde CAD, cómo reparar un archivo dañado y cómo entregarlo a un taller como Bisel sin sorpresas de precio ni de plazo.

## ¿Qué es un STL y por qué a veces "no sirve"?

Un STL no guarda el diseño: guarda la **superficie** de la pieza convertida en una malla de triángulos. Es el formato más universal de la impresión 3D, pero también el más pobre: no lleva unidades, no lleva color, no lleva el árbol de operaciones del CAD.

De ahí salen los dos problemas típicos:

- **Escala ambigua:** el STL solo tiene números. Si tu programa exportó en pulgadas, una pieza de 4 cm puede llegar como 10 cm o como 1 mm.
- **Malla rota:** agujeros, caras invertidas o geometría que se toca a sí misma. El slicer no sabe qué está "adentro" y qué "afuera", así que rellena mal o deja huecos.

Un STL "bueno" para impresión tiene tres propiedades: es **manifold** (cada arista une exactamente dos triángulos, sin huecos), todas sus **normales apuntan hacia afuera**, y está en **milímetros** a la escala real que quieres.

## ¿Cómo exporto mi archivo a STL?

Busca siempre la opción de exportar en **milímetros** y, si el programa lo permite, marca "solo el cuerpo seleccionado" para no exportar bocetos ni piezas ocultas.

| Programa | Ruta de exportación | Ojo con |
|---|---|---|
| Fusion 360 | Exportar → STL (binario) o 3MF | Elegir "milímetros" y un solo cuerpo |
| SolidWorks | Guardar como → STL → Opciones | Activar "no convertir a pulgadas" |
| SketchUp | Exportar → STL (extensión) | Unidades del modelo = mm |
| Blender | Exportar → STL | Aplicar escala (Ctrl+A) antes de exportar |
| Tinkercad | Exportar → STL | Ya sale en mm; descargar "todo" mezcla formas |
| Descarga de repositorio | STL o 3MF del autor | Revisar licencia antes de usarlo |

Si vas a descargar un modelo, la guía de [dónde conseguir modelos STL gratis y de pago](/blog/modelos-stl-gratis) explica qué licencias permiten uso comercial y cuáles no se pueden imprimir por encargo.

## ¿Cómo sé si mi archivo tiene errores?

Ábrelo en un visor de slicer (PrusaSlicer, Bambu Studio, Cura, formware) y revisa cuatro cosas:

1. **¿Se ve igual que tu diseño?** Una pared faltante o una pieza "rellena" de más casi siempre es malla rota.
2. **¿Encaja en la cama de 25 × 21 × 21 cm?** Bisel imprime hasta ese volumen en una sola pieza. Si tu modelo es más grande, hay que partirlo y unirlo.
3. **¿Mide lo que debe medir?** Usa la herramienta de medición del slicer: pon 50 mm entre dos caras y compara con tu diseño.
4. **¿El grosor de pared alcanza?** Paredes menores a 0.8 mm impresas con boquilla de 0.4 mm salen frágiles o con huecos. Engrosa la pared en CAD antes de exportar.

## ¿Cómo reparo un STL dañado?

Casi todos los visores de slicer ya traen reparación automática: al abrir un STL roto, ofrecen "arreglar el modelo" antes de rebanar. El resultado suele bastar para imprimir.

Si el daño es mayor:

- **Herramientas de reparación:** las funciones "reparar malla" de PrusaSlicer y de Bambu Studio, o servicios gratuitos en línea de reparación de STL.
- **Blender:** seleccionar todo → "Merge by Distance" para unir vértices duplicados, y "Recalculate Outside" para voltear normales.
- **Última opción, la buena:** vuelve al CAD y reexporta el cuerpo como **3MF** o en alta resolución (malla más fina). Casi siempre el error viene de exportar en calidad baja.

Un detalle que ahorra tiempo: si el modelo viene de un repositorio y está roto, no lo repares a mano. Busca otro o pide al taller que lo revise antes de cotizar; Bisel envía un [render de aprobación gratis](/como-funciona) para que veas la pieza antes de imprimir.

## Checklist antes de mandar tu archivo

| Revisión | Cómo se comprueba | Qué hacer si falla |
|---|---|---|
| Malla cerrada | El slicer no avisa de errores | Reparar automático; si no, reexportar en alta resolución |
| Unidades en mm | Medir una cota conocida en el slicer | Escalar 25.4× si venía en pulgadas |
| Escala real | Comparar contra tu diseño | Corregir en CAD o pedir el escalado al taller |
| Tamaño ≤ 25 × 21 × 21 cm | Caja del modelo en slicer | Partir en dos y unir, o reducir |
| Espesores ≥ 1.5 mm | Herramienta de medición | Engrosar paredes antes de exportar |
| Orientación clara | ¿Necesita soportes? | Avisar al taller cuál es la cara visible |
| Licencia del modelo | Archivo README o ficha del autor | No imprimir por encargo modelos NC |
| Tolerancia en ensambles | Deja 0.2 mm de juego donde algo va a entrar | Ver la guía de tolerancias |

Ese último punto es el que más devoluciones evita: si vas a insertar un rodamiento, un tubo o una pieza con otra, no diseñes la medida exacta. Una impresión FDM tiene una tolerancia habitual de ±0.2 mm, y esa diferencia decide si la pieza entra o no. Lo explicamos a detalle en [tolerancias y precisión en impresión 3D](/blog/tolerancias-precision).

## STL o 3MF: ¿cuál conviene?

El **STL** es universal y ligero, pero no guarda unidades, color ni varios materiales. El **3MF** sí: lleva milímetros, piezas múltiples, color y hasta los parámetros de impresión, y casi todos los slicers modernos lo leen.

Regla práctica: si el taller te va a imprimir una pieza funcional en un solo material, el STL es suficiente. Si mandas un ensamble de varias piezas, si el color importa o si quieres que el taller reciba exactamente tu intención, manda **3MF** o, mejor todavía, el **STEP/IGES** original: es el formato de CAD, no tiene malla que reparar y las medidas son exactas.

## ¿Y si no tengo archivo, solo una idea o una pieza rota?

No necesitas saber CAD para mandar a imprimir. Bisel trabaja con tres entradas:

- **Archivo STL, 3MF o STEP** que ya tienes.
- **Una foto con medidas**: se modela la pieza y se te manda una vista previa del concepto para ajustarla antes de producir.
- **Una pieza rota o descontinuada** (repuesto, empaque, tapa): se toma como referencia para reconstruirla a medida.

Tampoco necesitas instalar nada. El pedido completo son cuatro pasos: mandas archivo, foto o idea → recibes cotización el mismo día → apruebas el render → llega a tu domicilio. Están detallados en [cómo pedir una impresión 3D en línea](/blog/como-pedir-impresion-3d-en-linea).

## ¿Cuánto cuesta y cuánto tarda imprimir tu archivo?

Precios reales de Bisel (Guadalajara, con envío nacional), en pesos mexicanos:

| Tipo de pedido | Rango de precio (MXN) | Producción |
|---|---|---|
| Pieza del catálogo | $180 a $450 | 1 a 2 días hábiles |
| Pieza a medida desde tu archivo | $350 a $1,800 | 3 a 5 días hábiles |
| Lote de 50 a 200 piezas | $1,500 a $9,000 | 7 a 14 días hábiles |

El envío nacional suma 2 a 5 días hábiles. La revisión del archivo, la cotización y el render de aprobación no tienen costo. Si la pieza llega rota o fuera de las medidas acordadas, se reimprime sin costo avisando con foto dentro de los 7 días siguientes a la entrega.

Un archivo bien preparado no solo evita rechazos: también baja el precio, porque menos reparación y menos soportes significan menos tiempo de máquina.

## Preguntas frecuentes

### ¿Qué formato de archivo debo mandar para imprimir en 3D?

STL es el estándar y casi siempre suficiente. Si tienes el original de CAD, manda STEP o IGES: conserva medidas exactas y no requiere reparar malla. Para ensambles de varias piezas o varios materiales, 3MF.

### ¿Cómo sé si mi STL está en milímetros o en pulgadas?

El STL no guarda unidades. Ábrelo en un slicer y mide una cota que conozcas: si el resultado es 25.4 veces tu medida, venía en pulgadas. Corrige la escala en CAD antes de reexportar o pide al taller que la ajuste.

### ¿Qué hago si mi archivo STL está roto o tiene huecos?

Abre el archivo en el slicer y usa la reparación automática que ofrece. Si no basta, reexporta desde CAD en mayor resolución o conviértelo a 3MF. En muchos casos el error desaparece solo con volver a exportar en calidad alta.

### ¿Puedo mandar un archivo que descargué de internet?

Sí, siempre que su licencia permita uso comercial si lo vas a vender o lo encargas por encargo. Bisel no imprime modelos con licencia no comercial (NC) de terceros. Si el archivo es tuyo y tienes el STEP original, es el mejor escenario.

### ¿Cuál es el tamaño máximo que pueden imprimir?

25 × 21 × 21 cm en una sola impresión. Arriba de eso hay que partir la pieza en secciones y unirlas, o dividir el proyecto en varias piezas. El taller te dice qué opción conviene antes de cotizar.

### ¿Necesito saber modelado 3D para pedir una pieza?

No. Con una foto y las medidas principales se puede modelar la pieza. También se puede reconstruir un repuesto a partir de la pieza rota. Recibes una vista previa del concepto para aprobarla antes de que se imprima.

### ¿Qué piezas no se pueden imprimir aunque tenga el archivo?

Las que aguanten más de 80 °C sostenidos, las que van en sistemas de frenos o suspensión, las réplicas de piezas con marca registrada y las mayores a 25 × 21 × 21 cm en una sola impresión. Fuera de eso, si tienes el archivo, se puede imprimir.

---

*Guía publicada por el Taller Bisel (Guadalajara, Jalisco, México). Actualizada en septiembre de 2026. ¿Tienes tu archivo y quieres saber cuánto cuesta imprimirlo? [Mándalo y recibe cotización el mismo día →](/cotiza)*
