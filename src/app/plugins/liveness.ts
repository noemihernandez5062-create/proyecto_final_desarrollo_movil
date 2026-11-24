import { registerPlugin, WebPlugin } from '@capacitor/core';

// Plugin propio (nativo Android): android/app/src/main/java/com/reconocimiento/facial/plugin/LivenessPlugin.kt
export interface LivenessPlugin {
  /**
   * Abre el detector de Face Liveness con la sesión creada por la Lambda 1.
   * Se resuelve cuando la prueba termina; el resultado se consulta con la Lambda 2.
   * Se rechaza con code 'CANCELADO', 'PERMISO_DENEGADO' o 'ERROR_DETECTOR'.
   */
  iniciar(options: { sessionId: string; region?: string }): Promise<{ sessionId: string }>;
}

// En el navegador (ionic serve) no existe el detector nativo
class LivenessWeb extends WebPlugin implements LivenessPlugin {
  async iniciar(): Promise<{ sessionId: string }> {
    throw this.unavailable('La prueba de vida solo funciona en la app de Android');
  }
}

export const Liveness = registerPlugin<LivenessPlugin>('Liveness', {
  web: () => new LivenessWeb(),
});
