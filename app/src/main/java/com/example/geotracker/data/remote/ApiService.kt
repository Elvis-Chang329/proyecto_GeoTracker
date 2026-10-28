package com.example.geotracker.data.remote

import com.example.geotracker.model.UbicacionDetalleResponse
import com.example.geotracker.model.UbicacionRequest
import com.example.geotracker.model.UbicacionesListResponse
import com.example.geotracker.model.request.LoginRequest
import com.example.geotracker.model.response.LoginResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface ApiService {
    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>

    @POST("api/ubicaciones")
    suspend fun guardarUbicacion(@Body request: UbicacionRequest): Response<UbicacionDetalleResponse>

    @GET("api/ubicaciones")
    suspend fun obtenerUbicaciones(): Response<UbicacionesListResponse>

    @GET("api/ubicaciones/{id}")
    suspend fun obtenerUbicacionDetalle(@Path("id") id: String): Response<UbicacionDetalleResponse>

    @DELETE("api/ubicaciones/{id}")
    suspend fun eliminarUbicacion(@Path("id") id: String): Response<UbicacionDetalleResponse>
}
