import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Pregunta {
  pregunta: string;
  respuesta: string;
  abierta: boolean;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
      respuesta: 'El tiempo de entrega depende de tu ubicación. Generalmente los pedidos se despachan dentro de las 48 a 72 horas hábiles después de confirmado el pago. Te enviaremos el número de seguimiento cuando esté en camino.',
      abierta: false,
    },
    {
      pregunta: '¿Puedo cambiar o cancelar mi pedido?',
      respuesta: 'Sí, podés cancelar o cambiar tu pedido hasta 24 horas después de realizada la compra. Comunicate con nosotros a través de nuestras redes o por WhatsApp y te gestionamos el cambio sin problema.',
      abierta: false,
    },
    {
      pregunta: '¿Cómo contacto con la tienda?',
      respuesta: 'Podés contactarnos por WhatsApp, Instagram o Facebook. Todos los links están disponibles en el pie de página de nuestra web. Respondemos de lunes a viernes de 9 a 18 hs.',
      abierta: false,
    },
    {
      pregunta: '¿Hay stock disponible?',
      respuesta: 'Todos los productos que ves en el catálogo están disponibles. Si un talle no aparece es porque no tenemos stock de ese talle en particular. Cualquier consulta, no dudes en contactarnos.',
      abierta: false,
    },
    {
      pregunta: '¿Hacen envíos a todo el país?',
      respuesta: 'Sí, hacemos envíos a toda la República Argentina a través de Correo Argentino y empresas de logística privada. El costo del envío se calcula al momento de finalizar la compra según tu código postal.',
      abierta: false,
    },
  ]);

  toggle(index: number) {
    this.preguntas.update(list =>
      list.map((p, i) => i === index ? { ...p, abierta: !p.abierta } : p)
    );
  }
}
