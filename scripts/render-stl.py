#!/usr/bin/env python3
"""Render de preview para Bisel — STL/OBJ → imagen fotorrealista.

Convierte el archivo de una pieza en una imagen de producto con iluminación
de estudio y sombra suave, para mandarla al cliente antes de imprimir
("Preview gratis": lo que ves es la geometría real que se va a imprimir).

Uso (desde la raíz del repo):

  /Applications/Blender.app/Contents/MacOS/Blender --background \
      --python scripts/render-stl.py -- \
      --input pieza.stl --output out/preview.png \
      [--size 1024] [--angle 45] [--elevacion 28] \
      [--color "0.85,0.85,0.85"] [--fondo hueso|transparente|blanco] \
      [--samples 128]

O con el wrapper (más corto):

  ./scripts/render-stl.sh pieza.stl preview.png

Fondo por defecto: "hueso" (#F4F1EA), el color base del sitio, para que la
preview se integre en una tarjeta sin editar. Con "transparente" sale con la
sombra recortada, lista para poner sobre cualquier fondo.

NOTA 3MF: Blender no importa .3mf directamente. Si el cliente manda 3MF,
conviértelo a STL en Bambu Studio (Archivo → Exportar → STL) y corre el
mismo comando. Los formatos soportados aquí son .stl y .obj.
"""

import argparse
import math
import os
import sys


