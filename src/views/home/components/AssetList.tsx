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
} from "@chakra-ui/react";

// constants
import { TOKEN, TOKEN_MAP, ValidToken } from "~/constants/tokens";
import useChainId from "~/hooks/wagmi/useChainId";
import { useAssetsStore } from "~/stores";

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

const AssetList = () => {
  const chainId = useChainId();

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

  if (!chainId) return null;

  const availableTokens = TOKEN_MAP[chainId];

  return (
    <TableContainer overflowY="scroll">
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
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
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
  const amount = useAssetsStore((state) => state.getAmount(props.token));

  const toDecimals = 10n ** BigInt(amount.decimals);
  const value = (amount.value * price) / toDecimals;
  const valueString = `$${value.toString()}`;

  return <span>{valueString}</span>;
};
