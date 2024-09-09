import { useColorMode, useTheme as useChakraTheme } from "@chakra-ui/react";

const useCustomTheme = () => {
  const { colorMode } = useColorMode();
  const theme = useChakraTheme();
  return theme[colorMode];
};

export default useCustomTheme;
