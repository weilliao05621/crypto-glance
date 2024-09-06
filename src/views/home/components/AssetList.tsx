import { useEffect, useMemo, useRef, useState } from "react";

import { formatEther, Hash, isAddress, parseEther, type Address } from "viem";
import {
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

import { IERC20_ABI } from "@bgd-labs/aave-address-book";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  useTheme,
  useBreakpointValue,
  useDisclosure,
  Modal,
  Button,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalHeader,
  Input,
  Stack,
  FormControl,
  FormLabel,
  Box,
  useToast,
} from "@chakra-ui/react";
import { ArrowForwardIcon, CloseIcon } from "@chakra-ui/icons";

// stores
import { useAssetsStore } from "~/stores";

// hooks
import useChainId from "~/hooks/wagmi/useChainId";

// constants
import { TOKEN, TOKEN_MAP, type ValidToken } from "~/constants/tokens";

const TOKEN_LIST = Object.values(TOKEN);

const TABLE_HEAD = [
  {
    title: "Asset",
    key: "asset",
    isNumeric: false,
  },
  {
    title: "Amount",
    key: "amount",
    isNumeric: true,
  },
  {
    title: "Value",
    key: "value",
    isNumeric: true,
  },
  {
    title: null,
    key: "action",
    isNumeric: false,
  },
];

type SentTx = {
  hash: Hash;
  value: string;
  token: ValidToken;
};

