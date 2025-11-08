Table CasoDeEstudio {
id bigint [pk, increment]
titulo string
zonas Zona
created_at timestamp
updated_at timestamp
}

Table Zona {
id bigint [pk, increment]
titulo string
escenas Escena
created_at timestamp
updated_at timestamp
}

Table Escena {
id bigint [pk, increment]
titulo string
tipoDeEscena TipoDeEscena
elementos Elemento
created_at timestamp
updated_at timestamp
}

Table TipoDeEscena {
id bigint [pk, increment]
nombre string
created_at timestamp
updated_at timestamp
}

Table Elemento {
id bigint [pk, increment]
titulo string
tipoDeAfectacion TipoDeAfectacion
descripcion string
keywords Tags
fuente string
created_at timestamp
updated_at timestamp
}

Table TipoDeAfectacion {
id bigint [pk, increment]
nombre string
created_at timestamp
updated_at timestamp
}

Table Tags {
id bigint [pk, increment]
nombre string
created_at timestamp
updated_at timestamp
}

Ref: CasoDeEstudio.zonas < Zona.id
Ref: Zona.escenas < Escena.id
Ref: Escena.elementos < Elemento.id

Ref: Elemento.tipoDeAfectacion > TipoDeAfectacion.id
Ref: Escena.tipoDeEscena > TipoDeEscena.id

Ref: Elemento.keywords < Tags.id
