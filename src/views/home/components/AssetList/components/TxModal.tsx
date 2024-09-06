import { memo, useRef, useState } from "react";

import {
  Flex,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalHeader,
  Input,
  Stack,
  FormControl,
  FormLabel,
  Box,
  Button,
  Text,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

// types
import type { SelectedToken } from "../types";
import type useSendTx from "../hooks/useSendTx";

interface TxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  selectedToken: SelectedToken;
  sendTxHandler: ReturnType<typeof useSendTx>;
}

const TxModal = (props: TxModalProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const receiverInputRef = useRef<HTMLInputElement | null>(null);
  const amountInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent padding={4}>
        <ModalHeader>
          <Flex justifyContent="space-between" alignItems="center">
            <span>Send {props.selectedToken.token}</span>
            <span onClick={props.onClose}>
              <CloseIcon fontSize="12px" cursor="pointer" />
            </span>
          </Flex>
        </ModalHeader>
        <ModalBody marginBottom={4}>
          <FormControl>
            <Stack>
              <Box>
                <FormLabel fontSize="14px">
                  The address you will send to
                </FormLabel>
                <Input
                  ref={receiverInputRef}
                  disabled={isLoading}
                  type="text"
                  placeholder="Receiver"
                />
              </Box>
              <Box>
                <FormLabel fontSize="14px">
                  The decimals is {props.selectedToken.decimals}
                </FormLabel>
                <Input
                  ref={amountInputRef}
                  disabled={isLoading}
                  type="number"
                  placeholder={`Amount (in ether)`}
                />
              </Box>
              <Box>
                <Text
                  opacity={errorMsg ? "100%" : "0"}
                  fontSize="12px"
                  color="red"
                >
                  {errorMsg}
                </Text>
              </Box>
            </Stack>
          </FormControl>
        </ModalBody>
        <Flex justifyContent="center" paddingX={6} marginBottom={4}>
          <Button
            isLoading={isLoading}
            loadingText="Submitting"
            flex={1}
            onClick={async () => {
              const to = receiverInputRef.current?.value ?? "";
              const amount = amountInputRef.current?.value ?? "";

              setIsLoading(true);
              const errorMsg = await props.sendTxHandler(to, amount);
              if (errorMsg) {
                setErrorMsg(errorMsg);
              }
              setIsLoading(false);
            }}
          >
            Confirm
          </Button>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

const MemoTxModal = memo(TxModal);

export default MemoTxModal;
