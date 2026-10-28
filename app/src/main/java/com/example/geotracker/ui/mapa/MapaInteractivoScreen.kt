package com.example.geotracker.ui.mapa

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.LatLngBounds
import com.google.maps.android.compose.*

@Composable
fun MapaInteractivoScreen(
    modifier: Modifier = Modifier,
    viewModel: MapaInteractivoViewModel = viewModel(),
    onVolverClick: () -> Unit = {}
) {
    val state by viewModel.state.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.cargarUbicaciones()
    }

    // Diálogo Personalizado Material 3 (Reemplazo de InfoWindow por defecto)
    state.ubicacionSeleccionada?.let { ubicacion ->
        AlertDialog(
            onDismissRequest = { viewModel.seleccionarUbicacion(null) },
            title = {
                Text(
                    text = ubicacion.nombre?.ifBlank { "Sin nombre" } ?: "Ubicación Seleccionada",
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp,
                    color = MaterialTheme.colorScheme.primary
                )
            },
            text = {
                Column {
                    Text(
                        text = "Descripción:",
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp
                    )
                    Text(
                        text = ubicacion.descripcion?.ifBlank { "Sin descripción disponible" } ?: "Sin descripción",
                        fontSize = 14.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = "Coordenadas Exactas:",
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp
                    )
                    Text(
                        text = "Latitud: ${ubicacion.latitud ?: 0.0}",
                        fontSize = 14.sp
                    )
                    Text(
                        text = "Longitud: ${ubicacion.longitud ?: 0.0}",
                        fontSize = 14.sp
                    )
                }
            },
            confirmButton = {
                TextButton(onClick = { viewModel.seleccionarUbicacion(null) }) {
                    Text("Cerrar", fontWeight = FontWeight.Bold)
                }
            }
        )
    }

    Column(modifier = modifier.fillMaxSize()) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Mapa de Ubicaciones",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary,
                modifier = Modifier.weight(1f)
            )
            OutlinedButton(
                onClick = onVolverClick,
                shape = RoundedCornerShape(10.dp),
                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)
            ) {
                Text(
                    text = "Volver",
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp
                )
            }
        }

        if (state.cargando) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator()
            }
        } else if (state.ubicaciones.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "No hay ubicaciones registradas para mostrar en el mapa.",
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        } else {
            val cameraState = rememberCameraPositionState {
                val primera = state.ubicaciones.firstOrNull()
                val lat = primera?.latitud ?: 14.634915
                val lng = primera?.longitud ?: -90.506882
                position = CameraPosition.fromLatLngZoom(LatLng(lat, lng), 12f)
            }

            // Auto-centrado de cámara abarcando todos los marcadores
            LaunchedEffect(state.ubicaciones) {
                if (state.ubicaciones.isNotEmpty()) {
                    val builder = LatLngBounds.Builder()
                    var validCount = 0
                    for (item in state.ubicaciones) {
                        val lat = item.latitud
                        val lng = item.longitud
                        if (lat != null && lng != null) {
                            builder.include(LatLng(lat, lng))
                            validCount++
                        }
                    }
                    if (validCount > 0) {
                        try {
                            val bounds = builder.build()
                            cameraState.animate(CameraUpdateFactory.newLatLngBounds(bounds, 100))
                        } catch (e: Exception) {
                            val first = state.ubicaciones.first()
                            cameraState.animate(CameraUpdateFactory.newLatLngZoom(LatLng(first.latitud ?: 14.634915, first.longitud ?: -90.506882), 12f))
                        }
                    }
                }
            }

            GoogleMap(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                cameraPositionState = cameraState
            ) {
                state.ubicaciones.forEach { item ->
                    val lat = item.latitud
                    val lng = item.longitud
                    if (lat != null && lng != null) {
                        Marker(
                            state = rememberMarkerState(position = LatLng(lat, lng)),
                            title = item.nombre ?: "Ubicación",
                            snippet = item.descripcion ?: "",
                            onClick = {
                                // Anula ventana informativa por defecto y despliega AlertDialog M3
                                viewModel.seleccionarUbicacion(item)
                                true
                            }
                        )
                    }
                }
            }
        }
    }
}
