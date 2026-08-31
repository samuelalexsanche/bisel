---
slug: como-funciona-la-impresion-3d
titulo: "¿Cómo funciona la impresión 3D? FDM, SLA y SLS"
descripcion: "El proceso de impresión 3D paso a paso: modelo digital, rebanado e impresión capa por capa. FDM, SLA y SLS explicadas con sus diferencias reales."
keywords:
  - cómo funciona la impresión 3d
  - tecnologías impresión 3d
  - impresión 3d fdm sla sls
cluster: principiantes
tipo: soporte
fecha: 2026-08-05
actualizado: 2026-08-05
autor: Taller Bisel
extension_palabras: 1500
lectura_min: 7
faq: true
schema: BlogPosting + FAQPage
cta: catalogo
relacionados:
  - /blog/impresion-3d-para-principiantes
  - /blog/fdm-vs-sla
  - /blog/es-segura-la-impresion-3d
---

# ¿Cómo funciona la impresión 3D? FDM, SLA y SLS explicadas

**La impresión 3D funciona en tres pasos: se toma un modelo digital (STL), un programa lo divide en capas horizontales, y una máquina construye la pieza depositando o solidificando material capa por capa hasta completar el objeto.** Las tres tecnologías principales — FDM, SLA y SLS — hacen exactamente eso, pero con métodos, costos y resultados muy distintos.

Aquí te explico cómo funciona cada una, qué pasa dentro de la máquina, por qué fallan a veces las impresiones y cuál tecnología te conviene según lo que quieras imprimir.

---

## Los 3 pasos universales

Antes de hablar de máquinas, entiende el proceso que comparten todas las tecnologías de impresión 3D:

### 1. El modelo digital

Todo comienza con un archivo 3D, normalmente en formato **STL** (aunque hay otros como OBJ o 3MF). Ese archivo describe la superficie del objeto: no es un dibujo plano, es una "escultura" matemática hecha de triángulos diminutos que forman la piel del objeto.

¿De dónde sale? De tres lugares:

- **Repositorios gratuitos** (Thingiverse, Printables, MakerWorld) con millones de diseños listos para descargar e imprimir.
- **Programas de diseño 3D** como Tinkercad (para empezar), Fusion 360 o Blender (para diseño serio).
- **Modelado a medida**, cuando necesitas una pieza que no existe en ningún lado y alguien la diseña desde cero para ti.

### 2. El rebanado (slicing)

Una impresora no entiende de volúmenes: entiende de **capas**. El software rebanador (slicer, como Cura o PrusaSlicer) corta el modelo en cientos de láminas horizontales y genera las instrucciones de movimiento que la máquina seguirá, milímetro a milímetro.

En este paso se deciden los parámetros que definen el resultado final:

| Parámetro | Qué define | Ejemplo típico |
|---|---|---|
| Altura de capa | Qué tan finas son las capas (detalle vs velocidad) | 0.12 a 0.28 mm |
| Relleno | Qué tan sólida es la pieza por dentro | 15% a 100% |
| Soportes | Estructuras temporales para partes en voladizo | Según geometría |
| Velocidad | Tiempo de impresión | Balance con calidad |
| Orientación | Cómo se coloca la pieza en la base | Afecta resistencia y acabado |

### 3. La impresión

La máquina ejecuta las instrucciones y construye la pieza capa por capa. Dependiendo de la tecnología, el material se **funde, se cura con luz o se fusiona con láser**. Al terminar, la pieza se retira de la máquina y, según el caso, pasa por post-procesado: retirar soportes, lijar, curar o pintar.

---

## FDM: la tecnología más usada (filamento fundido)

**Cómo funciona:** un filamento de plástico (un hilo de 1.75 mm de diámetro) entra a un cabezal que lo funde a ~200 °C y lo deposita sobre una base caliente, capa por capa, siguiendo el contorno de cada rebanada. Al enfriarse, el plástico se solidifica y se adhiere a la capa anterior. Es literalmente como dibujar con una pistola de silicón de precisión.

