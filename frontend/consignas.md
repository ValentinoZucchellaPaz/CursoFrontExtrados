log de datos de admin
dos apartados: crud de roles y asignar cartas a jugadores (coleccion) con max 15 y min 8 sin repetir (validar)
guardar datos de jugador en estado (individual) se deben ver la colección del jugador
usar material
hacer responsive
variables de entorno
jueves 12 se defiende



implementación crud usuarios:
⌛crear vista para crear/editar nuevo usuario (admin puede crear todos)
✅crear botón y dialog para verificar si se quiere eliminar usuario
✅mejorar vista de todos los usuarios (hacer tabla y poner barra de busqueda)
✅poner botones y links para ir a las distintas vistas y ver dialog

implementación asignar cartas a jugadores:
opción 1 desplegar dialog en userDetail donde se pueden elegir cartas (mostradas como cards con stats, poner distintas formas de visualizar pero se deben clickear para elegir, botón de guardar se deshabilita con menos de 8 y cartas se deshabilita cuando 15 select, botón de guardar debe enviar post a api con cartas que se agregan a colección)

opción 2: 
pagina en donde tengo una parte donde se ven todas las cartas actuales del mazo (coleccion), debajo otra sección donde se puedan clickear y seleccionar las cartas
las cartas que ya son parte de la colección del usuario deben mantenerse "bloqueadas para que no se puedan des-seleccionar" ya que solo se pueden agregar cartas a la colección de un jugador, no se pueden eliminar (limitación el backend), en la parte de coleccion se muestran opacas
cuando se selecciona una nueva carta, en la selección debe opacarse y mostrarse con un ✅, en la vista de coleccion se muestra con color
arriba a la der se muestra un boton agregar, que al presionarlo se mandan ids de cartas nuevas al endpoint
