import * as path from "path";
import * as fs from "fs";
import { LandData, LandPos, LandPosXZ } from "./navigation";
import { ServerPlayer } from "bdsx/bds/player";
import { events } from "bdsx/event";
import { ConfigLand } from "..";
import "./command";
import "./protect";
import "./navigation";

let land: LandData[] = [];

//Files path
const LandPath = path.join(__dirname, "..", "lands.json");

try {
    land = require(LandPath);
} catch(err) {}


export namespace LandMain {
    /**Claim a new lands. */
    export function create(pos: LandPos, player: ServerPlayer): boolean {
        if (player.getXuid() === "") {
            player.sendMessage(`§cYour xuid not found`);
            return false;
        }
        if (hasClaimedV2(pos)) {
            player.sendMessage(`§cThis land has been claimed`);
            return false;
        }
        if (getBlocks(pos) > ConfigLand.getMax()) {
            player.sendMessage(`§cToo many blocks to claim`);
            return false
        }
        if (getBlocks(pos) < ConfigLand.getMin()) {
            player.sendMessage(`§cToo few blocks to claim`);
            return false;
        }

        let newLand: LandData = {
            land: pos,
            owner: player.getXuid(),
            members: [],
        };
        player.sendMessage(`§aSuccess to claim land §r${pos.toString()}`);
        land.push(newLand);

        return true;
    }

    /**Delete your land permission. */
    export function deleteLand(pos: LandPosXZ, player: ServerPlayer): boolean {
        let claim = getLand(pos)
        if (claim) {
            if (claim.owner === player.getXuid()) {
                player.sendMessage(`§aSuccess to delete your land §r${claim.land.toString()}`);
                land=land.filter((value, i) => i !== getLandIndex(pos));
                return true;
            }
            else {
                player.sendMessage(`§cThis is not your land`);
                return false;
            }
        }
        else {
            player.sendMessage(`§cYour land not found`);
            return false;
        }
    }

    /**Change your land owner. */
    export function setOwner(pos: LandPosXZ, player: ServerPlayer, owner: ServerPlayer): boolean {
        let claim = getLand(pos);
        if (claim) {
            if (claim.owner === player.getXuid()) {
                if (owner.getXuid() === "") {
                    player.sendMessage(`§c${owner.getNameTag()}§r§c xuid not found`);
                    return false;
                }
                else {
                    if (claim.owner === owner.getXuid()) {
                        player.sendMessage(`§c${owner.getXuid()}§r§c has owner in this land`);
                        return false;
                    }

                    player.sendMessage(`§aSuccess to change owner land to §e${owner.getNameTag()}`);
                    owner.sendMessage(`§e${player.getNameTag()}§a has changed owner land to you §r${claim.land.toString()}`);
                    land[getLandIndex(pos)].owner=owner.getXuid();
                    return true;
                }
            }
            else {
                player.sendMessage(`§cThis is not your land`);
                return false;
            }
        }
        else {
            player.sendMessage(`§cYour land not found`);
            return false;
        }
    }

    /**Add member to your land. */
    export function addMember(pos: LandPosXZ, player: ServerPlayer, member: ServerPlayer): boolean {
        let claim = getLand(pos);
        if (claim) {
            if (claim.owner === player.getXuid()) {
                if (member.getXuid() === "") {
                    player.sendMessage(`§c${member.getNameTag()}§r§c xuid not found`);
                    return false;
                }
                else {
                    if (claim.members.includes(member.getXuid())) {
                        player.sendMessage(`§c${member.getNameTag()}§r§c has been added before`);
                        return false;
                    }
                    if (claim.owner === member.getXuid()) {
                        player.sendMessage(`§cCannot add owner to member in own land`);
                        return false;
                    }

                    player.sendMessage(`§aSuccess to add §e${member.getNameTag()}§r§a as member in your land §r${claim.land.toString()}`);
                    member.sendMessage(`§e${player.getNameTag()}§r§a has added you from his land §r${claim.land.toString()}`);
                    land[getLandIndex(pos)].members.push(member.getXuid());
                    return true;
                }
            }
            else {
                player.sendMessage(`§cThis is not your land`);
                return false;
            }
        }
        else {
            player.sendMessage(`§cYour land not found`);
            return false;
        }
    }

