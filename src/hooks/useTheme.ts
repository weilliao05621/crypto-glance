import { useColorMode, useTheme as useChakraTheme } from "@chakra-ui/react";

const useTheme = () => {
  const { colorMode } = useColorMode();
  const theme = useChakraTheme();
  return theme[colorMode];
};

export default useTheme;