**Así se imprime una pieza FDM, paso a paso:**

1. La base se nivela y calienta para que la primera capa se adhiera bien.
2. El cabezal deposita la primera capa — la más importante, porque de ella depende todo lo demás.
3. La máquina sube (o baja la base) una altura de capa y deposita la siguiente, repitiendo cientos o miles de veces.
4. Si la pieza tiene partes en voladizo, se imprimen soportes temporales que se retiran al final.
5. La pieza se enfría, se despega de la base y se limpia de soportes.

**Lo que ves en el resultado:** capas ligeramente visibles en superficies curvas (el efecto "escalera") y una resistencia excelente si el relleno y la orientación son correctos. **Datos reales de referencia:** en Bisel imprimimos con tolerancia de ±0.2 mm y alturas de capa de 0.12 a 0.28 mm, según el detalle que necesite la pieza.

**Cuándo elegirla:** es la opción correcta para la mayoría de los proyectos — piezas funcionales, prototipos, repuestos y objetos de uso diario. Es la más económica, la que más materiales ofrece (PLA, PETG, TPU…) y la que mejor relación costo-resistencia tiene.

---

## SLA: resina y luz UV (alta precisión)

**Cómo funciona:** en lugar de fundir plástico, una impresora SLA **cura resina líquida con luz UV** — un láser que dibuja el contorno de cada capa o una pantalla que proyecta la capa completa de una vez. El modelo se construye dentro de un tanque de resina: donde la luz toca, el material se solidifica; lo que no recibe luz sigue siendo líquido.

Al terminar, la pieza no está lista: hay que **lavarla** (para quitar la resina sobrante) y **curarla** (exponerla a luz UV para que alcance su resistencia final).

**Lo que ves en el resultado:** un nivel de detalle que FDM no alcanza — superficies lisas, acabado tipo inyección y tolerancias finas (hasta ±0.05 mm). El costo: la resina es más cara, las piezas son más frágiles que las de filamento en aplicaciones de carga, y el proceso requiere más pasos.

**Cuándo elegirla:** figuras, joyería, modelos de arquitectura, piezas dentales o cualquier proyecto donde el detalle y la suavidad importan más que la resistencia mecánica.

---

## SLS: polvo y láser (industrial)

**Cómo funciona:** una impresora SLS **fusiona polvo de nylon con un láser**, punto por punto, en cada capa. Después de cada pasada, una capa nueva de polvo se extiende sobre la anterior y el láser fusiona solo donde corresponde.

La gran ventaja: **el polvo sin fusionar actúa como soporte natural**. No hace falta estructura de soporte, lo que permite geometrías imposibles con FDM o SLA — cavidades internas, piezas anidadas, mecanismos ensamblados en el mismo proceso.

**Lo que ves en el resultado:** piezas resistentes, sin capas visibles y con gran libertad geométrica. El costo es el más alto de los tres y suele reservarse a producción industrial y piezas técnicas.

**Cuándo elegirla:** componentes funcionales para ingeniería, geometrías complejas con cavidades internas y tiradas donde la resistencia en todas las direcciones es crítica.

---

## Comparación rápida

| | **FDM** | **SLA** | **SLS** |
|---|---|---|---|
| Material | Filamento (PLA, PETG, TPU…) | Resina líquida | Polvo de nylon |
| Método | Fundir y depositar | Curar con luz UV | Fusionar con láser |
| Detalle | Bueno (±0.2 mm) | Muy alto (±0.05 mm) | Alto |
| Resistencia | Alta (con relleno adecuado) | Media (frágil a golpes) | Muy alta |
| Post-procesado | Retirar soportes | Lavar + curar | Limpiar polvo |
| Costo | Económico | Medio | Elevado |
| Uso típico | Piezas funcionales, prototipos, repuestos | Figuras, joyería, precisión | Industria, ingeniería |

---

## ¿Qué significa esto en la práctica?

