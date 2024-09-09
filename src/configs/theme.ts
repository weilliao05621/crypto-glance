import { extendTheme } from "@chakra-ui/react";

const light = {
  colors: {
    text: {
      title: "#09090b",
      description: "#6e6e77",
    },
    card: {
      background: "#fafafa",
    },
  },
};

const dark = {
  colors: {
    text: {
      title: "#fafafa",
      description: "#a3a3a3",
    },
    card: {
      background: "#18181b",
    },
  },
};

const theme = extendTheme({
  light,
  dark,
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

export default theme;
