import api from '../axios';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';

interface Pokemon {
  id: number;
  number: string;
  name: string;
  image: string;
}

interface PokemonDetails {
  number: string;
  name: string;
  image: string;
  types: string[];
  weight: number;
  height: number;
  moves: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
}

interface PokemonFlavorText {
  flavor_text_entries: {
    flavor_text: string;
    version: {
      name: string;
    };
  }[];
}

export const getPokedex = async (limit = 151): Promise<Pokemon[]> => {
  try {
    const response = await api.get(`/pokemon?limit=${limit}`);
    const { results } = response.data;
    const pokemonData: Pokemon[] = await Promise.all(
      results.map(async (pokemon: any) => {
        const pokemonResponse = await api.get(pokemon.url);
        const { id, name, sprites } = pokemonResponse.data;
        const pokemonImage = sprites.other['official-artwork'].front_default;
        const formattedName = capitalizeFirstLetter(name);
        return {
          id: id,
          number: id.toString().padStart(3, '0'),
          name: formattedName,
          image: pokemonImage,
        };
      })
    );
    return pokemonData;
  } catch (error) {
      console.error('Error fetching Pokémon:', error);
    throw error; 
  }
};

export const getPokemonDetails = async (id: string): Promise<PokemonDetails | null> => {
  try {
    const response = await api.get(`/pokemon/${id}`);
    const { name, types, weight, height, moves, sprites, stats } = response.data;
    const formattedMoves = moves
      .slice(0, 2)
      .map((move: any) => {
        return move.move.name.split('-').map(capitalizeFirstLetter).join(' ');
      });
    const formattedName = capitalizeFirstLetter(name);
    const formattedTypes = types.map((type: any) => capitalizeFirstLetter(type.type.name));
    const formattedHeight = height / 10;
    const pokemonImage = sprites.other['official-artwork'].front_default;
  
    return {
      number: id.toString().padStart(3, '0'),
      name: formattedName,
      types: formattedTypes,
      weight,
      height: formattedHeight,
      moves: formattedMoves,
      image: pokemonImage,
      stats: {
        hp: stats[0].base_stat,
        attack: stats[1].base_stat,
        defense: stats[2].base_stat,
        specialAttack: stats[3].base_stat,
        specialDefense: stats[4].base_stat,
        speed: stats[5].base_stat,
      },
    };
  } catch (error) {
      console.error('Error fetching Pokémon details:', error);
    throw error;
  }
};

export const getPokemonFlavorText = async (id: string): Promise<string> => {
  try {
    const response = await api.get(`/pokemon-species/${id}`);
    const PokemonFlavorText: PokemonFlavorText = response.data;
    const fireRedFlavorText = PokemonFlavorText.flavor_text_entries.find(
      (entry: any) => entry.version.name === 'firered'
    );
    return fireRedFlavorText ? fireRedFlavorText.flavor_text : '';
  } catch (error) {
      console.error('Error fetching Pokémon species:', error);
    throw error;
  }
};
