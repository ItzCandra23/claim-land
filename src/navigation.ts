import { BlockPos, Vec3 } from "bdsx/bds/blockpos";
import { CommandPosition } from "bdsx/bds/command";
import { VectorXZ } from "bdsx/common";

export interface LandData {
    land: LandPos;
    owner: string;
    members: string[];
}

export interface LandSettings {
    pvp: boolean;
    useBlock: boolean;
    openChest: boolean;
    explode: boolean;
    sleep: boolean;
    projectile: boolean;
}

export interface LandPosXZ {
    x: number;
    z: number;
}

export class LandPos {

    constructor(pos1: LandPosXZ, pos2: LandPosXZ) {
        this.pos1 = pos1;
        this.pos2 = pos2;
    }

    pos1: LandPosXZ;
    pos2: LandPosXZ;

    static create(pos1: Vec3|BlockPos|CommandPosition|VectorXZ|LandPosXZ, pos2: Vec3|BlockPos|CommandPosition|VectorXZ|LandPosXZ): LandPos {
        const convert = (pos: Vec3|BlockPos|CommandPosition|LandPosXZ): LandPosXZ => {
            const floorX = Math.floor(pos.x);
            const floorZ = Math.floor(pos.z);
            return { x: floorX, z: floorZ };
        }

        return new LandPos(convert(pos1), convert(pos2));
    }

    setPos1(pos: Vec3|BlockPos|CommandPosition|LandPosXZ): void {
        this.pos1={ x: pos.x, z: pos.z };
    }

    setPos2(pos: Vec3|BlockPos|CommandPosition|LandPosXZ): void {
        this.pos2={ x: pos.x, z: pos.z };
    }

    toString(): string {
        return `[${this.pos1.x}, ${this.pos1.z}], [${this.pos2.x}, ${this.pos2.z}]`;
    }
}
