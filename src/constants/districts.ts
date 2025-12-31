export const DISTRICTS = [
  'Kasaragod',
  'Kannur',
  'Wayanad',
  'Kozhikode',
  'Malappuram',
  'Palakkad'
] as const;

export type District = typeof DISTRICTS[number];

export const LACS_BY_DISTRICT: Record<District, string[]> = {
  'Kasaragod': [
    'Manjeshwar (LAC No. 1)',
    'Kasaragod (LAC No. 2)',
    'Udma (LAC No. 3)',
    'Kanhangad (LAC No. 4)',
    'Thrikaripur (LAC No. 5)'
  ],
  'Kannur': [
    'Payyannur (LAC No. 6)',
    'Kalliasseri (LAC No. 7)',
    'Taliparamba (LAC No. 8)',
    'Irikkur (LAC No. 9)',
    'Azhikode (LAC No. 10)',
    'Kannur (LAC No. 11)',
    'Dharmadam (LAC No. 12)',
    'Thalassery (LAC No. 13)',
    'Kuthuparamba (LAC No. 14)',
    'Mattannur (LAC No. 15)',
    'Peravoor (LAC No. 16)'
  ],
  'Wayanad': [
    'Mananthavady (ST) (LAC No. 17)',
    'Sulthan Bathery (ST) (LAC No. 18)',
    'Kalpetta (LAC No. 19)'
  ],
  'Kozhikode': [
    'Vadakara (LAC No. 20)',
    'Kuttiadi (LAC No. 21)',
    'Nadapuram (LAC No. 22)',
    'Quilandy (LAC No. 23)',
    'Perambra (LAC No. 24)',
    'Balussery (SC) (LAC No. 25)',
    'Elathur (LAC No. 26)',
    'Kozhikode North (LAC No. 27)',
    'Kozhikode South (LAC No. 28)',
    'Beypore (LAC No. 29)',
    'Kunnamangalam (LAC No. 30)',
    'Koduvally (LAC No. 31)',
    'Thiruvambady (LAC No. 32)'
  ],
  'Malappuram': [
    'Kondotty (LAC No. 33)',
    'Eranad (LAC No. 34)',
    'Nilambur (LAC No. 35)',
    'Wandoor (SC) (LAC No. 36)',
    'Manjeri (LAC No. 37)',
    'Perinthalmanna (LAC No. 38)',
    'Mankada (LAC No. 39)',
    'Malappuram (LAC No. 40)',
    'Vengara (LAC No. 41)',
    'Vallikkunnu (LAC No. 42)',
    'Tirurangadi (LAC No. 43)',
    'Tanur (LAC No. 44)',
    'Tirur (LAC No. 45)',
    'Kottakkal (LAC No. 46)',
    'Thavanur (LAC No. 47)',
    'Ponnani (LAC No. 48)'
  ],
  'Palakkad': [
    'Thrithala (LAC No. 49)',
    'Pattambi (LAC No. 50)',
    'Shornur (LAC No. 51)',
    'Ottapalam (LAC No. 52)',
    'Kongad (SC) (LAC No. 53)',
    'Mannarkkad (LAC No. 54)',
    'Malampuzha (LAC No. 55)',
    'Palakkad (LAC No. 56)',
    'Tarur (SC) (LAC No. 57)',
    'Chittur (LAC No. 58)',
    'Nenmara (LAC No. 59)',
    'Alathur (LAC No. 60)'
  ]
};
