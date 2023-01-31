import * as path from "path";
import * as fs from "fs";
import { events } from "bdsx/event";

/**claim-land config file */
let config: {
    max_claim: number;
    min_claim: number;
} = {
    max_claim: 262144,
    min_claim: 16,
};

//config path
const ConfigPath = path.join(__dirname, "config.json");

//replace config from config.json
try {
    config = require(ConfigPath);
} catch(err) {}

export namespace ConfigLand {
    /**Get the minimum claimable blocks. */
    export function getMin(): number {
        if (config.min_claim < 4) return 4;
        if (config.min_claim > config.max_claim||config.min_claim === config.max_claim) {
            let fixMax = config.max_claim-8;
            if (fixMax < 4) return 4;
            else return fixMax;
        }
        return Math.floor(config.min_claim);
    }

    /**Get the maximum claimable blocks. */
    export function getMax(): number {
        if (config.max_claim < 16) return 16;
        if (config.min_claim > config.max_claim||config.min_claim === config.max_claim) return config.min_claim;
        return Math.floor(config.max_claim);
    }

    /**Set the minimum block that can be claimed. */
    export function setMin(size: number): boolean {
        if (size > getMax()) return false;
        if (size < 4) return false;
        config.min_claim=Math.floor(size);

        return true;
    }

    /**Set the maximum block that can be claimed. */
    export function setMax(size: number): boolean {
        if (size < 16) return false;
        config.max_claim=Math.floor(size);

        return true;
    }

    /**Save. */
    export function save(message: boolean = false): void {
        fs.writeFile(ConfigPath, JSON.stringify(config, null, 2), "utf8", (err) => {
            if (message) {
                if (err) {
                    console.log(`[ClaimLand] config.json Error! ${err}`);
                    throw err;
                }
                else console.log(`[ClaimLand] config.json Saved!`);
            }
        });
    }
}

events.serverOpen.on(() => {
    require("./src");
    console.log(`[ClaimLand] Started!`);
});
events.serverClose.on(() => ConfigLand.save(true));