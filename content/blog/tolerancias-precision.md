---
slug: tolerancias-precision
titulo: "Tolerancias y precisión en impresión 3D: qué esperar"
descripcion: "¿Qué tolerancia tiene una impresión 3D? ±0.2 mm es lo habitual en FDM: qué significa, qué factores la afectan, cómo pedir piezas que ensamblen y la garantía de medidas de Bisel."
keywords:
  - precisión impresión 3d
  - tolerancias impresión 3d
  - tolerancia impresión 3d mm
  - precisión de una impresora 3d
  - piezas impresas 3d medidas exactas
  - tolerancia 0.2 mm impresión 3d
cluster: negocios
tipo: soporte
fecha: 2026-09-08
actualizado: 2026-09-08
autor: Taller Bisel
extension_palabras: 1500
lectura_min: 7
faq: true
schema: BlogPosting + FAQPage
cta: cotiza
relacionados:
  - /blog/impresion-3d-para-negocios
  - /blog/prototipado-rapido
  - /blog/piezas-de-repuesto-impresion-3d
---

# Tolerancias y precisión en impresión 3D: qué esperar

**Una impresión 3D por filamento (FDM) tiene una tolerancia habitual de ±0.2 mm: la pieza real puede medir hasta 0.2 mm más o menos que el modelo digital.** No es una falla: es la naturaleza del proceso, que deposita plástico fundido capa por capa. Saberlo evita el error más común al pedir una pieza —diseñarla "a la medida exacta"— y explica por qué los talleres serios publican su tolerancia antes que su precio.

Este artículo explica qué significa ±0.2 mm en la práctica, qué factores mueven la precisión real, cómo pedir piezas que deban ensamblar o ajustar, y qué garantiza un taller como Bisel si la pieza no sale dentro de las medidas acordadas.

---

## ¿Qué es la tolerancia en impresión 3D?

La tolerancia es la variación aceptada entre la medida del modelo digital y la medida real de la pieza impresa. Si un archivo dice que un bloque mide 50 mm, una pieza con tolerancia de ±0.2 mm puede medir entre 49.8 y 50.2 mm. Las dos piezas son correctas; la tolerancia define el rango dentro del cual el resultado se considera bien hecho.

Ningún proceso fabrica medidas exactas, ni siquiera el fresado o la inyección de plástico. La diferencia entre tecnologías es el tamaño del rango: la inyección trabaja típicamente con ±0.05 a ±0.1 mm, el mecanizado con precisiones aún mayores, y la impresión 3D por filamento con ±0.2 a ±0.5 mm según la máquina y la calibración.

En FDM la variación viene de tres fuentes físicas: el **depósito de capas** (el plástico fundido se solidifica y deja un escalón por capa), la **contracción térmica** (el material encoge al enfriarse, y no idéntico en todas las direcciones) y la **geometría y orientación** (paredes verticales, voladizos y puentes se comportan distinto según cómo se orienta la pieza).

## ¿Qué precisión puedes esperar de una impresión 3D?

Los valores publicados por Bisel —un taller que imprime en filamento— están en el extremo bueno del rango FDM:

| Parámetro | Valor en el taller | Qué significa en la pieza |
|---|---|---|
| Tolerancia dimensional | ±0.2 mm | La medida real queda dentro de ±0.2 mm del modelo |
| Altura de capa | 0.12 a 0.28 mm | Menor altura = más detalle y superficie más lisa en Z |
| Volumen máximo | 25 × 21 × 21 cm | Límite de una sola impresión; más grande se divide en secciones |
| Materiales | PLA, PETG, TPU | Cada uno encoge y se comporta distinto al imprimir |

La tolerancia de ±0.2 mm se cumple en condiciones normales de calibración y diseño, y es la referencia al cotizar. Para piezas de ajuste y ensamble —prototipos funcionales, repuestos, utillaje— es suficiente en la mayoría de los casos; para réplicas decorativas ni se nota, porque la precisión visual depende más de la altura de capa que de la medida exacta.

### ¿Qué relación hay entre altura de capa y precisión?

