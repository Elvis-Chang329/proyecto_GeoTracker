package com.example.geotracker.data.remote

import com.example.geotracker.model.UbicacionRequest
import com.example.geotracker.model.UbicacionesResponse
import com.example.geotracker.model.request.LoginRequest
import com.example.geotracker.model.response.LoginResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

interface ApiService {
    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>

    @POST("api/ubicaciones")
    suspend fun guardarUbicacion(@Body request: UbicacionRequest): Response<UbicacionesResponse>

    @GET("api/ubicaciones")
    suspend fun obtenerUbicaciones(): Response<UbicacionesResponse>
}
