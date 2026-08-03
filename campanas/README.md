# Calendario de campañas · Bisel

Generado desde `generar-calendario.mjs`. Para regenerarlo:

```bash
node campanas/generar-calendario.mjs
```

Produce `calendario-bisel.ics`. Se importa en Google Calendar desde
**Configuración → Importar y exportar → Importar**. No hace falta dar acceso a
la cuenta a nadie.

---

## La idea de fondo

**Las fechas de campaña no se calculan desde el evento. Se calculan hacia atrás
desde el tiempo de producción.**

Un lote de 50 a 200 piezas son 7 a 14 días hábiles, más 2 a 5 de envío. Si la
campaña de Día de Muertos arranca el 28 de octubre, el pedido no llega: había
que cerrar el 6 de octubre.

Por eso cada campaña genera tres eventos en el calendario:

| Evento | Qué significa |
|---|---|
| ▶ Empieza a publicar | Dos semanas de contenido antes de cerrar pedidos |
| ⛔ Último día para pedidos | Después de esta fecha la pieza **ya no llega** |
| ● La fecha | El día en sí |

El colchón sale de los tiempos reales publicados en `/como-funciona`:
lote 19 días hábiles, pieza a medida 10, catálogo 7. Si esos tiempos cambian,
se cambian en `COLCHON` y todo el calendario se recalcula solo.

---

## Las diez campañas

| Campaña | Fecha | Persona | Cierre de pedidos |
|---|---|---|---|
| Regreso a clases | 24 ago 2026 | Ana | 13 ago 2026 |
| Día de Muertos | 2 nov 2026 | Fernanda | 6 oct 2026 |
| Buen Fin | 20 nov 2026 ⚠️ | Ana | 11 nov 2026 |
| Navidad y posadas | 25 dic 2026 | Fernanda | 30 nov 2026 |
| Día de Reyes | 6 ene 2027 | Ana | 28 dic 2026 |
| San Valentín | 14 feb 2027 | Ana | 1 feb 2027 |
| Día del Niño | 30 abr 2027 | Fernanda | 5 abr 2027 |
| Día de las Madres | 10 may 2027 | Ana | 26 abr 2027 |
| Día del Maestro | 15 may 2027 | Fernanda | 20 abr 2027 |
| Día del Padre | 20 jun 2027 | Ricardo | 10 jun 2027 |

⚠️ **Buen Fin**: la fecha oficial la anuncia la Concanaco cada año. La del
calendario es el tercer viernes de noviembre, que es lo habitual, pero hay que
confirmarla en cuanto salga.

### Tres cosas que salen de leer la tabla

**Regreso a clases ya se pasó para lotes.** El cierre era el 13 de agosto de
2026 y hoy es después. Para esta temporada solo queda vender catálogo y piezas
a medida, no lotes.

**Mayo es el mes más cargado del año.** Día de las Madres (10) y Día del
Maestro (15) caen a cinco días. Sus campañas se solapan y compiten por la misma
capacidad de impresora. Conviene venderlas como una sola temporada y no como
dos campañas separadas, o reservar capacidad desde abril.

**Ricardo casi no es estacional.** Compra cuando se le rompe algo, no cuando
hay una fecha. Su única fecha es Día del Padre. El resto del año se le llega
por búsqueda en Google, no por campaña — por eso el §8.2 pone tanto peso en el
SEO local.

---

## Campañas por formato de red

Cada red pide un formato distinto y le habla a una persona distinta del §1.
Publicar lo mismo en las cuatro es la forma más rápida de no funcionar en
ninguna.

### Instagram · Ana y Fernanda

El §1 dice que Ana **decide por foto**. Es la red que más importa.

- **Reels** de la pieza imprimiéndose en timelapse, 15 a 30 s, vertical. Es el
  formato que mejor rinde para impresión 3D porque el proceso es hipnótico.
- **Carrusel** de "problema → pieza → instalada". Tres imágenes bastan.
- **Historias** con encuesta: "¿qué color?". Convierte seguidores en pedidos.
- Publicar la **pieza en la mano**, nunca flotando: es la misma regla del §7.1.

### Facebook · Don Julio

Es donde vive el negocio local de barrio. Menos estética, más cercanía.

- **Publicaciones de texto con foto** contando un arreglo concreto: "se le
  rompió la perilla de la estufa a un cliente de Zapopan, no la conseguía".
- **Grupos locales** de compraventa de Guadalajara y Zapopan. Ahí está Don Julio.
- El **Marketplace** funciona para catálogo, no para pieza a medida.

### TikTok · alcance frío

No vende directo, pero es donde un taller nuevo consigue volumen sin pagar.

- **Timelapse con audio real del taller**, sin música. El ruido de la impresora
  es el gancho.
- **"Cosas que la gente cree que no se pueden reparar"**: serie por capítulos.
- Vertical, 9:16, primeros 2 segundos sin texto de intro.

### YouTube · Ricardo y SEO

Es buscador, no red social. Lo que se publica aquí sigue trayendo clientes en
un año.

- **Shorts** con el mismo material vertical de TikTok, sin reeditar.
- **Videos largos** de reparación completa: "cómo medí y reimprimí la perilla
  de una estufa Mabe". Ese título es una búsqueda real.
- Es el contenido que alimenta la estrategia GEO del §9: un video con
  transcripción es material que ChatGPT y Perplexity pueden citar.

---

## Reglas que no se rompen en ninguna campaña

Vienen del §13 y aplican también a lo que se publica fuera del sitio:

- **Cero falsa escasez.** Nada de "últimas piezas" ni cuentas regresivas
  inventadas. El cierre de pedidos de este calendario **sí es real**: está
  calculado desde el tiempo de producción, y por eso se puede decir sin mentir.
- **Cero reseñas o cifras sin respaldo.** Somos nuevos y lo decimos.
- **Nada de "el mejor", "único en México" ni "calidad" sin evidencia al lado.**
- Si una fecha ya no da tiempo, **se dice**, no se acepta el pedido. Es la misma
  promesa de la garantía del §7.4.
