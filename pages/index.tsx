import {
  ConnectWallet,
  useAddress,
  Web3Button,
  useContract,
  useContractWrite,
  useContractRead,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import styles from "../styles/Theme.module.css";

export const contractAddress = "<your-lock-contract-address>";

const Home: NextPage = () => {
  // Currently connected wallet address
  const address = useAddress();

  // Get the Lock contract we deployed
  const { contract } = useContract(contractAddress);

  // Determine whether the connected wallet address has a valid subscription
  const { data: subscribed, isLoading } = useContractRead(
    contract,
    "getHasValidKey",
    [address]
  );

  // Read the duration of a subscription
  const { data: expirationDuration, isLoading: expirationLoading } =
    useContractRead(contract, "expirationDuration");

  // Function to purchase a subscription NFT on the Lock contract
  const { mutateAsync: purchase } = useContractWrite(contract, "purchase");
  const call = async () => {
    try {
      const data = await purchase({
        args: [[0], [address], [address], [address], [0], { value: 0 }],
      });
      console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Unlock Protocol Example</h1>
      <div className={styles.pageContainer}>
        <p className={styles.explain}>
          An example project demonstrating how you can use{" "}
          <a
            href="https://unlock-protocol.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.purple}
          >
            Unlock
          </a>
          &apos;s Public Lock contract to create subscrition NFTs with{" "}
          <a
            href="https://thirdweb.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.purple}
          >
            thirdweb
          </a>
        </p>
      </div>
      {address ? (
        isLoading ? (
          <h1 className={styles.h1}>Loading...</h1>
        ) : (
          <div className={styles.spacerTop}>
            {subscribed ? (
              <div className={styles.spacerTop}>
                {expirationLoading ? (
                  <h1 className={styles.h1}>Loading...</h1>
                ) : (
                  <p className={styles.h1}>
                    Thanks for Subscribing! Your subscription is valid for a
                    total of{" "}
                    {new Date(expirationDuration.toNumber() * 1000)
                      .toISOString()
                      .slice(11, 16)}{" "}
                    hour(s)!
                  </p>
                )}
              </div>
            ) : (
              <Web3Button
                contractAddress={contractAddress}
                className={styles.mainButton}
                theme="dark"
                action={call}
              >
                Subscribe
              </Web3Button>
            )}
            <div className={`${styles.mainButton} ${styles.spacerTop}`}>
              <ConnectWallet />
            </div>
          </div>
        )
      ) : (
        <div className={styles.spacerTop}>
          <ConnectWallet />
        </div>
      )}
    </div>
  );
};

export default Home;
