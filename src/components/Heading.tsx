import { type ReactNode } from "react";

import { Text } from "@chakra-ui/react";

// hooks
import useCustomTheme from "~/hooks/useCustomTheme";

interface TextProps {
  children: ReactNode;
}

const Title = (props: TextProps) => {
  const color = useCustomTheme().colors.text.title;

  return (
    <Text fontSize="2xl" color={color} fontWeight={600}>
      {props.children}
    </Text>
  );
};

const Description = (props: TextProps) => {
  const color = useCustomTheme().colors.text.description;
  return (
    <Text fontSize="sm" color={color}>
      {props.children}
    </Text>
  );
};

export { Title, Description };
