import {JupyterLab, JupyterLabPlugin} from '@jupyterlab/application';
import {ICommandPalette, MainAreaWidget,} from '@jupyterlab/apputils';
// import * as React from 'react';
import '../style/index.css';
import {ReadonlyJSONObject} from '@phosphor/coreutils';
import {toArray} from '@phosphor/algorithm';
import {Menu} from '@phosphor/widgets'
import {IMainMenu} from '@jupyterlab/mainmenu'
import {SparkUIWidget} from "./sparkUIWidget";


/**
 * Initialization data for the spark_ui_tab extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'spark_ui_tab',
  autoStart: true,
  requires: [IMainMenu, ICommandPalette],
  activate

};

namespace CommandIDs {
  export const run = 'sparkui:run';
}

function activate(app: JupyterLab, mainMenu: IMainMenu, palette: ICommandPalette): void {
  const {commands, shell} = app;
  let widget: SparkUIWidget;


  commands.addCommand(CommandIDs.run, {
    label: 'Spark UI',
    execute: (args: ReadonlyJSONObject) => {
      widget = new SparkUIWidget();
      widget.title.label = 'Open Spark UI';
      let main = new MainAreaWidget({content: widget});
      // If there are any other widgets open, remove the launcher close icon.
      main.title.closable = !!toArray(shell.widgets('main')).length;
      shell.addToMainArea(main, {activate: args['activate'] as boolean});
      shell.layoutModified.connect(
          () => {
            // If there is only a launcher open, remove the close icon.
            main.title.closable = toArray(shell.widgets('main')).length > 1;
          },
          main
      );
      return main;
    }

  });
  palette.addItem({command: CommandIDs.run, category: 'Spark'});

  let menu = createMenu(app);
  mainMenu.addMenu(menu, {rank: 100});
}

export function createMenu(app: JupyterLab): Menu {
  const {commands} = app;
  let menu: Menu = new Menu({commands});
  menu.title.label = 'Spark';
  menu.addItem({command: CommandIDs.run});
  return menu;
}

export default extension;
