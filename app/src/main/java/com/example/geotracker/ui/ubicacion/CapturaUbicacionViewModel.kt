package com.example.geotracker.ui.ubicacion

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.geotracker.data.LocationRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class CapturaUbicacionState(
    val nombre: String = "",
    val descripcion: String = "",
    val latitud: Double = 0.0,
    val longitud: Double = 0.0,
    val tieneUbicacion: Boolean = false,
    val cargando: Boolean = false,
    val mensajeExito: String = "",
    val mensajeError: String = ""
)

class CapturaUbicacionViewModel(
    private val repository: LocationRepository = LocationRepository()
) : ViewModel() {

    private val _state = MutableStateFlow(CapturaUbicacionState())
    val state: StateFlow<CapturaUbicacionState> = _state.asStateFlow()

    fun onNombreChange(valor: String) {
        _state.value = _state.value.copy(nombre = valor, mensajeExito = "", mensajeError = "")
    }

    fun onDescripcionChange(valor: String) {
        _state.value = _state.value.copy(descripcion = valor, mensajeExito = "", mensajeError = "")
    }

    fun setCoordenadas(lat: Double, lng: Double) {
        _state.value = _state.value.copy(
            latitud = lat,
            longitud = lng,
            tieneUbicacion = true,
            mensajeError = ""
        )
    }

    fun guardarUbicacion() {
        val currentNombre = _state.value.nombre.trim()
        val currentDesc = _state.value.descripcion.trim()
        val lat = _state.value.latitud
        val lng = _state.value.longitud

        if (currentNombre.isEmpty() || currentDesc.isEmpty()) {
            _state.value = _state.value.copy(mensajeError = "Ingresa el nombre y la descripción del lugar.")
            return
        }

        if (!_state.value.tieneUbicacion || (lat == 0.0 && lng == 0.0)) {
            _state.value = _state.value.copy(mensajeError = "Obtén la ubicación GPS antes de guardar.")
            return
        }

        _state.value = _state.value.copy(cargando = true, mensajeExito = "", mensajeError = "")

        viewModelScope.launch {
            val resultado = repository.guardarUbicacion(
                nombre = currentNombre,
                descripcion = currentDesc,
                latitud = lat,
                longitud = lng
            )

            resultado.onSuccess {
                _state.value = _state.value.copy(
                    cargando = false,
                    nombre = "",
                    descripcion = "",
                    mensajeExito = "¡Ubicación guardada exitosamente en el servidor!"
                )
            }.onFailure { err ->
                _state.value = _state.value.copy(
                    cargando = false,
                    mensajeError = err.message ?: "Error al guardar ubicación"
                )
            }
        }
    }
}
