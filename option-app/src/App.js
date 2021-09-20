import React from 'react';
import { 
  Stack,
  Skeleton,
  Container,
  Box,
  Heading,
} from '@chakra-ui/react';

import useStorage from './useStorage';
import OptionsForm from './OptionsForm';

function App() {
  const { data, loading } = useStorage('rules');
  if (loading) {
    return (
      <Container maxW="container.xl">
        <Box p={4}>
          <Heading as="h1" size="lg">
            설정
          </Heading>
          <Stack pt={8}>
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
          </Stack>
        </Box>
      </Container>
    );
  }

  return <OptionsForm rules={data} />
}

export default App;
