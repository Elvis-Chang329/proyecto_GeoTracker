package com.example.geotracker.data

import com.example.geotracker.data.remote.RetrofitClient
import com.example.geotracker.model.UbicacionItem
import com.example.geotracker.model.UbicacionRequest
import com.example.geotracker.model.UbicacionesResponse

class LocationRepository {
    private val apiService = RetrofitClient.apiService

    suspend fun guardarUbicacion(
        nombre: String,
        descripcion: String,
        latitud: Double,
        longitud: Double
    ): Result<UbicacionesResponse> {
        return try {
            val req = UbicacionRequest(
                nombre = nombre,
                descripcion = descripcion,
                latitud = latitud,
                longitud = longitud
            )
            val response = apiService.guardarUbicacion(req)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                val rawError = response.errorBody()?.string() ?: "Error al guardar ubicación"
                Result.failure(Exception(rawError))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun obtenerUbicaciones(): Result<List<UbicacionItem>> {
        return try {
            val response = apiService.obtenerUbicaciones()
            if (response.isSuccessful && response.body() != null) {
                val body = response.body()!!
                val list = if (body.data.isNotEmpty()) body.data else body.ubicaciones
                Result.success(list)
            } else {
                val rawError = response.errorBody()?.string() ?: "Error al obtener ubicaciones"
                Result.failure(Exception(rawError))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
