import { startExpressApp } from "./app";

/** Starts an application, if failed will close the nodejs process */
const main = async () => {
  try {
    await startExpressApp();
  } catch (error) {
    console.error("Error starting the application:", error);
    process.exit(1);
  }
};
main();
