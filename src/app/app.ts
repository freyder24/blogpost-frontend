import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './core/components/navbar/navbar';
import { Footer } from './core/components/footer/footer';

export interface Beach {
  id: number;
  name: string;
  region: string;
  country: string;
  countryFlag: string;
  temperature: number;
  image: string;
  tags: string[];
  description: string;
  feature: string;
  featureIcon: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('blogpost-fronter');

  // card blog
  beaches: Beach[] = [
    {
      id: 1,
      name: 'Baía do Sancho',
      region: 'PERNAMBUCO',
      country: 'Brasil',
      countryFlag: '🇧🇷',
      temperature: 29,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
      tags: ['Snorkel & Vírgenes'],
      description:
        'Catalogada recurrentemente entre las mejores playas del mundo. Aislada entre acantilados rojizos, c...',
      feature: 'Acceso protegido',
      featureIcon: '️',
    },
    {
      id: 2,
      name: 'Playa Manuel Antonio',
      region: 'PUNTARENAS',
      country: 'Costa Rica',
      countryFlag: '🇨🇷',
      temperature: 30,
      image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
      tags: ['Naturaleza & Fauna'],
      description:
        'Donde la exuberante selva tropical húmeda se funde directamente con la arena dorada del Pacífico. Monos...',
      feature: 'Parque Nacional',
      featureIcon: '🌿',
    },
    {
      id: 3,
      name: 'Cayo Cangrejo & Providencia',
      region: 'SAN ANDRÉS & PROV.',
      country: 'Colombia',
      countryFlag: '🇨🇴',
      temperature: 29,
      image: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&h=400&fit=crop',
      tags: ['Anclas & Snorkel'],
      description:
        'El epicentro del célebre mar de los siete colores. Fondos coralinos vírgenes, tortugas marinas carey y...',
      feature: 'Reserva Marina',
      featureIcon: '⚓',
    },
    {
      id: 4,
      name: 'Playa Balandra',
      region: 'BAJA CALIFORNIA SUR',
      country: 'México',
      countryFlag: '🇲🇽',
      temperature: 27,
      image: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=600&h=400&fit=crop',
      tags: ['Aguas Calmas & Desierto'],
      description:
        'Una alberca natural gigante rodeada de cardones desérticos y manglares. Sus aguas apenas cubren las rodilla...',
      feature: 'Sin oleaje',
      featureIcon: '🌊',
    },
    {
      id: 5,
      name: 'Cayo de Agua',
      region: 'LOS ROQUES',
      country: 'Venezuela',
      countryFlag: '🇻🇪',
      temperature: 29,
      image: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=600&h=400&fit=crop',
      tags: ['Joya Oculta & Relax'],
      description:
        'Un istmo de arena blanca y fina que conecta dos cayos vírgenes en medio del mar más diáfano del Caribe sur...',
      feature: 'Paz absoluta',
      featureIcon: '🕊️',
    },
    {
      id: 6,
      name: 'Playa Santa Teresa',
      region: 'PENÍNSULA DE NICOYA',
      country: 'Costa Rica',
      countryFlag: '🇨🇷',
      temperature: 29,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
      tags: ['Surf & Atardeceres'],
      description:
        'El paraíso boho del surf latinoamericano. Olas de clase mundial, atardeceres dorados...',
      feature: 'Olas todo el año',
      featureIcon: '',
    },
    {
      id: 7,
      name: 'Jericoacoara',
      region: 'CEARÁ',
      country: 'Brasil',
      countryFlag: '🇧🇷',
      temperature: 31,
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
      tags: ['Aventura & Dunas'],
      description:
        'Lagunas de agua dulce cristalina entre dunas móviles colosales, hamacas dentro del agua, calles de...',
      feature: 'Kitesurf & Relax',
      featureIcon: '🪁',
    },
    {
      id: 8,
      name: 'Playa Paraíso',
      region: 'QUINTANA ROO',
      country: 'México',
      countryFlag: '🇲',
      temperature: 28,
      image: 'https://images.unsplash.com/photo-1520942702018-0862200e6873?w=600&h=400&fit=crop',
      tags: ['Cultura & Caribe'],
      description:
        'Palmeras inclinadas emblemáticas, arena fresca de tórtola coralina y la majestuosa pirámide maya de El...',
      feature: 'Historia Maya',
      featureIcon: '🏛️',
    },
  ];
}