La altura de capa afecta sobre todo a la dimensión vertical (eje Z) y al acabado de superficies inclinadas: una capa de 0.12 mm produce escalones menos visibles que una de 0.28 mm, a cambio de más tiempo de impresión. La precisión en el plano horizontal (X e Y) depende más de la calibración de la máquina y del material. Por eso un taller describe la calidad con dos números: tolerancia (±0.2 mm) y rango de capa (0.12 a 0.28 mm).

## ¿Qué factores afectan la precisión real de una pieza?

La tolerancia publicada es el punto de partida; el resultado real depende de estos factores, que conviene conocer antes de diseñar o pedir:

- **El modelo digital.** Un STL mal cerrado, con caras invertidas o medidas en milímetros cuando el programa esperaba pulgadas, produce una pieza "precisa" pero equivocada. El error de escala es el más común y el más caro.
- **El material.** El PLA encoge poco y es predecible; el PETG admite más temperatura (hasta 75 °C) pero exige más cuidado con el alabeo en piezas grandes y planas. El TPU, flexible, no mantiene medidas finas en zonas delgadas.
- **La orientación de impresión.** Una pieza impresa de pie acumula el error de capa en vertical; acostada cambia dónde quedan los soportes y las marcas de superficie. El taller elige la orientación que mejor respeta las medidas críticas.
- **Los agujeros y las paredes delgadas.** En FDM los agujeros pequeños tienden a salir ligeramente más cerrados que el modelo, y las paredes de menos de 1 mm pueden quedar débiles o con huecos. Si un diámetro es crítico, conviene dejar margen o terminarlo después con una broca.
- **El entorno.** Corrientes de aire y cambios de temperatura durante la impresión favorecen el alabeo en piezas grandes; en un taller controlado esto se minimiza.

## ¿Cómo pedir una pieza que deba encajar o ensamblar?

La regla de oro: **no diseñes dos piezas impresas a la medida exacta si deben ensamblarse.** El plástico impreso no se comporta como el metal maquinado; si el modelo deja cero holgura, el ajuste saldrá forzado o no entrará. En la práctica:

1. **Para un ajuste deslizante** (una pieza entra y se mueve dentro de otra), deja un juego de 0.2 a 0.4 mm en la dimensión de contacto.
2. **Para un ajuste a presión**, prueba con 0.1 a 0.2 mm de interferencia; el TPU, al deformarse, perdona más que el PLA o el PETG.
3. **Para roscas y engranajes**, usa modelos diseñados para impresión 3D, no piezas de inyección: las roscas impresas necesitan más holgura y un paso menos fino.
4. **Si la pieza reemplaza a una rota o existente**, mide con calibrador el original y suma la holgura de ensamble antes de enviar el archivo.

Si no estás seguro de cuánto juego dejar, dilo al cotizar: el taller confirma si el ajuste es viable con el material elegido.

## ¿Cuándo ±0.2 mm no alcanza?

Hay casos donde la precisión FDM se queda corta y conviene saberlo antes de pagar:

- **Ajustes mecánicos de alta exigencia:** ejes con tolerancias de centésimas o engranajes de paso muy fino necesitan otra tecnología o un acabado posterior (taladrado, escariado, lijado).
- **Piezas bajo carga o temperatura constante:** la precisión inicial no sirve si el material no aguanta el uso. Los límites del taller: nada que soporte más de 80 °C sostenidos (PLA hasta 55 °C en interiores, PETG hasta 75 °C en exteriores o carga, TPU hasta 60 °C flexible) y nada de frenos ni suspensión de vehículos.
- **Réplicas exactas de una marca:** no se imprimen por encargo piezas con logotipos o diseños registrados.

Para prototipos funcionales, utillaje, repuestos y lotes pequeños, ±0.2 mm resuelve: es el mismo criterio con el que se fabrican miles de piezas industriales de plástico cada día. La [guía de prototipado rápido](/blog/prototipado-rapido) explica cuándo una pieza impresa basta para validar un diseño.

## ¿Cómo se asegura la precisión antes de imprimir?

La tolerancia no se "reza": se verifica en dos momentos del proceso de Bisel:

