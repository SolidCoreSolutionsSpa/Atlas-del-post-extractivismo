Table CaseOfStudies {
id bigint [pk, increment]
title string
summary string
zones Zona
image_path string
position_top decimal
position_left decimal
created_at timestamp
updated_at timestamp
}

Table Zones {
id bigint [pk, increment]
title string
escene Escenes
image_path string
position_top decimal
position_left decimal
decorations Decoracion
created_at timestamp
updated_at timestamp
}

Table Decorations {
id bigint [pk, increment]
image_path string
position_top decimal
position_left decimal
created_at timestamp
updated_at timestamp
}

Table Escenes {
id bigint [pk, increment]
title string
escene_type EsceneTypes
elements Elements
image_path string
position_top decimal
position_left decimal
created_at timestamp
updated_at timestamp
}

Table EsceneTypes {
id bigint [pk, increment]
name string
created_at timestamp
updated_at timestamp
}

Table Elements {
id bigint [pk, increment]
title string
affectation_type AffectationTypes
description string
keywords Tags
source string
image_path string
position_top decimal
position_left decimal
created_at timestamp
updated_at timestamp
}

Table AffectationTypes {
id bigint [pk, increment]
name string
created_at timestamp
updated_at timestamp
}

Table Tags {
id bigint [pk, increment]
name string
created_at timestamp
updated_at timestamp
}

Ref: CaseOfStudies.zones < Zones.id
Ref: Zones.escene < Escenes.id
Ref: Escenes.elements < Elements.id

Ref: Elements.affectation_type > AffectationTypes.id
Ref: Escenes.escene_type > EsceneTypes.id

Ref: Elements.keywords < Tags.id

Ref: Zones.decorations < Decorations.id
