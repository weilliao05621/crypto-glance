// component
import { Button, Box, Flex, useColorMode, Container } from "@chakra-ui/react";
import { SunIcon } from "@chakra-ui/icons";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = (props: LayoutProps) => {
  const { toggleColorMode, colorMode } = useColorMode();

  const modeName =
    colorMode[0].toUpperCase() + colorMode.slice(1, colorMode.length);

  return (
    <Box
      bg="blackAlpha.50"
      h={{ base: "100%", lg: "100vh" }}
      w="100vw"
      overflowY="scroll"
      display={{ base: "block", lg: "flex" }}
      flexDirection="column"
      paddingY={{ base: 10, lg: 0 }}
      justifyContent="center"
      alignContent="center"
    >
      <LayoutContainer>
        <Flex justifyContent="end" marginBottom={4}>
          <Button onClick={toggleColorMode} minW="120px">
            <SunIcon marginRight={1} />
            {modeName}
          </Button>
        </Flex>
        {props.children}
      </LayoutContainer>
    </Box>
  );
};

const LayoutContainer = (props: { children: React.ReactNode }) => (
  <Container maxW="container.xl" w="100%" display="flex" flexDirection="column">
    {props.children}
  </Container>
);

export default Layout;
