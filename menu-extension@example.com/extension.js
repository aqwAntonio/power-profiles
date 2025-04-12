import St from 'gi://St';
import Clutter from 'gi://Clutter';
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

// Определяем класс индикатора
const Indicator = GObject.registerClass(
    class Indicator extends PanelMenu.Button {
        _init(settings) {
            super._init(0.0, "Переключатель");
            
            this._settings = settings;
            
            // Создаем иконку/текст для отображения в панели
            this.buttonText = new St.Label({
                text: 'Опции',
                y_align: Clutter.ActorAlign.CENTER
            });
            
            // Добавляем текст в панель
            this.add_child(this.buttonText);
            
            // Создаем первый пункт меню
            this._item1 = new PopupMenu.PopupSwitchMenuItem("Опция 1", 
                this._settings.get_boolean('option1'));
            
            // Создаем второй пункт меню
            this._item2 = new PopupMenu.PopupSwitchMenuItem("Опция 2", 
                this._settings.get_boolean('option2'));
            
            // Добавляем пункты в меню
            this.menu.addMenuItem(this._item1);
            this.menu.addMenuItem(this._item2);
            
            // Подключаем обработчики событий
            this._item1.connect('toggled', (item, state) => {
                this._settings.set_boolean('option1', state);
            });
            
            this._item2.connect('toggled', (item, state) => {
                this._settings.set_boolean('option2', state);
            });
        }
    }
);

export default class MenuExtension extends Extension {
    enable() {
        this._settings = this.getSettings('org.gnome.shell.extensions.menu-example');
        this._indicator = new Indicator(this._settings);
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }
    
    disable() {
        this._indicator.destroy();
        this._indicator = null;
        this._settings = null;
    }
} 