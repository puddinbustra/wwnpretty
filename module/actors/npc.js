export class SWNRNPCActor extends Actor {
    prepareBaseData() {
        const e = this.data.data.effort;
        e.value = e.max - e.current - e.scene - e.day;
    }
    _onCreate(data, options, userId) {
        super._onCreate(data, options, userId);
        if (this.data["items"]["length"] || game.userId !== userId)
            return;
        this.createOwnedItem({
            name: game.i18n.localize("swnr.npc.unarmed"),
            type: "weapon",
            data: {
                ammo: {
                    type: "none",
                },
                damage: "d2",
            },
            img: "icons/equipment/hand/gauntlet-armored-leather-grey.webp",
        });
    }
}
export const entity = SWNRNPCActor;
export const name = "npc";

//# sourceMappingURL=npc.js.map
