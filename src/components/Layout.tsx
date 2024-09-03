import { type ReactNode } from "react";

import { Center } from "@chakra-ui/react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = (props: LayoutProps) => {
  return (
    <Center bg="blackAlpha.50" h="100vh" w="100vw">
      {props.children}
    </Center>
  );
};

export default Layout;