1. **Render de aprobación previo y gratis.** Si llevas tu archivo, el taller envía el render real de la pieza —del modelo exacto, no una imagen de catálogo— para que apruebes forma, escala y orientación antes de imprimir. Ahí se detectan los errores de medidas que arruinarían la pieza. Si solo hay una idea o una foto, se envía una vista previa del concepto.
2. **Garantía de medidas por escrito.** Si la pieza llega rota o fuera de las medidas acordadas, se reimprime sin costo avisando con foto dentro de los 7 días siguientes a la entrega. Si el error fue del taller, el envío de la reposición también corre por su cuenta.

Esa garantía es la diferencia entre un taller que publica ±0.2 mm y uno que solo lo dice: en Bisel la tolerancia es parte del acuerdo, no una promesa de marketing.

## ¿Cuánto cuesta una pieza con tolerancia garantizada?

La precisión de ±0.2 mm no es un extra: está incluida en los rangos de precio publicados, en pesos mexicanos:

| Tipo de pedido | Rango de precio (MXN) | Producción |
|---|---|---|
| Pieza del catálogo | $180 a $450 | 1 a 2 días hábiles |
| Pieza a medida | $350 a $1,800 | 3 a 5 días hábiles |
| Lote de 50 a 200 piezas | $1,500 a $9,000 | 7 a 14 días hábiles |

El envío nacional suma 2 a 5 días hábiles y se cotiza por adelantado. La cotización es gratis y se responde el mismo día: envías tu archivo o una foto con medidas, y antes de pagar ya sabes el precio, el material, la tolerancia y el tiempo. El detalle del proceso completo está en [cómo funciona un pedido](/como-funciona).

## Preguntas frecuentes

### ¿Qué tolerancia tiene una impresión 3D por filamento?

En FDM la tolerancia habitual va de ±0.2 a ±0.5 mm según máquina y calibración. El Taller Bisel trabaja con ±0.2 mm, el extremo bueno del rango, y la incluye en la cotización sin costo extra.

### ¿Qué significa que una pieza tenga tolerancia de ±0.2 mm?

Que la medida real puede quedar hasta 0.2 mm por encima o por debajo del modelo digital. Un bloque modelado de 50 mm puede medir entre 49.8 y 50.2 mm, y ambas piezas se consideran correctas. Por eso las piezas que deben encajar se diseñan con holgura, no a medida exacta.

### ¿Puedo pedir una pieza que deba ensamblar con otra?

Sí. Para un ajuste deslizante deja 0.2 a 0.4 mm de juego en la dimensión de contacto; para un ajuste a presión, prueba con 0.1 a 0.2 mm de interferencia. Si dudas, dilo al cotizar: el taller confirma si el ajuste es viable con el material elegido.

### ¿La altura de capa afecta la precisión de mi pieza?

La capa (0.12 a 0.28 mm en Bisel) afecta sobre todo el acabado y la dimensión vertical; la precisión en el plano depende más de la calibración y el material. Capa más fina = superficies más lisas, a cambio de más tiempo de impresión.

### ¿Qué pasa si la pieza llega fuera de las medidas acordadas?

Se reimprime sin costo: avisas con una foto dentro de los 7 días siguientes a la entrega y el taller fabrica la reposición. Si el error fue del taller, el envío de la reposición también corre por su cuenta.

### ¿Qué precisión necesito para un prototipo funcional?

Para validar forma, encaje y funcionamiento, ±0.2 mm es suficiente en la mayoría de los casos; es el estándar con el que se fabrican piezas de plástico industriales. Solo ajustes mecánicos de centésimas o piezas bajo requisitos extremos de temperatura exigen otra tecnología.

### ¿Qué límites tiene el taller en precisión y tamaño?

Piezas de hasta 25 × 21 × 21 cm en una sola impresión (más grandes se dividen en secciones), nada que aguante más de 80 °C sostenidos, nada de frenos ni suspensión, y nada de réplicas con marca registrada. Dentro de esos límites, la tolerancia publicada se cumple y está garantizada.

---

*Guía publicada por el Taller Bisel (Guadalajara, Jalisco, México). Actualizada en septiembre de 2026. ¿Necesitas una pieza con medidas críticas? [Cotiza gratis y recibe el render de aprobación el mismo día →](/cotiza)*
