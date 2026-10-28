package com.example.geotracker.model

import com.google.gson.annotations.SerializedName

data class UbicacionRequest(
    @SerializedName("nombre") val nombre: String,
    @SerializedName("descripcion") val descripcion: String,
    @SerializedName("latitud") val latitud: Double,
    @SerializedName("longitud") val longitud: Double
)

data class UbicacionItem(
    @SerializedName("id") val id: String? = null,
    @SerializedName("_id") val mongoId: String? = null,
    @SerializedName("nombre") val nombre: String? = "",
    @SerializedName("descripcion") val descripcion: String? = "",
    @SerializedName("latitud") val latitud: Double? = 0.0,
    @SerializedName("longitud") val longitud: Double? = 0.0,
    @SerializedName("createdAt") val createdAt: String? = null
)

data class UbicacionesResponse(
    @SerializedName("status") val status: String? = null,
    @SerializedName("message") val message: String? = null,
    @SerializedName("data") val data: List<UbicacionItem> = emptyList(),
    @SerializedName("ubicaciones") val ubicaciones: List<UbicacionItem> = emptyList()
)