const AssetList = () => {
  const chainId = useChainId();

  const { onOpen, isOpen, onClose } = useDisclosure();
  const [activeToken, setActiveToken] = useState<{
    token: ValidToken;
    decimals: number;
    address?: Address;
  } | null>(null);

  const [receiver, setReceiver] = useState<string | null>(null);
  const [amount, setAmount] = useState<string | null>(null);

  const { isLoading, toast } = useSendTxToast();
  const [tx, setTx] = useState<SentTx | null>(null);

  const hasSendingTx = !!tx;

  const { data: txReceipt } = useWaitForTransactionReceipt({
    hash: tx?.hash,
    query: {
      enabled: hasSendingTx,
    },
    pollingInterval: hasSendingTx ? 5_000 : undefined,
  });

  const iconFill = useTheme().colors.gray[500];
  const iconSize = useBreakpointValue(
    {
      base: 16,
      md: 24,
    },
    {
      fallback: "base",
    },
  );

  useEffect(() => {
    const token = activeToken?.token;

    if (!token) return;

    const hasPendingTx = tx?.value || tx?.token;
    if (!hasPendingTx) return;

    if (!txReceipt?.transactionHash) return;

    const type = txReceipt?.type ? ` (${txReceipt?.type.toUpperCase()})` : "";
    const hash = txReceipt?.transactionHash;
    const to = txReceipt?.to;
    const amount = tx?.value;

    onClose();
    toast.success({
      title: `Complete transaction!${type}`,
      description: `Check the tx hash at ${hash}. Sent ${amount} ${token} to ${to}$`,
      isClosable: true,
      duration: 5_000,
    });
    setTx(null);
    setActiveToken(null);
  }, [
    txReceipt?.type,
    txReceipt?.transactionHash,
    tx?.value,
    tx?.token,
    txReceipt?.to,
    toast.success,
    toast,
    onClose,
    activeToken?.token,
  ]);

  if (!chainId) return null;

  const availableTokens = TOKEN_MAP[chainId];

  return (
    <>
      <TableContainer overflowY="scroll" maxH="240px">
        <Table variant="simple">
          <Thead>
            <Tr>
              {TABLE_HEAD.map((head) => (
                <Th key={head.key} isNumeric={head.isNumeric}>
                  {head.title}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {TOKEN_LIST.map((token) => {
              if (!availableTokens[token]) return null;

              const TokenIcon = availableTokens[token].icon;
              return (
                <Tr key={token}>
                  <Td>
                    <Flex alignItems="center" gap={2}>
                      <TokenIcon
                        fill={iconFill}
                        width={iconSize}
                        height={iconSize}
                      />
                      <span>{availableTokens[token].name}</span>
                    </Flex>
                  </Td>
                  <Td isNumeric>
                    <AssetAmount token={token} />
                  </Td>
                  <Td isNumeric>
                    <AssetValue token={token} />
                  </Td>
                  <Td>
                    <span
                      onClick={() => {
                        onOpen();
                        setActiveToken({
                          token,
                          decimals: availableTokens[token].decimals,
                          address: availableTokens[token].address,
                        });
                      }}
                    >
                      <ArrowForwardIcon
                        style={{ transform: "rotate(-45deg)" }}
                      />
                    </span>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      {activeToken && (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
          <ModalOverlay />
          <ModalContent padding={4}>
            <ModalHeader>
              <Flex justifyContent="space-between" alignItems="center">
                <span>Send {activeToken.token}</span>
                <span onClick={onClose}>
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
                      disabled={isLoading}
                      type="text"
                      placeholder="Receiver"
                      onChange={(e) => {
                        setReceiver(e.target.value);
                      }}
                    />
                  </Box>
                  <Box>
                    <FormLabel fontSize="14px">
                      The decimals is {activeToken.decimals}
                    </FormLabel>
                    <Input
                      disabled={isLoading}
                      type="number"
                      placeholder={`Amount (in ether)`}
                      onChange={(e) => {
                        setAmount(e.target.value);
                      }}
                    />
                  </Box>
                </Stack>
              </FormControl>
            </ModalBody>
            <Flex justifyContent="center" paddingX={6} marginBottom={4}>
              <ConfirmTxButton
                token={activeToken.token}
                tokenAddress={activeToken.address}
                receiver={receiver}
                amount={amount}
                setTx={setTx}
                toast={toast}
                isLoading={isLoading}
              />
            </Flex>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default AssetList;

const AssetAmount = (props: { token: ValidToken }) => {
  const amount = useAssetsStore((state) => state.getAmount(props.token));

  const toDecimals = 10n ** BigInt(amount.decimals);
  const value = amount.value / toDecimals;
  const valueString = `${value.toString()} ${props.token}`;

  return <span>{valueString}</span>;
};

const AssetValue = (props: { token: ValidToken }) => {
  const price = useAssetsStore((state) => state.getPrice(props.token));
  const valueString = `$${price.toString()}`;

  return <span>{valueString}</span>;
};

const ConfirmTxButton = (props: {
  toast: ToastObj;
  token: ValidToken;
  tokenAddress?: Address;
  receiver: string | null;
  amount: string | null;
  isLoading: boolean;
  setTx: React.Dispatch<React.SetStateAction<SentTx | null>>;
}) => {
  const { sendTransaction } = useSendTransaction({
    mutation: {
      onSuccess: (d, v) => {
        props.setTx({
          hash: d,
          value: formatEther(v.value ?? 0n),
          token: props.token,
        });
      },
      onError: (e) => {
        console.log(e);
        props.toast.error({
          title: "Transaction failed.",
          description: "Please check your balance and network",
          duration: 5_000,
          isClosable: true,
        });
      },
    },
  });

  const { writeContract } = useWriteContract({
    mutation: {
      onSuccess: (d, v) => {
        props.setTx({
          hash: d,
          value: formatEther(v.value ?? 0n),
          token: props.token,
        });
      },
      onError: (e) => {
        console.log(e);
        props.toast.error({
          title: "Transaction failed.",
          description: "Please check your balance and network",
          duration: 5_000,
          isClosable: true,
        });
      },
    },
  });

  const transferToken = async (to: Address, amount: string) => {
    const isNative = !props.tokenAddress;
    const value = parseEther(amount);

    props.toast.loading({
      title: "Sending transaction",
      description: `Transfer ${amount} to ${to}...`,
      isClosable: false,
    });

    switch (isNative) {
      case true: {
        sendTransaction({
          to,
          value,
        });
        break;
      }

      case false: {
        writeContract({
          abi: IERC20_ABI,
          address: props.tokenAddress!,
          functionName: "transfer",
          args: [to, value],
        });
        break;
      }

      default:
        break;
    }
  };

  return (
    <Button
      isLoading={props.isLoading}
      flex={1}
      onClick={() => {
        const to = props.receiver;
        const amount = props.amount;

        if (!to || !amount) {
          console.log("invalid inputs");
          return;
        }
        if (!isAddress(to)) {
          console.log("invalid address");
          return;
        }

        transferToken(to, amount);
      }}
    >
      {props.isLoading ? "Submitting" : "Confirm"}
    </Button>
  );
};

type ToastInfo = {
  title: string;
  description: string;
  duration?: number;
  isClosable?: boolean;
};

type ToastObj = {
  loading: (args: ToastInfo) => void;
  success: (args: ToastInfo) => void;
  error: (args: ToastInfo) => void;
};

const useSendTxToast = () => {
  const toast = useToast();
  const toastRef = useRef<ReturnType<typeof toast> | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);

  const toastObj = useMemo<ToastObj>(
    () => ({
      loading: (info: ToastInfo) => {
        setIsPending(true);
        toastRef.current = toast({
          position: "top-right",
          title: info.title,
          description: info.description,
          status: "loading",
          isClosable: !!info.isClosable,
          duration: null,
        });
      },
      success: (info: ToastInfo) => {
        if (!toastRef.current) {
          return;
        }

        toast.update(toastRef.current, {
          title: info.title,
          description: info.description,
          status: "success",
          duration: info.duration,
          isClosable: !!info.isClosable,
        });
        setIsPending(false);
      },
      error: (info: ToastInfo) => {
        if (!toastRef.current) {
          return;
        }

        toast.update(toastRef.current, {
          title: info.title,
          description: info.description,
          status: "error",
          duration: info.duration,
          isClosable: !!info.isClosable,
        });
        setIsPending(false);
      },
    }),
    [toast],
  );

  return useMemo(
    () => ({
      isLoading: isPending,
      toast: toastObj,
    }),
    [isPending, toastObj],
  );
};
