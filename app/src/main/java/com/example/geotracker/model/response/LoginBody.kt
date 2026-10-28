package com.example.geotracker.model.response

data class LoginBody(
    val token: String? = null,
    val user: UserResponse = UserResponse()
)
