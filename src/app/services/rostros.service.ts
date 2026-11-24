import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Camera, CameraDirection } from '@capacitor/camera';

import { environment } from '../../environments/environment';

// Respuesta de la Lambda de resultados (GetFaceLivenessSessionResults)
export interface ResultadoLiveness {
  status: string;              // CREATED | IN_PROGRESS | SUCCEEDED | FAILED | EXPIRED
  confidence: number | string; // 0-100, qué tan seguro está Rekognition de que la persona es real
  referenceImageBase64: string;
}

// Respuesta de la Lambda de comparación (CompareFaces)
export interface ResultadoComparacion {
  match: boolean;
  similarity: number;
  threshold: number;
}

// Tamaño máximo (px) del lado mayor de la foto. Fotos más chicas viajan más
// rápido y no rebasan el límite de 6 MB por petición de Lambda.
const LADO_MAXIMO = 800;

@Injectable({ providedIn: 'root' })
export class RostrosService {

  constructor(private http: HttpClient) {}

  /** Abre la cámara y devuelve la foto como data URL (para mostrarla) y base64 puro (para la Lambda). */
  async tomarFoto(): Promise<{ vistaPrevia: string; base64: string }> {
    const foto = await Camera.takePhoto({
      quality: 70,
      cameraDirection: CameraDirection.Front,
      correctOrientation: true,
    });
    if (!foto.webPath) {
      throw new Error('No se pudo obtener la foto');
    }
    const vistaPrevia = await this.redimensionar(foto.webPath);
    // Rekognition necesita solo los bytes: se quita el prefijo "data:image/jpeg;base64,"
    const base64 = vistaPrevia.split(',')[1];
    return { vistaPrevia, base64 };
  }

  /** Lambda 1: crea la sesión de Face Liveness y devuelve el sessionId. */
  crearSesion(): Promise<string> {
    return firstValueFrom(this.http.post<string>(environment.lambdas.crearSesion, {}));
  }

  /** Lambda 2: resultado de la prueba de vida y la imagen de referencia que capturó Rekognition. */
  obtenerResultados(sessionId: string): Promise<ResultadoLiveness> {
    return firstValueFrom(
      this.http.post<ResultadoLiveness>(environment.lambdas.resultados, { sessionId })
    );
  }

  /** Lambda 3: compara el rostro de la prueba de vida con la foto de referencia. */
  compararRostros(sourceImage: string, targetImage: string): Promise<ResultadoComparacion> {
    return firstValueFrom(
      this.http.post<ResultadoComparacion>(environment.lambdas.comparar, { sourceImage, targetImage })
    );
  }

  private redimensionar(src: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const escala = Math.min(1, LADO_MAXIMO / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * escala);
        canvas.height = Math.round(img.height * escala);
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = () => reject(new Error('No se pudo leer la foto'));
      img.src = src;
    });
  }
}
