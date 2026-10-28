package com.example.geotracker.ui.mapa

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.geotracker.data.LocationRepository
import com.example.geotracker.model.UbicacionItem
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class MapaInteractivoState(
    val ubicaciones: List<UbicacionItem> = emptyList(),
    val ubicacionSeleccionada: UbicacionItem? = null,
    val cargando: Boolean = true,
    val mensajeError: String = ""
)

class MapaInteractivoViewModel(
    private val repository: LocationRepository = LocationRepository()
) : ViewModel() {

    private val _state = MutableStateFlow(MapaInteractivoState())
    val state: StateFlow<MapaInteractivoState> = _state.asStateFlow()

    fun cargarUbicaciones() {
        _state.value = _state.value.copy(cargando = true, mensajeError = "")
        viewModelScope.launch {
            val res = repository.obtenerUbicaciones()
            res.onSuccess { lista ->
                _state.value = _state.value.copy(
                    cargando = false,
                    ubicaciones = lista
                )
            }.onFailure { err ->
                _state.value = _state.value.copy(
                    cargando = false,
                    mensajeError = err.message ?: "Error al cargar ubicaciones en el mapa"
                )
            }
        }
    }

    fun seleccionarUbicacion(item: UbicacionItem?) {
        _state.value = _state.value.copy(ubicacionSeleccionada = item)
    }
}
