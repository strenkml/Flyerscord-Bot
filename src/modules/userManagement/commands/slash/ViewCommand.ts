import { ChatInputCommandInteraction, EmbedBuilder, User } from "discord.js";
import { AdminSlashCommand, PARAM_TYPES } from "../../../../common/models/SlashCommand";
import UserManagementDB from "../../providers/UserManagement.Database";
import { IUserInfo } from "../../interfaces/IUserInfo";
import discord from "../../../../common/utils/discord/discord";
import { createRelativeTimestamp } from "../../utils/utils";
import Time from "../../../../common/utils/Time";

export default class ViewCommand extends AdminSlashCommand {
    constructor() {
        super("viewuser", "View info for a user");

        this.data
            .addUserOption((option) => option.setName("user").setDescription("The user to ge the info for").setRequired(true)
            ).addStringOption((option) => option.setName("view").setDescription("What info to view, shows summary if not included").setRequired(false).setChoices({ name: 'Warnings', value: 'warnings' }, { name: 'Notes', value: 'notes' }));
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const user: User = this.getParamValue(interaction, PARAM_TYPES.USER, "user");
        const view: string = this.getParamValue(interaction, PARAM_TYPES.STRING, "view");

        const db = UserManagementDB.getInstance();
        const userInfo: IUserInfo = db.getUser(user.id);

        const embed = createEmbed(userInfo, view);
        if (embed) {
            interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            interaction.reply("There was an error finding the info for the user!");
        }
    }
}

function createEmbed(userInfo: IUserInfo, view: string): EmbedBuilder | undefined {
    const embed = new EmbedBuilder();
    const user = discord.users.getUser(userInfo.userId);
    const member = discord.members.getMember(userInfo.userId);

    if (user && member) {
        if (view == "warnings") {
            embed.setTitle(`${user.username}'s Warnings`);
            embed.setColor("Orange");

            const warnings = userInfo.warnings;
            for (let i = 0; i < warnings.length; i++) {
                const warning = warnings[i];
                embed.addFields({ name: `Warning ${i + 1}: ${Time.getFormattedDate(Time.getDate(warning.date))}`, value: warning.reason });
            }
        } else if (view == "notes") {
            embed.setTitle(`${user.username}'s Notes`);
            embed.setColor("Blue");

            const notes = userInfo.notes;
            for (let i = 0; i < notes.length; i++) {
                const note = notes[i];
                embed.addFields({ name: `Note ${i + 1}: ${Time.getFormattedDate(Time.getDate(note.date))}`, value: note.reason });
            }
        } else {
            embed.setTitle(`${user.username}'s User Info`);
            embed.setColor("Grey");

            embed.addFields({ name: "User ID", value: `${userInfo.userId}` });

            if (member.joinedAt) {
                embed.addFields({ name: "Joined Server", value: createRelativeTimestamp(member.joinedAt) });
            }

            embed.addFields({ name: "Account Created", value: createRelativeTimestamp(user.createdAt) });

            embed.addFields({ name: "Number of warnings", value: `${userInfo.warnings.length}` });
            embed.addFields({ name: "Number of notes", value: `${userInfo.notes.length}` });
        }

        embed.setAuthor({ name: member.displayName || user.username, iconURL: member.displayAvatarURL() || user.displayAvatarURL() });
        embed.setTimestamp(Time.getCurrentTime());

        return embed;
    }
    return undefined;
}