import { useAccount } from "wagmi";

import { Grid, GridItem } from "@chakra-ui/react";

// hooks
import useChainId from "~/hooks/wagmi/useChainId";

// components
import Card from "~/components/Card";
import Layout from "~/components/Layout";
import ConnectWallet from "./components/ConnectWallet";
import AssetList from "./components/AssetList";
import AssetValue from "./components/AssetValue";
import UpdateAssetsOnAccountConnection from "./components/UpdateAssetsOnAccountConnection";

// configs
import CARD_LIST, { CARD_ITEM_KEY } from "./configs/card-list";

const CARD_CONTENT = {
  [CARD_ITEM_KEY.CONNECT_WALLET]: <ConnectWallet />,
  [CARD_ITEM_KEY.ASSET_LIST]: <AssetList />,
  [CARD_ITEM_KEY.ASSET_VALUE]: <AssetValue />,
};

const Home = () => {
  const account = useAccount();
  const chainId = useChainId();

  return (
    <>
      <Layout>
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          {CARD_LIST.map((card) => (
            <GridItem colSpan={card.layout.columns} key={card.key}>
              <Card
                title={card.content.title}
                subtitle={card.content.subtitle}
                height={card.layout.height}
              >
                {CARD_CONTENT[card.key]}
              </Card>
            </GridItem>
          ))}
        </Grid>
      </Layout>
      {account.address && (
        <UpdateAssetsOnAccountConnection
          enabled
          address={account.address}
          chainId={chainId}
        />
      )}
    </>
  );
};

export default Home;