    /**Remove member from your land. */
    export function removeMember(pos: LandPosXZ, player: ServerPlayer, member: ServerPlayer): boolean {
        let claim = getLand(pos);
        if (claim) {
            if (claim.owner === player.getXuid()) {
                if (member.getXuid() === "") {
                    player.sendMessage(`§c${member.getNameTag()}§r§c xuid not found`);
                    return false;
                }
                else {
                    if (claim.members.includes(member.getXuid())) {
                        player.sendMessage(`§aSuccess to remove §e${member.getNameTag()}§r§a as member in your land §r${claim.land.toString()}`);
                        member.sendMessage(`§e${player.getNameTag()}§r§a has removed you from his member land §r${claim.land.toString()}`);
                        land[getLandIndex(pos)].members=land[getLandIndex(pos)].members.filter((value) => value !== member.getXuid());
                        return true;
                    }
                    else {
                        player.sendMessage(`§cMember not found`);
                        return false;
                    }
                }
            }
            else {
                player.sendMessage(`§cThis is not your land`);
                return false;
            }
        }
        else {
            player.sendMessage(`§cYour land not found`);
            return false;
        }
    }

    /**Get all member xuid in land. */
    export function getMembers(pos: LandPosXZ): string[]|undefined {
        let claim = getLand(pos);
        if (claim) return claim.members;
        else return undefined;
    }

    /**Check land has claimed. */
    export function hasClaimed(pos: LandPosXZ): boolean {
        let result: boolean = false;
        land.forEach((value) => {
            let claim = value.land;
            if (claim.pos1.x >= pos.x && claim.pos1.z >= pos.z && claim.pos2.x <= pos.x && claim.pos2.z <= pos.z) result=true;
            else result=false;
        });
        return result;
    }

    /**Check land has claimed use LandPos. */
    export function hasClaimedV2(pos: LandPos): boolean {
        if (land.length > 0) {
            let result: boolean = false;
            land.forEach((value) => {
                let claim = value.land;
                const isClaimed = Boolean(claim.pos1.x >= pos.pos1.x && claim.pos1.z >= pos.pos1.z && claim.pos2.x <= pos.pos2.x && claim.pos2.z <= pos.pos2.z);
                if (isClaimed) result=true;
                else result=false
            });
            return result;
        }
        else return false;
    }

    /**Get land owner xuid. */
    export function getLandOwner(pos: LandPosXZ): string|undefined {
        let result: string|undefined = undefined;
        land.forEach((value) => {
            let claim = value.land;
            if (claim.pos1.x >= pos.x && claim.pos1.z >= pos.z && claim.pos2.x <= pos.x && claim.pos2.z <= pos.z) result=value.owner;
            else result=undefined;
        });
        return result;
    }

    /**Get data land. */
    export function getLand(pos: LandPosXZ): LandData|undefined {
        let result: LandData|undefined = undefined;
        land.forEach((value) => {
            let claim = value.land;
            if (claim.pos1.x >= pos.x && claim.pos1.z >= pos.z && claim.pos2.x <= pos.x && claim.pos2.z <= pos.z) result=value;
            else result=undefined;
        });
        return result;
    }

    /**Get land index. */
    export function getLandIndex(pos: LandPosXZ): number {
        let result = -1;
        land.forEach((value, i) => {
            let claim = value.land;
            if (claim.pos1.x >= pos.x && claim.pos1.z >= pos.z && claim.pos2.x <= pos.x && claim.pos2.z <= pos.z) result=i;
            else result=(-1);
        });
        return result;
    }

    /**Get land size. */
    export function getBlocks(pos: LandPos): number {
        let calculate = Math.abs(pos.pos2.x - pos.pos1.x) * Math.abs(pos.pos2.z - pos.pos1.z);
        return calculate;
    }

    /**Save. */
    export function save(message: boolean = false): void {
        fs.writeFile(LandPath, JSON.stringify(land, null, 2), "utf8", (err) => {
            if (message) {
                if (err) {
                    console.log(`[ClaimLand] lands.json Error! ${err}`);
                    throw err;
                }
                else console.log(`[ClaimLand] lands.json Saved!`);
            }
        });
    }
}

events.serverClose.on(() => LandMain.save(true));