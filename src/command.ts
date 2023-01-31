import { CommandPosition, PlayerCommandSelector } from "bdsx/bds/command";
import { command } from "bdsx/command";
import { LandMain } from ".";
import { LandPos } from "./navigation";

const cmd = command.register("land", "Claim land.");

cmd.overload((p, o) => {
    const actor = o.getEntity();
    if (!actor) {
        console.log(`[ClaimLand] This command can only be used in game.`);
        return;
    }
    if (actor.isPlayer()) {
        LandMain.create(LandPos.create(p.pos1, p.pos2), actor);
    }
}, {
    claim: command.enum("CL_claim", "claim"),
    pos1: CommandPosition,
    pos2: CommandPosition,
});

cmd.overload((p, o) => {
    const actor = o.getEntity();
    if (!actor) {
        console.log(`[ClaimLand] This command can only be used in game.`);
        return;
    }
    if (actor.isPlayer()) {
        LandMain.deleteLand(p.pos, actor);
    }
}, {
    delete: command.enum("CL_delete", "delete"),
    pos: CommandPosition,
});

cmd.overload((p, o) => {
    const actor = o.getEntity();
    if (!actor) {
        console.log(`[ClaimLand] This command can only be used in game.`);
        return;
    }
    if (actor.isPlayer()) {
        LandMain.deleteLand(actor.getPosition(), actor);
    }
}, {
    delete: command.enum("CL_delete", "delete"),
});

cmd.overload((p, o) => {
    const actor = o.getEntity();
    if (!actor) {
        console.log(`[ClaimLand] This command can only be used in game.`);
        return;
    }
    if (actor.isPlayer()) {
        for (const owner of p.newOwner.newResults(o)) {
            if (owner.isPlayer()) {
                LandMain.setOwner(p.pos, actor, owner);
                continue;
            }
        }
    }
}, {
    setowner: command.enum("CL_setowner", "setowner"),
    newOwner: PlayerCommandSelector,
    pos: CommandPosition,
});

cmd.overload((p, o) => {
    const actor = o.getEntity();
    if (!actor) {
        console.log(`[ClaimLand] This command can only be used in game.`);
        return;
    }
    if (actor.isPlayer()) {
        for (const owner of p.newOwner.newResults(o)) {
            if (owner.isPlayer()) {
                LandMain.setOwner(actor.getPosition(), actor, owner);
                continue;
            }
        }
    }
}, {
    setowner: command.enum("CL_setowner", "setowner"),
    newOwner: PlayerCommandSelector,
});

cmd.overload((p, o) => {
    const actor = o.getEntity();
    if (!actor) {
        console.log(`[ClaimLand] This command can only be used in game.`);
        return;
    }
    if (actor.isPlayer()) {
        if (LandMain.hasClaimed(p.pos)) actor.sendMessage(`§aThis land has been claimed`);
        else actor.sendMessage(`§aThis land is unclaimed`);
    }
}, {
    check: command.enum("CL_check", "check"),
    pos: CommandPosition,
});

cmd.overload((p, o) => {
    const actor = o.getEntity();
    if (!actor) {
        console.log(`[ClaimLand] This command can only be used in game.`);
        return;
    }
    if (actor.isPlayer()) {
        if (LandMain.hasClaimed(actor.getPosition())) actor.sendMessage(`§aThis land has been claimed`);
        else actor.sendMessage(`§aThis land is unclaimed`);
    }
}, {
    check: command.enum("CL_check", "check"),
});

cmd.overload((p, o) => {
    const actor = o.getEntity();
    if (!actor) {
        console.log(`[ClaimLand] This command can only be used in game.`);
        return;
    }
    if (actor.isPlayer()) {
        for (const member of p.target.newResults(o)) {
            if (member.isPlayer()) {
                if (p.value === "add") {
                    LandMain.addMember(p.pos, actor, member);
                }
                if (p.value === "remove") {
                    LandMain.removeMember(p.pos, actor, member);
                }
                continue;
            }
        }
    }
}, {
    member: command.enum("CL_member", "member"),
    value: command.enum("CL_value", "add", "remove"),
    target: PlayerCommandSelector,
    pos: CommandPosition,
});

cmd.overload((p, o) => {
    const actor = o.getEntity();
    if (!actor) {
        console.log(`[ClaimLand] This command can only be used in game.`);
        return;
    }
    if (actor.isPlayer()) {
        for (const member of p.target.newResults(o)) {
            if (member.isPlayer()) {
                if (p.value === "add") {
                    LandMain.addMember(actor.getPosition(), actor, member);
                }
                if (p.value === "remove") {
                    LandMain.removeMember(actor.getPosition(), actor, member);
                }
                continue;
            }
        }
    }
}, {
    member: command.enum("CL_member", "member"),
    value: command.enum("CL_value", "add", "remove"),
    target: PlayerCommandSelector,
});
