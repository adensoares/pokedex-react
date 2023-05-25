import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Container, Text, Image, CircularProgress, VStack, HStack, Flex, Heading, Progress, Wrap, Button, IconButton, Link, Badge } from '@chakra-ui/react';
import { ArrowBackIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { types } from 'util';
import Pokeball from '../../components/Pokeball/Pokeball';


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

const PokemonDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        setLoading(true);
        setError(false);
        let flavorText = "";
        if (id) {
          const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
          const { name, types, weight, height, moves, sprites, stats } = response.data;
          const formattedMoves = moves
          .slice(0, 2)
          .map((move: any) => 
            move.move.name
              .split('-')
              .map((word: string) => capitalizeFirstLetter(word))
              .join(' ')
          );
          const formattedName = capitalizeFirstLetter(name);
          const formattedTypes = types.map((type: any) => capitalizeFirstLetter(type.type.name));
          const formattedHeight = height / 10;
          const pokemonImage = sprites.other['official-artwork'].front_default;
          const responseSpecies = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
          const speciesData = responseSpecies.data.flavor_text_entries;
          const fireRedFlavorText = speciesData.find((entry: any) => entry.version.name === 'firered');
          if (fireRedFlavorText) {
            flavorText = fireRedFlavorText.flavor_text;
          }
  
          setPokemonDetails({
            name: formattedName,
            types: formattedTypes,
            weight,
            height: formattedHeight,
            moves: formattedMoves,
            image: pokemonImage,
            number: id.toString().padStart(3, '0'),
            stats: {
              hp: stats[0].base_stat,
              attack: stats[1].base_stat,
              defense: stats[2].base_stat,
              specialAttack: stats[3].base_stat,
              specialDefense: stats[4].base_stat,
              speed: stats[5].base_stat,
            },
            flavorText,
          });
        }
      } catch (error) {
        console.error('Error fetching Pokémon details:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPokemonDetails();
  }, [id]);

  if (loading) {
    return (
      <VStack>
        <Flex justifyContent="center" alignItems="center" h="80vh">
          <CircularProgress isIndeterminate color="red.500" />
        </Flex>
      </VStack>
    );
  }

  if (error) {
    return (
      <Box p={4} textAlign="center">
        <Text>Oops, algo deu errado ao carregar os detalhes do Pokémon.</Text>
      </Box>
    );
  }
  

  if (!pokemonDetails) {
    return null;
  }

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

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

  function getColorScheme(type: string) {
    switch (type) {
      case 'normal':
        return '#A8A77A';
      case 'fire':
        return '#EE8130';
      case 'water':
        return '#6390F0';
      case 'electric':
        return '#F7D02C';
      case 'grass':
        return '#7AC74C';
      case 'ice':
        return '#96D9D6';
      case 'fighting':
        return '#C22E28';
      case 'poison':
        return '#A33EA1';
      case 'ground':
        return '#E2BF65';
      case 'flying':
        return '#A98FF3';
      case 'psychic':
        return '#F95587';
      case 'bug':
        return '#A6B91A';
      case 'rock':
        return '#B6A136';
      case 'ghost':
        return '#735797';
      case 'dragon':
        return '#6F35FC';
      case 'dark':
        return '#705746';
      case 'steel':
        return '#B7B7CE';
      case 'fairy':
        return '#D685AD';
      default:
        return '#A8A77A';
    }
  }
  
  return (
    <Container maxW="100%" >

        <Flex justifyContent="center" alignItems="center" h="80vh" >
        <IconButton
          mr={16}
          aria-label="Previous"
          icon={<ChevronLeftIcon />}
          onClick={prevPokemon}
          display={Number(id) <= 1 ? "none" : "inline-flex"}
          size="lg"
        />
          <Box maxW="20%" >
            <Text fontSize="sm">
              #{pokemonDetails.number}
            </Text>
            <Heading fontWeight="bold" mt={2}>
              {pokemonDetails.name}
            </Heading>
            <Text mt={2}>
              {pokemonDetails.flavorText}
            </Text>
          </Box>
  
          <Box maxW="60%" px={24} position="relative">
            <Pokeball fill={getColorScheme(pokemonDetails.types[0].toLowerCase())} style={{ position: 'absolute', left: '0', width: '50%', opacity: '0.3' }} />
            <Image src={pokemonDetails.image} alt={pokemonDetails.name} zIndex="2" position="relative" />
          </Box>


          <Box maxW="10%" minW="10%">
            <Text>
              <strong>TYPE</strong>
            </Text>
            <Wrap>
              {pokemonDetails.types.map((type) => (
                <Badge variant="solid" rounded="xl" px={4} py={1} bg={getColorScheme(type.toLowerCase())} key={type}>
                  {type}
                </Badge>
              ))}
            </Wrap>

            
            <Text mt={4}>
              <strong>WEIGH</strong>
            </Text>
            <Text>
              {pokemonDetails.weight} kg
            </Text>

            <Text mt={4}>
              <strong>HEIGHT</strong>
            </Text>
            <Text>
              {pokemonDetails.height} m
            </Text>

            <Text mt={4}>
              <strong>MOVES</strong>
            </Text>
            <Text>
              {pokemonDetails.moves.join(', ')}
            </Text>
  
            <Box>
              <Text mt={2}>
                <strong>HP:</strong> {pokemonDetails.stats.hp}
              </Text>
              <Progress rounded="lg" colorScheme="red" size='sm' value={pokemonDetails.stats.hp} max={255} />

              <Text mt={2}>
                <strong>ATK:</strong> {pokemonDetails.stats.attack}
              </Text>
              <Progress rounded="lg" colorScheme="orange" size='sm' value={pokemonDetails.stats.attack} max={255} />

              <Text mt={2}>
                <strong>DEF:</strong> {pokemonDetails.stats.defense}
              </Text>
              <Progress rounded="lg" colorScheme="yellow" size='sm' value={pokemonDetails.stats.defense} max={255} />

              <Text mt={2}>
                <strong>SATK:</strong> {pokemonDetails.stats.specialAttack}
              </Text>
              <Progress rounded="lg" colorScheme="blue" size='sm' value={pokemonDetails.stats.specialAttack} max={255} />

              <Text mt={2}>
                <strong>SDEF:</strong> {pokemonDetails.stats.specialDefense}
              </Text>
              <Progress rounded="lg" colorScheme="green" size='sm' value={pokemonDetails.stats.specialDefense} max={255} />

              <Text mt={2}>
                <strong>SPD:</strong> {pokemonDetails.stats.speed}
              </Text>
              <Progress rounded="lg" colorScheme="pink" size='sm' value={pokemonDetails.stats.speed} max={255} />
            </Box>

          </Box>

          <IconButton
          ml={16}
          aria-label="Next"
          icon={<ChevronRightIcon />}
          onClick={nextPokemon}
          size="lg"
        />
        
        </Flex>
    </Container>
  );
  
        };

        export default PokemonDetails;
