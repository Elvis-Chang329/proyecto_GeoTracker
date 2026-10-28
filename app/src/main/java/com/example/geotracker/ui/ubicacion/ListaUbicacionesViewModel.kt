package com.example.geotracker.ui.ubicacion

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.geotracker.data.LocationRepository
import com.example.geotracker.model.UbicacionItem
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class ListaUbicacionesState(
    val ubicaciones: List<UbicacionItem> = emptyList(),
    val cargando: Boolean = true,
    val mensajeError: String = ""
)

class ListaUbicacionesViewModel(
    private val repository: LocationRepository = LocationRepository()
) : ViewModel() {

    private val _state = MutableStateFlow(ListaUbicacionesState())
    val state: StateFlow<ListaUbicacionesState> = _state.asStateFlow()

    fun cargarUbicaciones() {
        _state.value = _state.value.copy(cargando = true, mensajeError = "")

        viewModelScope.launch {
            val resultado = repository.obtenerUbicaciones()

            resultado.onSuccess { lista ->
                _state.value = _state.value.copy(
                    cargando = false,
                    ubicaciones = lista
                )
            }.onFailure { err ->
                _state.value = _state.value.copy(
                    cargando = false,
                    mensajeError = err.message ?: "Error al descargar la lista de ubicaciones"
                )
            }
        }
    }
}
