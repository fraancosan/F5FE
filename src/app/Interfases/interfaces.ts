export interface usuario {
  id: number;
  dni: string;
  nombre: string;
  mail: string;
  telefono: string;
  contraseña: string;
  rol: string;
}

export interface usuarioPremium {
  id: number;
  dni: string;
  nombre: string;
  mail: string;
  telefono: string;
  totalReservas: number;
}

export interface equipo {
  id: number;
  nombre: string;
}

export interface equipoUsuario {
  id: number;
  idEquipo: number | equipo;
  idUsuario: number | usuario;
  capitan: boolean;
}

export interface torneo {
  id: number;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
  precioInscripcion: number;
  cantidadEquipos: number;
}

export interface equipoTorneo {
  id: number;
  idEquipo: number | equipo;
  idTorneo: number | torneo;
  fechaCreacion: Date;
  idMP: string;
  urlPreferenciaPago: string;
}

export interface partidoTorneo {
  id: number;
  idEquipo1: number | equipo;
  idEquipo2: number | equipo;
  idTorneo: number | torneo;
  resultado: string;
  fecha: Date;
}

export interface muro {
  id: number;
  titulo: string;
  noticia: string;
  fecha: Date;
  fechaFin: Date;
}

export interface politica {
  nombre: string;
  descripcion: string;
}

export interface cancha {
  id: number;
  disponible: boolean;
}

export interface turno {
  id: number;
  idCancha: number | cancha;
  idUsuario: number | usuario;
  idUsuarioCompartido: number | usuario;
  fecha: Date;
  hora: Date;
  estado: string;
  precio: number;
  precioSeña: number;
  buscandoRival: boolean;
  parrilla: boolean;
  fechaCreacion: Date;
  fechaUsuarioCompartido: Date;
  idMP: string;
  idMPCompartido: string;
  urlPreferenciaPago: string;
  urlPreferenciaPagoCompartido: string;
}
