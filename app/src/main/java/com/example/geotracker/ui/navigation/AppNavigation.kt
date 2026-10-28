package com.example.geotracker.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.geotracker.ui.Login.LoginScreen
import com.example.geotracker.ui.Login.LoginViewModel
import com.example.geotracker.ui.dashboard.DashboardScreen
import com.example.geotracker.ui.mapa.MapaInteractivoScreen
import com.example.geotracker.ui.ubicacion.CapturaUbicacionScreen
import com.example.geotracker.ui.ubicacion.ListaUbicacionesScreen

object AppRoutes {
    const val LOGIN = "login"
    const val DASHBOARD = "dashboard?nombre={nombre}"
    const val CAPTURA_GPS = "captura_gps"
    const val LISTADO_UBICACIONES = "listado_ubicaciones"
    const val MAPA_INTERACTIVO = "mapa_interactivo"

    fun dashboardRoute(nombre: String = ""): String {
        val n = nombre.ifBlank { "Usuario" }
        return "dashboard?nombre=$n"
    }
}

@Composable
fun AppNavigator(
    modifier: Modifier = Modifier,
    navController: NavHostController = rememberNavController()
) {
    NavHost(
        navController = navController,
        startDestination = AppRoutes.LOGIN,
        modifier = modifier
    ) {
        composable(AppRoutes.LOGIN) {
            val viewModel: LoginViewModel = viewModel()
            val state by viewModel.state.collectAsState()

            LoginScreen(
                viewModel = viewModel,
                onLoginSuccess = { nombre, _, usuario ->
                    val nameToShow = state.nombre.ifBlank { nombre.ifBlank { usuario } }
                    val route = AppRoutes.dashboardRoute(nombre = nameToShow)
                    navController.navigate(route) {
                        popUpTo(AppRoutes.LOGIN) { inclusive = true }
                    }
                }
            )
        }

        composable(
            route = AppRoutes.DASHBOARD,
            arguments = listOf(
                navArgument("nombre") { type = NavType.StringType; defaultValue = "Usuario" }
            )
        ) { backStackEntry ->
            val nombre = backStackEntry.arguments?.getString("nombre")?.trim() ?: "Usuario"

            DashboardScreen(
                userName = nombre,
                onCapturarGpsClick = {
                    navController.navigate(AppRoutes.CAPTURA_GPS)
                },
                onVerListadoClick = {
                    navController.navigate(AppRoutes.LISTADO_UBICACIONES)
                },
                onVerMapaClick = {
                    navController.navigate(AppRoutes.MAPA_INTERACTIVO)
                },
                onLogoutClick = {
                    navController.navigate(AppRoutes.LOGIN) {
                        popUpTo(AppRoutes.DASHBOARD) { inclusive = true }
                    }
                }
            )
        }

        composable(AppRoutes.CAPTURA_GPS) {
            CapturaUbicacionScreen(
                onVolverClick = {
                    navController.popBackStack()
                }
            )
        }

        composable(AppRoutes.LISTADO_UBICACIONES) {
            ListaUbicacionesScreen(
                onVolverClick = {
                    navController.popBackStack()
                }
            )
        }

        composable(AppRoutes.MAPA_INTERACTIVO) {
            MapaInteractivoScreen(
                onVolverClick = {
                    navController.popBackStack()
                }
            )
        }
    }
}

@Composable
fun AppNavigation(
    modifier: Modifier = Modifier,
    navController: NavHostController = rememberNavController()
) {
    AppNavigator(navController = navController, modifier = modifier)
}