def main() -> int:
    # Blender añade "--" antes de los argumentos del script.
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--input", required=True, help="Archivo .stl o .obj")
    p.add_argument("--output", required=True, help="PNG de salida")
    p.add_argument("--size", type=int, default=1024, help="Lado del PNG en px")
    p.add_argument("--angle", type=float, default=45.0, help="Azimut de cámara (grados)")
    p.add_argument("--elevacion", type=float, default=28.0, help="Elevación de cámara (grados)")
    p.add_argument("--color", default="0.75,0.75,0.75", help="Color RGB 0-1 del material")
    p.add_argument(
        "--fondo",
        default="grafito",
        choices=["grafito", "hueso", "transparente", "blanco"],
        help="Fondo: grafito (oscuro, por defecto), hueso (crema del sitio), transparente o blanco",
    )
    p.add_argument("--sin-suelo", action="store_true", help="No renderiza plano de sombra (útil para piezas planas o recortadas)")
    p.add_argument("--samples", type=int, default=128, help="Muestras de Cycles (solo con --motor cycles)")
    p.add_argument("--motor", default="eevee", choices=["eevee", "cycles"], help="Motor de render: EEVEE (rápido) o Cycles (fotorrealista)")
    args = p.parse_args(argv)

    import bpy  # noqa: PLC0415 — solo existe dentro de Blender

    # Escena limpia: sin cubo, cámara ni luz por defecto de Blender.
    bpy.ops.wm.read_factory_settings(use_empty=True)

    # Color de fondo "hueso" del sitio (#F4F1EA → 0.957, 0.945, 0.918) y
    # "grafito" (#1C1E1F → 0.110, 0.118, 0.122), el color estructural.
    FONDO_HUESO = (0.9569, 0.9451, 0.9176, 1.0)
    FONDO_GRAFITO = (0.1098, 0.1176, 0.1216, 1.0)

    ext = os.path.splitext(args.input)[1].lower()
    if ext == ".stl":
        bpy.ops.wm.stl_import(filepath=args.input)
    elif ext == ".obj":
        bpy.ops.wm.obj_import(filepath=args.input)
    else:
        print(f"Formato no soportado: {ext}. Usa .stl o .obj.")
        print("Si el cliente manda .3mf: conviértelo a STL en Bambu Studio.")
        return 2

    # ── Unificar lo importado en un solo objeto y limpiar transformaciones ──
    objetos = [o for o in bpy.context.selected_objects if o.type == "MESH"]
    if not objetos:
        print("No se importó ninguna malla.")
        return 2
    if len(objetos) > 1:
        bpy.context.view_layer.objects.active = objetos[0]
        for o in objetos[1:]:
            o.select_set(True)
        bpy.ops.object.join()
    pieza = bpy.context.active_object
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

    # ── Centrar en X/Y y sentar en el suelo (Z=0) ──
    min_x, min_y, min_z = (1e9, 1e9, 1e9)
    max_x, max_y, max_z = (-1e9, -1e9, -1e9)
    for v in pieza.bound_box:
        min_x, max_x = min(min_x, v[0]), max(max_x, v[0])
        min_y, max_y = min(min_y, v[1]), max(max_y, v[1])
        min_z, max_z = min(min_z, v[2]), max(max_z, v[2])
    pieza.location = (-(min_x + max_x) / 2, -(min_y + max_y) / 2, -min_z)
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

    ancho = max_x - min_x
    fondo = max_y - min_y
    alto = max_z - min_z
    max_dim = max(ancho, fondo, alto, 1e-6)
    centro_z = alto / 2

    # ── Material: PLA mate con el color pedido ──
    r, g, b = (float(v) for v in args.color.split(","))
    mat = bpy.data.materials.new("PLA_Mate")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = (r, g, b, 1.0)
        bsdf.inputs["Roughness"].default_value = 0.35
        # Un punto de claro-clearcoat: el PLA tiene un brillo sutil.
        if "Clearcoat" in bsdf.inputs:
            bsdf.inputs["Clearcoat"].default_value = 0.4
    if pieza.data.materials:
        pieza.data.materials[0] = mat
    else:
        pieza.data.materials.append(mat)

    # ── Suelo invisible que captura la sombra ──
    # EEVEE no respeta el catcher de forma consistente en 5.2; solo Cycles
    # lo usa (en EEVEE la pieza flota en el fondo, que es una estética válida
    # de estudio oscuro y evita planos rotos).
    suelo = None
    if args.motor == "cycles" and not args.sin_suelo:
        try:
            bpy.ops.mesh.primitive_plane_add(size=max_dim * 6, location=(0, 0, 0))
            suelo = bpy.context.active_object
            # API Blender 5.x: el catcher es propiedad del OBJETO (antes era del material).
            suelo.is_shadow_catcher = True
            mat_sombra = bpy.data.materials.new("Sombra")
            mat_sombra.use_nodes = True
            bsdf_sombra = mat_sombra.node_tree.nodes.get("Principled BSDF")
            if bsdf_sombra:
                # Difuso puro: nada de brillos especulares de las luces en el piso.
                bsdf_sombra.inputs["Roughness"].default_value = 1.0
            if suelo.data.materials:
                suelo.data.materials[0] = mat_sombra
            else:
                suelo.data.materials.append(mat_sombra)
        except Exception as exc:
            print(f"DEBUG sin suelo por: {exc}")
            suelo = None  # sin sombra no es fatal

    # ── Luces de estudio, a escala del objeto ──
    def area_luz(nombre, x, y, z, potencia, color=(1.0, 1.0, 1.0, 1.0)):
        bpy.ops.object.light_add(type="AREA", location=(x, y, z))
        luz = bpy.context.active_object
        luz.data.energy = potencia
        luz.data.size = max_dim * (1.1 if args.motor == "eevee" else 0.8)
        luz.data.color = color[:3]
        luz.name = nombre
        return luz

    escala = max_dim / 0.1  # la potencia se escala con el tamaño de la pieza
    d_luz = max_dim * 2.4
    if args.motor == "eevee":
        # EEVEE usa su propia escala de energía. Key rasante a la izquierda:
        # sus sombras definen el relieve; rim separa la pieza del fondo.
        area_luz("Key", d_luz * 0.75, -d_luz * 0.5, d_luz * 0.45, 650 * escala, (1.0, 0.97, 0.92))
        area_luz("Fill", -d_luz * 0.7, -d_luz * 0.4, d_luz * 0.35, 30 * escala, (0.85, 0.9, 1.0))
        area_luz("Rim", -d_luz * 0.35, d_luz * 0.85, d_luz * 0.75, 300 * escala, (1.0, 0.98, 0.95))
        area_luz("Top", 0, 0, d_luz * 1.5, 20 * escala, (1.0, 0.99, 0.96))
    else:
        area_luz("Key", d_luz * 0.6, -d_luz * 0.6, d_luz * 0.9, 18 * escala**2, (1.0, 0.97, 0.92))
        area_luz("Fill", -d_luz * 0.8, -d_luz * 0.4, d_luz * 0.4, 7 * escala**2, (0.85, 0.9, 1.0))
        area_luz("Rim", -d_luz * 0.3, d_luz * 0.9, d_luz * 0.7, 12 * escala**2, (1.0, 0.98, 0.95))
        area_luz("Top", 0, 0, d_luz * 1.4, 8 * escala**2, (1.0, 0.99, 0.96))

    # ── Cámara: encuadra la pieza con margen ──
    bpy.ops.object.camera_add(location=(0, 0, 0))
    cam = bpy.context.active_object
    cam.data.type = "PERSP"
    cam.data.angle = math.radians(35)
    bpy.context.scene.camera = cam

    az = math.radians(args.angle)
    el = math.radians(args.elevacion)
    dist = (max_dim / 2) / math.tan(cam.data.angle / 2) * 1.15
    cam.location = (
        dist * math.cos(el) * math.cos(az),
        dist * math.cos(el) * math.sin(az),
        dist * math.sin(el) + centro_z,
    )

    bpy.ops.object.empty_add(location=(0, 0, centro_z))
    objetivo = bpy.context.active_object
    objetivo.name = "ObjetivoCamara"
    track = cam.constraints.new(type="TRACK_TO")
    track.target = objetivo
    track.track_axis = "TRACK_NEGATIVE_Z"
    track.up_axis = "UP_Y"

    # ── Render ──
    escena = bpy.context.scene
    if args.motor == "cycles":
        escena.render.engine = "CYCLES"
        escena.cycles.samples = args.samples
        escena.cycles.use_denoising = True
    else:
        escena.render.engine = "BLENDER_EEVEE"
        escena.eevee.taa_render_samples = 16
    escena.render.resolution_x = args.size
    escena.render.resolution_y = args.size
    escena.render.image_settings.file_format = "PNG"
    escena.render.filepath = args.output

    mundo = escena.world
    if mundo is None:
        mundo = bpy.data.worlds.new("Mundo")
        escena.world = mundo
    if args.fondo == "transparente":
        escena.render.film_transparent = True
    else:
        escena.render.film_transparent = False
        mundo.use_nodes = True
        bg = mundo.node_tree.nodes.get("Background") if mundo.node_tree else None
        if bg:
            if args.fondo == "grafito":
                bg.inputs[0].default_value = FONDO_GRAFITO
            elif args.fondo == "hueso":
                bg.inputs[0].default_value = FONDO_HUESO
            else:
                bg.inputs[0].default_value = (1.0, 1.0, 1.0, 1.0)
            bg.inputs[1].default_value = 1.0

    os.makedirs(os.path.dirname(os.path.abspath(args.output)) or ".", exist_ok=True)
    bpy.ops.render.render(write_still=True)
    print(f"Render listo: {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
