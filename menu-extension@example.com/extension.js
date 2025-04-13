/**
 * @typedef {import('@girs/st').St} St
 * @typedef {import('@girs/clutter-13').Clutter} Clutter
 * @typedef {import('@girs/gobject-2.0').GObject} GObject
 * @typedef {import('@girs/gio-2.0').Gio} Gio
 * @typedef {import('@girs/gtk-4.0').Gtk} Gtk
 * @typedef {import('@girs/adw-1').Adw} Adw
 */


import St from 'gi://St';
import Clutter from 'gi://Clutter';
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';

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
                text: 'Power Profiles',
                y_align: Clutter.ActorAlign.CENTER
            });
            
            // Добавляем текст в панель
            this.add_child(this.buttonText);
            
            // Добавляем подзаголовок в меню
            this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem('CPU/GPU Profiles'));
            
            // Создаем пункты меню
            this._item1 = new PopupMenu.PopupMenuItem("Conservative Mode");
            this._item2 = new PopupMenu.PopupMenuItem("Powersave Mode");
            
            // Подключаем обработчики нажатий
            this._item1.connect('activate', () => {
                executeRootCommand('cpupower frequency-set -g conservative && echo "battery" > /sys/class/drm/card1/device/power_dpm_state && echo "auto" > /sys/class/drm/card1/device/power_dpm_force_performance_level');
            });
            
            this._item2.connect('activate', () => {
                executeRootCommand('cpupower frequency-set -g powersave && echo "battery" > /sys/class/drm/card1/device/power_dpm_state && echo "low" > /sys/class/drm/card1/device/power_dpm_force_performance_level');
            });
            
            // Добавляем пункты в меню
            this.menu.addMenuItem(this._item1);
            this.menu.addMenuItem(this._item2);
        }
    }
);

function executeRootCommand(command) {
    try {
        // Асинхронный вызов не блокирует интерфейс
        let proc = Gio.Subprocess.new(
            ['pkexec', 'sh', '-c', command],
            Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE
        );
        
        // Обрабатываем результат асинхронно
        proc.communicate_utf8_async(null, null, (proc, res) => {
            try {
                let [, stdout, stderr] = proc.communicate_utf8_finish(res);
                let status = proc.get_exit_status();
                
                if (status !== 0) {
                    logError(new Error(`Error executing command: ${stderr}`));
                    Main.notify(_("Ошибка выполнения команды"), stderr);
                } else {
                    log(`Command executed successfully`);
                }
            } catch (e) {
                logError(e);
                Main.notify(_("Ошибка выполнения команды"), e.message);
            }
        });
        
        return true;
    } catch (e) {
        logError(e);
        Main.notify(_("Ошибка запуска команды"), e.message);
        return false;
    }
}

export default class MenuExtension extends Extension {
    enable() {
        this._settings = this.getSettings('org.gnome.shell.extensions.menu-example');
        this._indicator = new Indicator(this._settings);
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }
    
    disable() {
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }
        this._settings = null;
    }
} 

