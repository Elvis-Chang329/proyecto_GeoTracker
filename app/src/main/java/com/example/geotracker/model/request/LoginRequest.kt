package com.example.geotracker.model.request

import com.google.gson.annotations.SerializedName

data class LoginRequest(
    @SerializedName("usuario") val usuario: String,
    @SerializedName("email") val email: String = usuario,
    @SerializedName("contrasena") val contrasena: String,
    @SerializedName("password") val password: String = contrasena
)
