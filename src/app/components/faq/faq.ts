import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Pregunta {
  pregunta: string;
  respuesta: string;
  abierta: boolean;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.html',
  styleUrls: ['./faq.css'],
})
export class Faq {
  preguntas = signal<Pregunta[]>([
    {
      pregunta: '¿Cómo hago un pedido?',
      respuesta: 'Simplemente navegá por nuestro catálogo, seleccioná el producto que te guste, elegí tu talle y agregalo al carrito. Después andá al carrito y completá tus datos para finalizar la compra.',
      abierta: false,
    },
    {
      pregunta: '¿Cómo funciona el pago completo?',
      respuesta: 'Podés pagar el total del producto al momento de hacer el pedido. Una vez que confirmás la compra, te enviaremos los datos de transferencia o el link de pago según el método que prefieras.',
      abierta: false,
    },
    {
      pregunta: '¿Cómo funciona la seña (50%)?',
      respuesta: 'Podés reservar tu producto pagando solo el 50% del valor. El 50% restante lo abonás cuando recibís el producto. La seña garantiza que guardamos tu pedido y talle seleccionado.',
      abierta: false,
    },
    {
      pregunta: '¿Cuánto tarda la entrega?',
      respuesta: 'Apenas confirmamos tu pago, despachamos el pedido desde Piedra dentro de las 48 a 72 horas hábiles. El envío va por Correo Argentino o Busplus y el costo lo pagás vos cuando lo recibís. No manejamos número de seguimiento, pero si pasa algo te avisamos.',
      abierta: false,
    },
    {
      pregunta: '¿Puedo cambiar o cancelar mi pedido?',
      respuesta: 'Si querés cancelar o cambiar algo, mandanos un WhatsApp al número que está en la página. Nosotros lo gestionamos con el admin y listo. Es todo directo entre vos y nosotros, sin vueltas.',
      abierta: false,
    },
    {
      pregunta: '¿Cómo contacto con la tienda?',
      respuesta: 'Por WhatsApp, Instagram o Facebook. Todos los links están en el pie de página. Respondemos de lunes a viernes de 9 a 18 hs.',
      abierta: false,
    },
    {
      pregunta: '¿Hay stock disponible?',
      respuesta: 'Todo lo que ves en el catálogo está disponible. Si un talle no aparece es porque no tenemos. Ante cualquier duda, consultanos.',
      abierta: false,
    },
    {
      pregunta: '¿Hacen envíos a todo el país?',
      respuesta: 'Sí, enviamos a toda la Argentina por Correo Argentino o Busplus. El costo del envío lo pagás cuando lo recibís en tu domicilio. No tenemos un mínimo de compra.',
      abierta: false,
    },
  ]);

  toggle(index: number) {
    this.preguntas.update(list =>
      list.map((p, i) => i === index ? { ...p, abierta: !p.abierta } : p)
    );
  }
}
