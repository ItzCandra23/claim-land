import { Actor } from "bdsx/bds/actor";
import { CANCEL } from "bdsx/common";
import { events } from "bdsx/event";
import { LandMain } from ".";
import { LandPosXZ } from "./navigation";

function protect(pos: LandPosXZ, actor: Actor): void|CANCEL {
    if (LandMain.hasClaimed(pos)) {
        const owner = LandMain.getLandOwner(pos);
        const members = LandMain.getMembers(pos);

        if (!actor.isPlayer()) return CANCEL;
        if (owner && members) {
            if (owner === actor.getXuid()) return;
            if (members.includes(actor.getXuid())) return;

            actor.playSound("mob.villager.no");
            actor.sendJukeboxPopup(`This land has claimed!`);
            return CANCEL;
        }
    }
}

events.blockDestroy.on((ev) => protect(ev.blockPos, ev.player));
events.blockPlace.on((ev) => protect(ev.blockPos, ev.player));
events.blockInteractedWith.on((ev) => protect(ev.blockPos, ev.player));
events.buttonPress.on((ev) => protect(ev.blockPos, ev.player));
events.campfireDouse.on((ev) => protect(ev.blockPos, ev.actor));
events.campfireLight.on((ev) => protect(ev.blockPos, ev.actor));
events.chestOpen.on((ev) => protect(ev.blockPos, ev.player));
events.itemUseOnBlock.on((ev) => protect({x: ev.clickX, z: ev.clickZ}, ev.actor));
events.levelExplode.on((ev) => protect(ev.position, ev.entity));
events.playerAttack.on((ev) => protect(ev.victim.getPosition(), ev.player));
events.playerSleepInBed.on((ev) => protect(ev.pos, ev.player));
events.entityStartRiding.on((ev) => protect(ev.entity.getPosition(), ev.ride));