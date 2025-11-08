Table CasoDeEstudio {
id bigint [pk, increment]
titulo string
location string
summary text
zonas Zona
position_left decimal       // Posición en mapa global (%)
position_top decimal        // Posición en mapa global (%)
created_at timestamp
updated_at timestamp
}

Table Zona {
id bigint [pk, increment]
titulo string
descripcion text
escenas Escena
position_left decimal       // Posición en mapa de caso de estudio (%)
position_top decimal        // Posición en mapa de caso de estudio (%)
created_at timestamp
updated_at timestamp
}

Table Escena {
id bigint [pk, increment]
titulo string
tipoDeEscena TipoDeEscena
theme string                // 'night', 'day', etc.
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
subtitle string
tipoDeAfectacion TipoDeAfectacion
descripcion text
keywords Tags
fuente text
image_url string
position_left decimal       // Posición en mapa de escena (%)
position_top decimal        // Posición en mapa de escena (%)
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
