import { Box, Heading, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import pokeballSVG from '../../assets/images/pokeball.svg';

function Header() {
  return (
    <Box bg="red.500" w="100%" p={4} color="white" display="flex" alignItems="center" justifyContent="left" h="10vh">
      <Link to="/">
        <Box display="flex">
            <Image src={pokeballSVG} alt="Pokeball" boxSize="40px" mr={4} />
            <Heading>Pokédex</Heading>
        </Box>
      </Link>
    </Box>
  );
};

export default Header;
