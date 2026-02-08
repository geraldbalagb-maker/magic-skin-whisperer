// === Immagini prodotto reali ===
import rigeneraDetersioneImg from '@/assets/products/rigenera-detersione.jpg';
import milkCleanserImg from '@/assets/products/milk-cleanser.jpg';
import xaikonixTonicMeImg from '@/assets/products/xaikonix-tonic-me.jpg';
import sebokeyFlawlessMousseImg from '@/assets/products/sebokey-flawless-mousse.jpg';
import sensationHamaCreamImg from '@/assets/products/sensation-hama-cream.jpg';
import nightCreamImg from '@/assets/products/night-cream.jpg';
import scrubImg from '@/assets/products/scrub.jpg';
import maskImg from '@/assets/products/mask.jpg';
import sensationSweetyOilMilkyImg from '@/assets/products/sensation-sweety-oil-milky.jpg';
import spfCreamImg from '@/assets/products/spf-cream.jpg';
import tonerImg from '@/assets/products/toner.jpg';
import luminorRecoveryCreamImg from '@/assets/products/luminor-recovery-cream.jpg';
import sebokeyAcnEndImg from '@/assets/products/sebokey-acn-end.jpg';
import xaikonixSmoothMeImg from '@/assets/products/xaikonix-smooth-me.jpg';
import sebokeyMosquetasSoftCreamImg from '@/assets/products/sebokey-mosquetas-soft-cream.jpg';
import blackyCoffeeScrubImg from '@/assets/products/blacky-coffee-scrub.jpg';
import greenFaceScrubImg from '@/assets/products/green-face-scrub.jpg';
import guantoScrubImg from '@/assets/products/guanto-scrub.jpg';
import magicOilStickImg from '@/assets/products/magic-oil-stick.jpg';
import rigeneraBathSeaSaltImg from '@/assets/products/rigenera-bath-sea-salt.jpg';
import rigeneraElisirImg from '@/assets/products/rigenera-elisir.jpg';
import rigeneraEsosomiImg from '@/assets/products/rigenera-esosomi.jpg';
import sebokeyBlackEndImg from '@/assets/products/sebokey-black-end.jpg';
import sensationBoostSerumImg from '@/assets/products/sensation-boost-serum.jpg';
import sensationJjScrubbyImg from '@/assets/products/sensation-jj-scrubby.jpg';
import xaikonixHydraMeImg from '@/assets/products/xaikonix-hydra-me.jpg';
import xaikonixPerfectMeImg from '@/assets/products/xaikonix-perfect-me.jpg';
import xaikonixSerumMeImg from '@/assets/products/xaikonix-serum-me.jpg';
import creamImg from '@/assets/products/cream.jpg';

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: 'detersione' | 'tonico' | 'crema' | 'scrub' | 'trattamento' | 'maschera' | 'siero' | 'olio' | 'corpo';
  tags: string[];
  rating: number;
  link: string;
}

