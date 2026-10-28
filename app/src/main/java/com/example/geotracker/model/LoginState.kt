package com.example.geotracker.model

data class LoginState(
    val email: String = "",
    val password: String = "",
    val mensaje: String = "",
    val cargando: Boolean = false,
    val loginExito: Boolean = false,
    val token: String = "",
    val userId: String = "",
    val nombre: String = "",
    val apellido: String = "",
    val usuario: String = "",
    val edad: String = "",
    val fechaNacimiento: String = "",
    val telefono: String = "",
    val foto: String = "",
    val rol: String = "censista"
)
