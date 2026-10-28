package com.example.geotracker.ui.Login

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.geotracker.data.AuthRepository
import com.example.geotracker.model.LoginState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import org.json.JSONObject

class LoginViewModel : ViewModel() {
    private val repository = AuthRepository()

    private val _state = MutableStateFlow(LoginState())
    val state: StateFlow<LoginState> = _state.asStateFlow()

    fun onEmailChange(nuevoEmail: String) {
        _state.value = _state.value.copy(email = nuevoEmail, mensaje = "")
    }

    fun onPasswordChange(nuevoPassword: String) {
        _state.value = _state.value.copy(password = nuevoPassword, mensaje = "")
    }

    fun onLoginClick() {
        val currentEmail = _state.value.email.trim()
        val currentPassword = _state.value.password.trim()

        if (currentEmail.isEmpty() || currentPassword.isEmpty()) {
            _state.value = _state.value.copy(mensaje = "Por favor completa todos los campos.")
            return
        }

        _state.value = _state.value.copy(cargando = true, mensaje = "")

        viewModelScope.launch {
            val resultado = repository.login(currentEmail, currentPassword)

            resultado.onSuccess { response ->
                val user = response.data ?: response.user ?: response.body.user
                val tokenStr = response.token ?: response.body.token ?: ""

                val userIdClean = when (val rawId = user.id) {
                    is Double -> rawId.toInt().toString()
                    is Float -> rawId.toInt().toString()
                    is Number -> rawId.toInt().toString()
                    is String -> rawId.substringBefore(".")
                    else -> rawId?.toString()?.substringBefore(".") ?: ""
                }

                _state.value = _state.value.copy(
                    cargando = false,
                    loginExito = true,
                    userId = userIdClean,
                    email = user.email ?: currentEmail,
                    token = tokenStr,
                    nombre = user.nombre ?: "",
                    apellido = user.apellido ?: "",
                    usuario = user.usuario ?: currentEmail,
                    edad = user.edad?.toString() ?: "",
                    fechaNacimiento = user.fechaNacimiento ?: "",
                    telefono = user.telefono ?: "",
                    foto = user.foto ?: "",
                    rol = user.rol ?: "censista",
                    mensaje = response.message.ifBlank { "¡Login exitoso!" }
                )
            }.onFailure { error ->
                val rawError = error.message ?: ""
                val parsedMsg = try {
                    val json = JSONObject(rawError)
                    json.optString("message", rawError)
                } catch (e: Exception) {
                    rawError.ifBlank { "Error al iniciar sesión" }
                }
                _state.value = _state.value.copy(
                    cargando = false,
                    loginExito = false,
                    mensaje = parsedMsg
                )
            }
        }
    }
}
