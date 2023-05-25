import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Input, Text, Wrap, WrapItem, Heading, InputGroup, InputLeftElement, CircularProgress, Flex  } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons'
import axios from 'axios';
import Card from '../../components/Card/Card';

interface Pokemon {
  id: number;
  number: string;
  name: string;
  image: string;
}

const Home: React.FC = () => {
  const [pokedex, setPokedex] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokedex = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
        const { results } = response.data;
        const pokemonData: Pokemon[] = await Promise.all(
          results.map(async (pokemon: any) => {
            const pokemonResponse = await axios.get(pokemon.url);
            const { id, name, sprites } = pokemonResponse.data;
            const pokemonImage = sprites.other['official-artwork'].front_default;
            const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
            return {
              id: id,
              number: id.toString().padStart(3, '0'),
              name: formattedName,
              image: pokemonImage,
            };
          })
        );
        setPokedex(pokemonData);
        setFilteredPokemon(pokemonData);
      } catch (error) {
        console.error('Error fetching Pokémon:', error);
      }
        finally {
        setLoading(false);
      }
    };

    fetchPokedex();
  }, []);

  function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);

    // Verificar se o valor digitado é um número
    const searchTermIsNumber = /^\d+$/.test(searchTerm);

    if (searchTermIsNumber) {
      // Realizar pesquisa pelo número do Pokémon
      const filteredByNumber = pokedex.filter((pokemon) =>
        pokemon.number.includes(searchTerm)
      );
      setFilteredPokemon(filteredByNumber);
    } else {
      // Realizar pesquisa pelo nome do Pokémon
      const filteredByName = pokedex.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPokemon(filteredByName);
    }
  };

  return (
    <Container maxW="100%">
      <Box p={8} textAlign="center" >
        <Text mt={4}>
          Search for a Pokémon by name or using its National Pokédex number.
        </Text>
        <Flex justifyContent="center" alignItems="center" mt={4}>
          <InputGroup maxW="xl">
            <InputLeftElement pointerEvents='none'>
              <SearchIcon color='gray.300' />
            </InputLeftElement>
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
              bg="white"
            />
          </InputGroup>
        </Flex>
      </Box>
      {loading ? (
      <Flex justifyContent="center" alignItems="center" h="100vh">
        <CircularProgress isIndeterminate color="red.500" />
      </Flex>
    ) : (
      <Flex justifyContent="center" alignItems="center" mt={4}>
        <Wrap justify="center" align="center" spacing={4} my={8}  flexWrap="wrap" maxW={'container.xl'}>
          {filteredPokemon.map((pokemon) => (
            <WrapItem key={pokemon.number}>
              <Link to={`/pokemon/${pokemon.id}`}>
                <Card number={pokemon.number} name={pokemon.name} image={pokemon.image} />
              </Link>
            </WrapItem>
          ))}
        </Wrap>
      </Flex>
      )}
    </Container>
  );
};

export default Home;
