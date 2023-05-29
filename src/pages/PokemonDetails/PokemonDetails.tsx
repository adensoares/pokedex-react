import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Text,
  Image,
  CircularProgress,
  VStack,
  Flex,
  Heading,
  Progress,
  Wrap,
  Button,
  IconButton,
  Link,
  Badge,
  Grid,
  useBreakpointValue,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import Pokeball from '../../components/Pokeball/Pokeball';
import { getPokemonDetails, getPokemonFlavorText } from '../../api';
import { getColorByType } from '../../utils';

interface PokemonDetails {
  number: string;
  name: string;
  image: string;
  types: string[];
  weight: number;
  height: number;
  moves: string[];
  flavorText: string;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
}

function PokemonDetails() {
  const { id } = useParams<{ id: string }>();
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const details = await getPokemonDetails(id ?? '');
        const flavorText = await getPokemonFlavorText(id ?? '');
  
        if (details && flavorText) {
          setPokemonDetails({ ...details, flavorText });
        } else {
          setError(true);
        }
      } catch (error) {
        console.error('Error fetching Pokémon details:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [id]);
  

  function nextPokemon() {
    const nextId = Number(id) + 1;
    navigate(`/pokemon/${nextId}`);
  }

  function prevPokemon() {
    const prevId = Number(id) - 1;
    if (prevId > 0) {
      navigate(`/pokemon/${prevId}`);
    }
  }

  return (
    <Container maxW="container.xl" py={8}>
      {loading ? (
        <Flex justifyContent="center" alignItems="center" h="70vh">
          <CircularProgress isIndeterminate color="red.500" />
        </Flex>
      ) : error ? (
        <Flex justifyContent="center" alignItems="center" h="70vh">
          <Text color="red.500">Oops, something went wrong while loading Pokémon details.</Text>
        </Flex>
      ) : (

        <Box>
          <Flex justify={{ base: Number(id) <= 1 ? 'right' : 'space-between', md: Number(id) <= 1 ? 'right' : 'space-between' }}>
              <IconButton
                aria-label="Previous"
                icon={<ChevronLeftIcon />}
                onClick={prevPokemon}
                display={Number(id) <= 1 ? 'none' : 'inline-flex'}
                size="lg" />
                
              <IconButton
                aria-label="Next"
                icon={<ChevronRightIcon />}
                onClick={nextPokemon}
                size="lg" />
            </Flex>
            
            <Flex direction={{ base: 'column', md: 'row' }} alignItems="center" justify="space-between" h={{ base: "auto", md: "65vh" }}>
                
                <Box flex={{ base: "1", md: "0 0 30%" }} textAlign={{ base: "center", md: "left" }}>
                  <Text fontSize="sm">
                    #{pokemonDetails?.number}
                  </Text>
                  <Heading fontWeight="bold" mt={2}>
                    {pokemonDetails?.name}
                  </Heading>
                  <Text mt={2}>
                    {pokemonDetails?.flavorText}
                  </Text>
                </Box>

                <Box flex={{ base: "1", md: "0 0 30%" }} textAlign={{ base: "center", md: "left" }}>
                  <Pokeball
                    fill={pokemonDetails?.types[0] ? getColorByType(pokemonDetails?.types[0].toLowerCase()) : ''}
                    style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: '200px', opacity: '0.3' }}
                  />
                  <Image src={pokemonDetails?.image} alt={pokemonDetails?.name} zIndex="2" position="relative" />
                </Box>

                <Box flex={{ base: "1", md: "0 0 30%" }} textAlign={{ base: "center", md: "left" }}>

                  {/* Types */}
                  <Wrap justify={{ base: "center", md: "flex-start" }}>
                    {pokemonDetails?.types.map((type) => (
                      <Badge variant="solid" rounded="xl" px={4} py={1} bg={getColorByType(type)} key={type}>
                        {type}
                      </Badge>
                    ))}
                  </Wrap>

                  {/* Weight and Height */}
                  <Flex justify={{ base: "center", md: "start" }} mt={4}>
                    <Box mr={4}>
                      <Text>
                        <strong>WEIGHT</strong>
                      </Text>
                      <Text>
                        {pokemonDetails?.weight} kg
                      </Text>
                    </Box>

                    <Box>
                      <Text>
                        <strong>HEIGHT</strong>
                      </Text>
                      <Text>
                        {pokemonDetails?.height} m
                      </Text>
                    </Box>
                  </Flex>

                  {/* Moves */}
                  <Text mt={4}>
                    <strong>MOVES</strong>
                  </Text>
                  <Text>
                    {pokemonDetails?.moves.join(', ')}
                  </Text>

                  {/* Stats */}
                  <Box>
                    <Text mt={2}>
                      <strong>HP:</strong> {pokemonDetails?.stats.hp}
                    </Text>
                    <Progress rounded="lg" colorScheme="red" size="sm" value={pokemonDetails?.stats.hp} max={255} />

                    <Text mt={2}>
                      <strong>ATK:</strong> {pokemonDetails?.stats.attack}
                    </Text>
                    <Progress rounded="lg" colorScheme="orange" size="sm" value={pokemonDetails?.stats.attack} max={255} />

                    <Text mt={2}>
                      <strong>DEF:</strong> {pokemonDetails?.stats.defense}
                    </Text>
                    <Progress rounded="lg" colorScheme="yellow" size="sm" value={pokemonDetails?.stats.defense} max={255} />

                    <Text mt={2}>
                      <strong>SATK:</strong> {pokemonDetails?.stats.specialAttack}
                    </Text>
                    <Progress rounded="lg" colorScheme="blue" size="sm" value={pokemonDetails?.stats.specialAttack} max={255} />

                    <Text mt={2}>
                      <strong>SDEF:</strong> {pokemonDetails?.stats.specialDefense}
                    </Text>
                    <Progress rounded="lg" colorScheme="green" size="sm" value={pokemonDetails?.stats.specialDefense} max={255} />

                    <Text mt={2}>
                      <strong>SPD:</strong> {pokemonDetails?.stats.speed}
                    </Text>
                    <Progress rounded="lg" colorScheme="pink" size="sm" value={pokemonDetails?.stats.speed} max={255} />
                  </Box>
                </Box>
              </Flex>
            </Box>
      )}
    </Container>
  );
}

export default PokemonDetails;