export const products: Product[] = [
  // ── DETERSIONE ──
  {
    id: '1',
    name: 'Detergente viso ultra delicato',
    brand: 'Rigenera 0.1',
    description: 'Detersione profonda ma gentile per tutti i tipi di pelle',
    price: 59.90,
    image: rigeneraDetersioneImg,
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
    id: '4',
    name: 'Flawless Mousse',
    brand: 'Face+ SeboKey',
    description: 'Mousse detergente per pelle mista e grassa',
    price: 34.90,
    image: sebokeyFlawlessMousseImg,
    category: 'detersione',
    tags: ['pelle grassa', 'pelle mista', 'sebo-regolatore'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/face-sebokey-flawless-mousse/'
  },
  {
    id: '9',
    name: 'Sweety Oil Milky',
    brand: 'Face+ Sensation',
    description: 'Latte detergente viso delicato',
    price: 36.90,
    image: sensationSweetyOilMilkyImg,
    category: 'detersione',
    tags: ['delicato', 'latte detergente', 'pelle secca'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/face-sensation-sweety-oil-milky/'
  },

  // ── TONICI ──
  {
    id: '3',
    name: 'Tonic.me',
    brand: 'Rigenera Xaikonix',
    description: 'Tonico esfoliante con AHA per pelle luminosa',
    price: 59.90,
    image: xaikonixTonicMeImg,
    category: 'tonico',
    tags: ['esfoliante', 'luminosità', 'anti-età', 'AHA'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/rigenera-xaikonix-tonic-me/'
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

  // ── CREME ──
  {
    id: '5',
    name: 'Hama Cream',
    brand: 'Face+ Sensation',
    description: 'Crema viso idratante intensiva con acido ialuronico',
    price: 56.90,
    image: sensationHamaCreamImg,
    category: 'crema',
    tags: ['idratante', 'nutriente', 'quotidiano', 'acido ialuronico'],
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
    id: '12',
    name: 'Luminor Recovery Cream',
    brand: 'Face+',
    description: 'Crema anti radicali per il recupero della pelle',
    price: 64.90,
    image: luminorRecoveryCreamImg,
    category: 'crema',
    tags: ['anti-radicali', 'recupero', 'rigenerante'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/face-luminor-recovery-cream/'
  },
  {
    id: '15',
    name: "Mosqueta's Soft Cream",
    brand: 'Face+ SeboKey',
    description: 'Crema delicata alla rosa mosqueta',
    price: 54.90,
    image: sebokeyMosquetasSoftCreamImg,
    category: 'crema',
    tags: ['nutriente', 'rosa mosqueta', 'pelle secca'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/face-sebokey-mosquetas-soft-cream/'
  },
  {
    id: '22',
    name: 'Hydra.me',
    brand: 'Rigenera Xaikonix',
    description: 'Crema idratante profonda per pelle disidratata',
    price: 79.90,
    image: xaikonixHydraMeImg,
    category: 'crema',
    tags: ['idratante', 'profonda', 'pelle secca', 'disidratata'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/rigenera-xaikonix-hydra-me/'
  },

  // ── SCRUB & ESFOLIANTI ──
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
    id: '14',
    name: 'Smooth.me Step1 e Step2',
    brand: 'Rigenera Xaikonix',
    description: 'Esfoliante peeling viso professionale in due step',
    price: 149.90,
    image: xaikonixSmoothMeImg,
    category: 'scrub',
    tags: ['peeling', 'professionale', 'rinnovamento'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/rigenera-xaikonix-smooth-me/'
  },
  {
    id: '16',
    name: 'Blacky Coffee Scrub',
    brand: 'Face+ Sensation',
    description: 'Scrub corpo energizzante al caffè nero',
    price: 29.90,
    image: blackyCoffeeScrubImg,
    category: 'scrub',
    tags: ['corpo', 'energizzante', 'caffè', 'esfoliante'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/face-sensation-blacky-coffee-scrub/'
  },
  {
    id: '17',
    name: 'Green Face Scrub',
    brand: 'Face+ Sensation',
    description: 'Scrub viso purificante con estratti vegetali',
    price: 32.90,
    image: greenFaceScrubImg,
    category: 'scrub',
    tags: ['purificante', 'vegetale', 'pelle mista'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/face-sensation-green-face-scrub/'
  },
  {
    id: '18',
    name: 'Guanto Scrub Esfoliante',
    brand: 'Rigenera',
    description: 'Guanto esfoliante corpo per una pelle liscia e morbida',
    price: 12.90,
    image: guantoScrubImg,
    category: 'scrub',
    tags: ['corpo', 'esfoliante', 'accessorio'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/rigenera-guanto-scrub/'
  },
  {
    id: '28',
    name: 'JJ Scrubby',
    brand: 'Face+ Sensation',
    description: 'Scrub viso delicato per pelle sensibile',
    price: 34.90,
    image: sensationJjScrubbyImg,
    category: 'scrub',
    tags: ['delicato', 'pelle sensibile', 'esfoliante'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/face-sensation-jj-scrubby/'
  },

  // ── MASCHERE ──
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

  // ── TRATTAMENTI ──
  {
    id: '13',
    name: 'Acn-End 10% Sulfur Suspension',
    brand: 'Face+ SeboKey',
    description: 'Trattamento mirato brufoli con zolfo al 10%',
    price: 39.90,
    image: sebokeyAcnEndImg,
    category: 'trattamento',
    tags: ['anti-brufoli', 'pelle grassa', 'trattamento mirato', 'zolfo'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/face-sebokey-acn-end-10-sulfur-suspension/'
  },
  {
    id: '23',
    name: 'Black End Purificante',
    brand: 'Face+ SeboKey',
    description: 'Trattamento purificante anti punti neri',
    price: 29.90,
    image: sebokeyBlackEndImg,
    category: 'trattamento',
    tags: ['purificante', 'punti neri', 'pelle grassa'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/face-sebokey-black-end/'
  },
  {
    id: '25',
    name: 'Perfect.me',
    brand: 'Rigenera Xaikonix',
    description: 'Trattamento perfezionante viso anti-imperfezioni',
    price: 89.90,
    image: xaikonixPerfectMeImg,
    category: 'trattamento',
    tags: ['perfezionante', 'anti-imperfezioni', 'professionale'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/rigenera-xaikonix-perfect-me/'
  },

  // ── SIERI ──
  {
    id: '24',
    name: 'Boost Serum',
    brand: 'Face+ Sensation',
    description: 'Siero concentrato booster di luminosità',
    price: 49.90,
    image: sensationBoostSerumImg,
    category: 'siero',
    tags: ['luminosità', 'concentrato', 'booster'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/face-sensation-boost-serum/'
  },
  {
    id: '26',
    name: 'Serum.me',
    brand: 'Rigenera Xaikonix',
    description: 'Siero viso anti-età con attivi concentrati',
    price: 99.90,
    image: xaikonixSerumMeImg,
    category: 'siero',
    tags: ['anti-età', 'concentrato', 'attivi'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/rigenera-xaikonix-serum-me/'
  },
  {
    id: '27',
    name: 'Elisir Rigenerante',
    brand: 'Rigenera',
    description: 'Elisir siero concentrato rigenerante per pelle matura',
    price: 79.90,
    image: rigeneraElisirImg,
    category: 'siero',
    tags: ['rigenerante', 'pelle matura', 'elisir', 'concentrato'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/rigenera-elisir/'
  },
  {
    id: '29',
    name: 'Esosomi Serum',
    brand: 'Rigenera',
    description: 'Siero innovativo con esosomi per rigenerazione cellulare',
    price: 119.90,
    image: rigeneraEsosomiImg,
    category: 'siero',
    tags: ['esosomi', 'rigenerazione cellulare', 'innovativo', 'anti-età'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/rigenera-esosomi/'
  },

  // ── OLI ──
  {
    id: '19',
    name: 'Magic Oil Stick Supersonic Hydra Serum',
    brand: 'Face+',
    description: 'Olio stick idratante formato pratico da portare ovunque',
    price: 24.90,
    image: magicOilStickImg,
    category: 'olio',
    tags: ['idratante', 'pratico', 'viaggio', 'stick'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/face-magic-oil-stick/'
  },

  // ── CORPO ──
  {
    id: '20',
    name: 'Bath Sea Salt',
    brand: 'Rigenera',
    description: 'Sali da bagno rilassanti e rigeneranti',
    price: 19.90,
    image: rigeneraBathSeaSaltImg,
    category: 'corpo',
    tags: ['rilassante', 'corpo', 'bagno', 'sali'],
    rating: 5,
    link: 'https://www.luxury-perfumes.net/prodotto/rigenera-bath-sea-salt/'
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
