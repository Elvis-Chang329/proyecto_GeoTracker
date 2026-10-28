package com.example.geotracker.model.response

data class LoginResponse(
    val success: Boolean = false,
    val message: String = "",
    val token: String? = null,
    val body: LoginBody = LoginBody(),
    val data: UserResponse? = null,
    val user: UserResponse? = null,
    val error: String? = null
)
