export interface Country {
  code: string;
  name: string;
  cities: string[];
}

export const countries: Country[] = [
  {
    code: 'world',
    name: 'World',
    cities: []
  },
  {
    code: 'us',
    name: 'United States',
    cities: ['All', 'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose']
  },
  {
    code: 'gb',
    name: 'United Kingdom',
    cities: ['All', 'London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Sheffield', 'Bradford', 'Liverpool', 'Edinburgh', 'Bristol']
  },
  {
    code: 'se',
    name: 'Sweden',
    cities: ['All', 'Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro', 'Linköping', 'Helsingborg', 'Jönköping', 'Norrköping']
  },
  {
    code: 'de',
    name: 'Germany',
    cities: ['All', 'Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig']
  },
  {
    code: 'fr',
    name: 'France',
    cities: ['All', 'Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille']
  },
  {
    code: 'ca',
    name: 'Canada',
    cities: ['All', 'Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener']
  },
  {
    code: 'au',
    name: 'Australia',
    cities: ['All', 'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle', 'Canberra', 'Sunshine Coast', 'Wollongong']
  }
]; 