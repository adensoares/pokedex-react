import React from 'react';
import { Box, Image, Text } from '@chakra-ui/react';

interface CardProps {
  number: string;
  name: string;
  image: string;
}

const Card: React.FC<CardProps> = ({ number, name, image }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      p={4}
      textAlign="center"
      cursor="pointer"
      boxShadow="lg"
    >
      <Text fontSize="lg" mb={2} textAlign={'right'}>
        #{number}
      </Text>
      <Image src={image} alt={name} boxSize="200px" mx="auto" mb={2} />
      <Text >{name}</Text>
    </Box>
  );
};

export default Card;
