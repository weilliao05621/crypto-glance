import { type ReactNode } from "react";

// components
import { Box, Card as CardUI } from "@chakra-ui/react";
import { Description, Title } from "./Heading";

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

const Card = (props: CardProps) => {
  return (
    <CardUI w="100%" p={6}>
      {props.title && <Title>{props.title}</Title>}
      {props.subtitle && <Description>{props.subtitle}</Description>}
      <Box h={6} />
      {props.children}
    </CardUI>
  );
};

export default Card;
