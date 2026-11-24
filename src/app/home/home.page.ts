import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular/lazy';

import { ResultadoComparacion, ResultadoLiveness, RostrosService } from '../services/rostros.service';
import { Liveness } from '../plugins/liveness';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  cargando = false;

  // Paso 1: foto de referencia (la "foto de perfil" contra la que se compara)
  fotoReferencia?: { vistaPrevia: string; base64: string };

  // Paso 2: prueba de vida
  sessionId?: string;
  liveness?: ResultadoLiveness;

  // Paso 3: comparación
  comparacion?: ResultadoComparacion;

  constructor(private rostrosService: RostrosService, private toastCtrl: ToastController) {}

  get esPersonaReal(): boolean {
    return this.liveness?.status === 'SUCCEEDED' && Number(this.liveness.confidence) >= 80;
  }

  async tomarFotoReferencia() {
    try {
      this.fotoReferencia = await this.rostrosService.tomarFoto();
      this.reiniciarVerificacion();
    } catch (e: any) {
      // Si el usuario cierra la cámara sin tomar foto no es un error real
      if (!String(e?.message).toLowerCase().includes('cancel')) {
        await this.avisar('No se pudo usar la cámara: ' + e?.message, 'danger');
      }
    }
  }

  async iniciarPruebaDeVida() {
    if (!this.fotoReferencia) {
      return;
    }
    this.reiniciarVerificacion();
    await this.ejecutar(async () => {
      // Lambda 1 -> detector nativo (plugin) -> Lambda 2 -> Lambda 3
      this.sessionId = await this.rostrosService.crearSesion();
      try {
        await Liveness.iniciar({ sessionId: this.sessionId });
      } catch (e: any) {
        if (e?.code === 'CANCELADO') {
          return;
        }
        throw e;
      }
      this.liveness = await this.rostrosService.obtenerResultados(this.sessionId);
      if (this.esPersonaReal) {
        this.comparacion = await this.rostrosService.compararRostros(
          this.liveness.referenceImageBase64,
          this.fotoReferencia!.base64,
        );
      }
    });
  }

  private reiniciarVerificacion() {
    this.sessionId = undefined;
    this.liveness = undefined;
    this.comparacion = undefined;
  }

  private async ejecutar(accion: () => Promise<void>) {
    this.cargando = true;
    try {
      await accion();
    } catch (e: any) {
      const detalle = typeof e?.error === 'string' ? e.error : e?.message ?? 'Error desconocido';
      await this.avisar('Error: ' + detalle, 'danger');
    } finally {
      this.cargando = false;
    }
  }

  private async avisar(message: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({ message, color, duration: 3000, position: 'top' });
    await toast.present();
  }
}
