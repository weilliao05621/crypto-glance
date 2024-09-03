import { Container, Grid, GridItem } from "@chakra-ui/react";

// components
import Card from "~/components/Card";
import Layout from "~/components/Layout";

const Home = () => {
  return (
    <Layout>
      <Container maxW="container.lg" w="100%" padding={6}>
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem colSpan={2}>
            <Card title="Hello" subtitle="World">
              Hello World
            </Card>
          </GridItem>
          <GridItem colSpan={{ base: 2, md: 1 }}>
            {" "}
            <Card title="Hello" subtitle="World">
              Hello World
            </Card>
          </GridItem>
          <GridItem colSpan={{ base: 2, md: 1 }}>
            {" "}
            <Card title="Hello" subtitle="World">
              Hello World
            </Card>
          </GridItem>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Home;
