import cleanserImg from '@/assets/products/cleanser.jpg';
import tonerImg from '@/assets/products/toner.jpg';
import creamImg from '@/assets/products/cream.jpg';
import scrubImg from '@/assets/products/scrub.jpg';
import treatmentImg from '@/assets/products/treatment.jpg';
import maskImg from '@/assets/products/mask.jpg';
import milkCleanserImg from '@/assets/products/milk-cleanser.jpg';
import nightCreamImg from '@/assets/products/night-cream.jpg';
import spfCreamImg from '@/assets/products/spf-cream.jpg';
import mousseImg from '@/assets/products/mousse.jpg';

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: 'detersione' | 'tonico' | 'crema' | 'scrub' | 'trattamento' | 'maschera';
  tags: string[];
  rating: number;
  link: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Detergente viso ultra delicato',
    brand: 'Rigenera 0.1',
    description: 'Detersione profonda ma gentile per tutti i tipi di pelle',
    price: 59.90,
    image: cleanserImg,
    category: 'detersione',
    tags: ['pelle sensibile', 'quotidiano', 'delicato'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/rigenera-0-1-detergente-viso-ultra-delicato/'
  },
  {
    id: '2',
    name: 'Struccante Viso in Salvietta',
    brand: 'Rigenera',
    description: 'Struccante pratico e delicato per ogni tipo di pelle',
    price: 5.90,
    image: milkCleanserImg,
    category: 'detersione',
    tags: ['pratico', 'viaggio', 'delicato'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/rigenera-struccante-viso-in-salvietta/'
  },
  {
    id: '3',
    name: 'Tonico viso AHA',
    brand: 'Rigenera Xaikonix',
    description: 'Tonico esfoliante con AHA per pelle luminosa',
    price: 59.90,
    image: tonerImg,
    category: 'tonico',
    tags: ['esfoliante', 'luminosità', 'anti-età'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/rigenera-xaikonix-tonic-me/'
  },
  {
    id: '4',
    name: 'Flawless Mousse',
    brand: 'Face+ SeboKey',
    description: 'Mousse detergente per pelle mista e grassa',
    price: 34.90,
    image: mousseImg,
    category: 'detersione',
    tags: ['pelle grassa', 'pelle mista', 'sebo-regolatore'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/face-sebokey-flawless-mousse/'
  },
  {
    id: '5',
    name: 'Hama Cream',
    brand: 'Face+ Sensation',
    description: 'Crema viso idratante intensiva',
    price: 56.90,
    image: creamImg,
    category: 'crema',
    tags: ['idratante', 'nutriente', 'quotidiano'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/face-sensation-hama-cream/'
  },
  {
    id: '6',
    name: 'Retynol.me',
    brand: 'Rigenera Xaikonix',
    description: 'Crema notte rigenerante con retinolo',
    price: 94.90,
    image: nightCreamImg,
    category: 'crema',
    tags: ['anti-età', 'notte', 'rigenerante', 'retinolo'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/rigenera-xaikonix-retynol-me/'
  },
  {
    id: '7',
    name: 'Scrub.me',
    brand: 'Rigenera Xaikonix',
    description: 'Scrub maschera viso per una pelle rinnovata',
    price: 69.90,
    image: scrubImg,
    category: 'scrub',
    tags: ['esfoliante', 'rinnovamento', 'luminosità'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/rigenera-xaikonix-scrub-me/'
  },
  {
    id: '8',
    name: 'Mask.me',
    brand: 'Rigenera Xaikonix',
    description: 'Maschera viso ultraidratante',
    price: 89.90,
    image: maskImg,
    category: 'maschera',
    tags: ['idratante', 'nutriente', 'settimanale'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/rigenera-xaikonix-mask-me/'
  },
  {
    id: '9',
    name: 'Sweety Oil Milky',
    brand: 'Face+ Sensation',
    description: 'Latte detergente viso delicato',
    price: 36.90,
    image: milkCleanserImg,
    category: 'detersione',
    tags: ['delicato', 'latte detergente', 'pelle secca'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/face-sensation-sweety-oil-milky/'
  },
  {
    id: '10',
    name: 'Crema Anti Age SPF50',
    brand: 'Rigenera 0.8',
    description: 'Crema anti età con protezione solare alta',
    price: 52.00,
    image: spfCreamImg,
    category: 'crema',
    tags: ['anti-età', 'SPF', 'protezione', 'quotidiano'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/rigenera-0-8-crema-anti-age-spf50/'
  },
  {
    id: '11',
    name: 'Pinky Tonix',
    brand: 'Face+ Sensation',
    description: 'Tonico viso lenitivo con formula delicata',
    price: 39.90,
    image: tonerImg,
    category: 'tonico',
    tags: ['lenitivo', 'delicato', 'pelle sensibile'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/face-sensation-pinky-tonix/'
  },
  {
    id: '12',
    name: 'Luminor Recovery Cream',
    brand: 'Face+',
    description: 'Crema anti radicali per il recupero della pelle',
    price: 64.90,
    image: creamImg,
    category: 'crema',
    tags: ['anti-radicali', 'recupero', 'rigenerante'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/face-luminor-recovery-cream/'
  },
  {
    id: '13',
    name: 'Acn-End 10% Sulfur Suspension',
    brand: 'Face+ SeboKey',
    description: 'Trattamento mirato brufoli con zolfo',
    price: 39.90,
    image: treatmentImg,
    category: 'trattamento',
    tags: ['anti-brufoli', 'pelle grassa', 'trattamento mirato'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/face-sebokey-acn-end-10-sulfur-suspension/'
  },
  {
    id: '14',
    name: 'Smooth.me Step1 e Step2',
    brand: 'Rigenera Xaikonix',
    description: 'Esfoliante peeling viso in due step',
    price: 149.90,
    image: scrubImg,
    category: 'scrub',
    tags: ['peeling', 'professionale', 'rinnovamento'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/rigenera-xaikonix-smooth-me/'
  },
  {
    id: '15',
    name: 'Mosqueta\'s Soft Cream',
    brand: 'Face+ SeboKey',
    description: 'Crema delicata alla rosa mosqueta',
    price: 54.90,
    image: creamImg,
    category: 'crema',
    tags: ['nutriente', 'rosa mosqueta', 'pelle secca'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/face-sebokey-mosquetas-soft-cream/'
  },
];

export interface RoutineStep {
  id: string;
  name: string;
  description: string;
  order: number;
  icon: string;
  products: Product[];
}

export const giftProduct: Product = {
  id: 'gift',
  name: 'Magic Tonix Travel Size',
  brand: 'Face+ SeboKey',
  description: 'Tonico magico formato viaggio - il tuo regalo esclusivo!',
  price: 0,
  image: tonerImg,
  category: 'tonico',
  tags: ['regalo', 'viaggio'],
  rating: 5,
  link: '#'
};
