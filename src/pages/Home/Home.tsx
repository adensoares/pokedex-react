import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Input, Text, Wrap, WrapItem, Heading, InputGroup, InputLeftElement, CircularProgress, Flex } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import Card from '../../components/Card/Card';
import { getPokedex } from '../../api';

interface Pokemon {
  id: number;
  number: string;
  name: string;
  image: string;
}

function Home() {
  const [pokedex, setPokedex] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const fetchPokedex = async () => {
      try {
        const pokemonData = await getPokedex();
        setPokedex(pokemonData);
        setFilteredPokemon(pokemonData);
      } catch (error) {
        setError('Error fetching Pokémon');
        console.error('Error fetching Pokémon:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokedex();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
  
    const filtered = pokedex.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pokemon.number.includes(searchTerm)
    );
  
    setFilteredPokemon(filtered);
  };
  

  return (
    <Container maxW="100%">
      <Box p={8} textAlign="center">
        <Text mt={4}>
          Search for a Pokémon by name or using its National Pokédex number.
        </Text>
        <Flex justifyContent="center" alignItems="center" mt={4}>
          <InputGroup maxW="xl">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
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
        <Flex justifyContent="center" alignItems="center" h="60vh">
          <CircularProgress isIndeterminate color="red.500" />
        </Flex>
      ) : error ? (
        <Flex justifyContent="center" alignItems="center" h="60vh">
          <Text color="red.500">{error}</Text>
        </Flex>
      ) : (
        <Flex justifyContent="center" alignItems="center" mt={4}>
          <Wrap
            justify="center"
            align="center"
            spacing={4}
            my={8}
            flexWrap="wrap"
            maxW={'container.xl'}
          >
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
}

export default Home;
