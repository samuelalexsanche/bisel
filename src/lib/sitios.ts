/**
 * Los diez sitios de modelos STL que más se usan — § recursos.
 *
 * Datos cualitativos y verificables: qué trae cada sitio, si pide cuenta y
 * cómo maneja las licencias. NO se publican cifras de modelos ni de usuarios:
 * cambian cada semana y no hay forma de comprobarlas (criterio 12).
 */

export type Sitio = {
  id: string;
  nombre: string;
  /** Dos o tres letras para la miniatura (monograma propio, no el logo ajeno). */
  siglas: string;
  url: string;
  fuerte: string;
  resumen: string;
  cuenta: string;
  licencias: string;
};

export const SITIOS: readonly Sitio[] = [
  {
    id: "printables",
    nombre: "Printables",
    siglas: "PR",
    url: "https://www.printables.com",
    fuerte: "Perfiles de impresión listos",
    resumen:
      "El repositorio de Prusa Research. La diferencia está en que muchos modelos vienen con el perfil de impresión del autor: se abre, se rebanada y sale. Tiene concursos semanales y una comunidad muy activa de diseño funcional.",
    cuenta: "Sí, gratis",
    licencias: "Creative Commons, con la licencia indicada en cada ficha",
  },
  {
    id: "thingiverse",
    nombre: "Thingiverse",
    siglas: "TH",
    url: "https://www.thingiverse.com",
    fuerte: "Cantidad y variedad",
    resumen:
      "El repositorio más viejo y el más grande en variedad: hay de todo, desde repuestos caseros hasta decoración. Si algo se te ocurre, probablemente ya existe aquí. Ojo: abundan modelos viejos con archivos flojos.",
    cuenta: "Sí, gratis",
    licencias: "Creative Commons (revisar cada ficha: hay NC)",
  },
  {
    id: "cults3d",
    nombre: "Cults 3D",
    siglas: "C3",
    url: "https://cults3d.com",
    fuerte: "Modelos de pago y gratis",
    resumen:
      "Mezcla gratis y premium, y paga directamente a los diseñadores. Es el sitio donde la gente que vive de diseñar publica lo mejor de su catálogo. Sirve para encontrar cosas muy pulidas que en los repositorios gratuitos no aparecen.",
    cuenta: "Sí para comprar; muchos gratis sin cuenta",
    licencias: "Gratis con licencia; los de pago traen licencia comercial o personal",
  },
  {
    id: "makerworld",
    nombre: "MakerWorld",
    siglas: "MW",
    url: "https://makerworld.com",
    fuerte: "Perfiles y modelos para Bambu Lab",
    resumen:
      "El repositorio de Bambu Lab. Está integrado con Bambu Studio, trae perfiles validados y un sistema de puntos para quien publica. Buena parte del catálogo está pensado para impresoras de cama rápida.",
    cuenta: "Sí, gratis",
    licencias: "Creative Commons y licencias propias de la plataforma",
  },
  {
    id: "myminifactory",
    nombre: "MyMiniFactory",
    siglas: "MM",
    url: "https://www.myminifactory.com",
    fuerte: "Miniaturas y cosplay",
    resumen:
      "Curaduría fuerte: buena parte del catálogo pasa por una verificación de que el modelo efectivamente imprime. Es el sitio de referencia para miniaturas de juegos de mesa, figuras y props de cosplay.",
    cuenta: "Sí, gratis",
    licencias: "Gratis y de pago; revisar si permite uso comercial",
  },
  {
    id: "thangs",
    nombre: "Thangs",
    siglas: "TG",
    url: "https://thangs.com",
    fuerte: "Busca en varios repositorios",
    resumen:
      "Más que un repositorio, un buscador. Indexa modelos de otros sitios y tiene búsqueda por forma (subes una pieza y busca parecidos). Útil cuando no sabes cómo se llama lo que quieres.",
    cuenta: "Sí, gratis",
    licencias: "Depende del sitio de origen del modelo",
  },
  {
    id: "grabcad",
    nombre: "GrabCAD Community",
    siglas: "GC",
    url: "https://grabcad.com",
    fuerte: "Ingeniería y CAD",
    resumen:
      "Comunidad de ingenieros: piezas mecánicas, utillaje, planos y ensambles en CAD, no solo STL. Es la fuente natural para repuestos técnicos y componentes funcionales.",
    cuenta: "Sí, gratis",
    licencias: "Variada por autor; revisar antes de uso comercial",
  },
  {
    id: "cgtrader",
    nombre: "CGTrader",
    siglas: "CG",
    url: "https://www.cgtrader.com",
    fuerte: "Modelos 3D de calidad",
    resumen:
      "Marketplace de modelos 3D con una sección de gratis. Mucho del catálogo está pensado para render y videojuegos, pero los formatos se convierten a STL sin problema si la malla es sólida.",
    cuenta: "Sí, gratis",
    licencias: "Comercial o personal según la ficha (los gratis suelen ser personales)",
  },
  {
    id: "free3d",
    nombre: "Free3D",
    siglas: "F3",
    url: "https://free3d.com",
    fuerte: "Formatos variados",
    resumen:
      "Mezcla gratis y premium con muchos formatos distintos (.blend, .obj, .max, .stl). Bueno para encontrar objetos de uso cotidiano y decoración que no están en los repositorios de impresión.",
    cuenta: "No para los gratis",
    licencias: "Revisar cada ficha; hay personales y comerciales",
  },
  {
    id: "pinshape",
    nombre: "Pinshape",
    siglas: "PS",
    url: "https://pinshape.com",
    fuerte: "Filtrar por licencia",
    resumen:
      "Comunidad con gratis y premium, y un filtro de licencia bastante claro. Práctico si lo que buscas es específicamente algo que puedas imprimir y vender sin preguntar.",
    cuenta: "Sí, gratis",
    licencias: "Gratis y de pago; filtro por licencia explícito",
  },
];

/** Buscadores que agregan resultados de varios repositorios a la vez. */
export const BUSCADORES: readonly { nombre: string; url: string; nota: string }[] = [
  {
    nombre: "Yeggi",
    url: "https://www.yeggi.com",
    nota: "Busca la misma palabra en decenas de repositorios a la vez y te lleva a la ficha original.",
  },
  {
    nombre: "STLFinder",
    url: "https://www.stlfinder.com",
    nota: "Igual que Yeggi: meta-buscador de modelos. Útil para no repetir la misma búsqueda diez veces.",
  },
];

/** Programas para diseñar el modelo cuando no existe en ningún lado. */
export const EDITORES: readonly {
  nombre: string;
  url: string;
  nivel: string;
  nota: string;
}[] = [
  {
    nombre: "Tinkercad",
    url: "https://www.tinkercad.com",
    nivel: "Para empezar",
    nota: "En el navegador, gratis y sin instalar nada. Se arma con figuras básicas; sirve para llaveros, soportes y piezas sencillas.",
  },
  {
    nombre: "Blender",
    url: "https://www.blender.org",
    nivel: "Intermedio",
    nota: "Gratis y muy potente, sobre todo para modelado orgánico: figuras, esculturas y objetos con curvas. La curva de aprendizaje es real.",
  },
  {
    nombre: "Fusion 360",
    url: "https://www.autodesk.com/products/fusion-360",
    nivel: "Técnico",
    nota: "CAD paramétrico: se dibuja con medidas exactas y se puede corregir cualquier paso hacia atrás. Es lo que conviene para piezas que deben ensamblar.",
  },
];
