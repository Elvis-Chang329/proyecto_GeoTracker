package com.example.geotracker.data

import com.example.geotracker.data.remote.RetrofitClient
import com.example.geotracker.model.request.LoginRequest
import com.example.geotracker.model.response.LoginResponse

class AuthRepository {
    private val apiService = RetrofitClient.apiService

    suspend fun login(emailOrUser: String, password: String): Result<LoginResponse> {
        return try {
            val response = apiService.login(LoginRequest(usuario = emailOrUser, contrasena = password))
            if (response.isSuccessful && response.body() != null) {
                val body = response.body()!!
                val tokenStr = body.token ?: body.body.token
                if (!tokenStr.isNullOrBlank()) {
                    RetrofitClient.authToken = tokenStr
                }
                Result.success(body)
            } else {
                val rawError = response.errorBody()?.string() ?: "Error de autenticación"
                Result.failure(Exception(rawError))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
