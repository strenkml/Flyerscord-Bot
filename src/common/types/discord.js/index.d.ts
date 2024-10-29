import ModalMenu from "../../models/ModalMenu.ts";
import SlashCommand from "../../models/SlashCommand.ts";
import TextCommand from "../../models/TextCommand.ts";
import { ContextMenuCommand } from "../../models/ContextMenuCommand.ts";

export {};

declare module "discord.js" {
  export interface Client {
    slashCommands: Collection<string, SlashCommand>;
    textCommands: Collection<string, TextCommand>;
    modals: Collection<string, ModalMenu>;
    contextMenus: Collection<string, ContextMenuCommand>;
  }
}
