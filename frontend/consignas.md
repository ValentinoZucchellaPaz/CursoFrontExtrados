log de datos de admin
dos apartados: crud de roles y asignar cartas a jugadores (coleccion) con max 15 y min 8 sin repetir (validar)
guardar datos de jugador en estado (individual) se deben ver la colección del jugador
usar material
hacer responsive
variables de entorno
jueves 12 se defiende



implementación crud usuarios:
crear vista para crear/editar nuevo usuario (admin puede crear todos)
crear botón y dialog para verificar si se quiere eliminar usuario
mejorar vista de todos los usuarios (hacer tabla y poner barra de busqueda)
poner botones y links para ir a las distintas vistas y ver dialog

implementación asignar cartas a jugadores:
desplegar dialog en userDetail donde se pueden elegir cartas (mostradas como cards con stats, poner distintas formas de visualizar pero se deben clickear para elegir, botón de guardar se deshabilita con menos de 8 y cartas se deshabilita cuando 15 select, botón de guardar debe enviar post a api con cartas que se agregan a colección)