Para el 90% de los proyectos personales y de negocio, **FDM es la respuesta**. Es la tecnología que usamos en Bisel para la mayoría de las piezas porque ofrece el mejor equilibrio entre precio, resistencia y materiales disponibles.

La regla simple:

- **Necesitas una pieza útil, resistente y económica** → FDM.
- **Necesitas máximo detalle y acabado liso** → SLA.
- **Necesitas producción industrial con geometrías complejas** → SLS.

¿No sabes cuál es tu caso? Manda una foto y unas medidas a una cotización: te recomendamos la tecnología y el material sin costo. La decisión FDM vs SLA a fondo está en [FDM vs SLA: ¿qué tecnología necesitas?](/blog/fdm-vs-sla). Y si te preocupa la seguridad del proceso (emisiones, ventilación, post-procesado): [¿Es segura la impresión 3D?](/blog/es-segura-la-impresion-3d).

---

## Por qué a veces fallan las impresiones (y cómo se evita)

No todo sale a la primera, y conviene saberlo. Los problemas más comunes en FDM:

- **Despegue de la base (warping):** las esquinas de la pieza se levantan al enfriarse. Se evita con una base bien nivelada y caliente, y buena adhesión de la primera capa.
- **Hilos o cabello (stringing):** restos de plástico entre partes separadas. Se evita ajustando temperatura y retracción.
- **Capas separadas:** mala adhesión entre capas. Se evita con temperatura correcta y alturas de capa adecuadas.
- **Primera capa defectuosa:** la causa de la mayoría de las fallas; por eso la nivelación de la base es lo primero que se revisa.

En un servicio profesional esto ya está resuelto: la máquina se calibra, se elige la orientación óptima de la pieza y se ajustan los parámetros por material. Tú no tienes que saber nada de esto — solo recibir la pieza funcionando. Si quieres entender más sobre los errores típicos y cómo evitarlos: [7 errores comunes al empezar con impresión 3D](/blog/errores-comunes-impresion-3d).

---

## Preguntas frecuentes

### ¿Cuánto tarda en imprimirse una pieza?

Depende del tamaño y la calidad: una pieza pequeña puede tardar 2-3 horas; una pieza grande o con mucho detalle, más de 24 horas. Cuando cotizas, te decimos el tiempo de fabricación exacto antes de imprimir.

### ¿Por qué se ven líneas en las piezas impresas?

Son las capas. La impresión 3D construye por capas, así que las superficies curvas muestran un ligero escalonado. Con alturas de capa finas (0.12 mm) es casi imperceptible, y con post-procesado (lijado, pintura) desaparece por completo.

### ¿Qué formato de archivo necesito?

El estándar es STL. Si tienes un archivo en otro formato (OBJ, STEP, 3MF), en la mayoría de los casos también se puede usar. No tienes que saber de diseño: una foto y unas medidas bastan para cotizar.

### ¿La pieza sale lista para usar?

Sí, en FDM la pieza sale funcional: solo hay que retirar los soportes si los tuvo. El acabado se puede mejorar con post-procesado según lo que necesites, y eso se acuerda antes de imprimir.

### ¿Puedo imprimir cualquier diseño que encuentre en internet?

Casi cualquier diseño sí, con dos salvedades: el tamaño máximo (en Bisel, 25 × 21 × 21 cm en una sola pieza) y los límites del material (no se imprimen piezas de seguridad crítica ni réplicas con marca registrada).

### ¿Qué tecnología usa Bisel para mis piezas?

FDM para la mayoría de los proyectos (PLA, PETG y TPU). Si tu pieza requiere precisión de resina, te lo recomendamos en la cotización y se maneja por separado.

---

*Guía publicada por el Taller Bisel (Guadalajara, Jalisco, México). Si ya sabes qué pieza necesitas, mira lo que tenemos listo en el [catálogo](/catalogo) o cotiza tu diseño desde cero en el [formulario de cotización](/cotiza).*
