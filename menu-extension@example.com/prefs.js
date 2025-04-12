'use strict';

import Gtk from 'gi://Gtk';
import Gio from 'gi://Gio';
import Adw from 'gi://Adw';

import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class MenuExtensionPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        // Получаем настройки расширения
        const settings = this.getSettings('org.gnome.shell.extensions.menu-example');
        
        // Создаем страницу настроек
        const page = new Adw.PreferencesPage({
            title: 'Настройки',
            icon_name: 'preferences-system-symbolic'
        });
        
        // Создаем группу настроек
        const group = new Adw.PreferencesGroup({
            title: 'Опции',
            description: 'Настройки расширения'
        });
        page.add(group);
        
        // Опция 1
        const row1 = new Adw.ActionRow({
            title: 'Опция 1',
            subtitle: 'Включить/выключить первую опцию'
        });
        
        const switch1 = new Gtk.Switch({
            active: settings.get_boolean('option1'),
            valign: Gtk.Align.CENTER
        });
        
        settings.bind(
            'option1',
            switch1,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );
        
        row1.add_suffix(switch1);
        group.add(row1);
        
        // Опция 2
        const row2 = new Adw.ActionRow({
            title: 'Опция 2',
            subtitle: 'Включить/выключить вторую опцию'
        });
        
        const switch2 = new Gtk.Switch({
            active: settings.get_boolean('option2'),
            valign: Gtk.Align.CENTER
        });
        
        settings.bind(
            'option2',
            switch2,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );
        
        row2.add_suffix(switch2);
        group.add(row2);
        
        // Добавляем страницу в окно настроек
        window.add(page);
    }
} 