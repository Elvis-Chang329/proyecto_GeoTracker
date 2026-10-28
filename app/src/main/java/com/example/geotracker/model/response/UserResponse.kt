package com.example.geotracker.model.response

import com.google.gson.annotations.SerializedName

data class UserResponse(
    @SerializedName("id") val id: Any? = null,
    @SerializedName("nombre") val nombre: String? = null,
    @SerializedName("apellido") val apellido: String? = null,
    @SerializedName("email") val email: String? = null,
    @SerializedName("usuario") val usuario: String? = null,
    @SerializedName("edad") val edad: Any? = null,
    @SerializedName("fechaNacimiento") val fechaNacimiento: String? = null,
    @SerializedName("telefono") val telefono: String? = null,
    @SerializedName("foto") val foto: String? = null,
    @SerializedName("rol") val rol: String? = null,
    @SerializedName("token") val token: String? = null
)
