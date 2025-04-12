#!/bin/bash

# Меняем текущую директорию на директорию скрипта
cd "$(dirname "$0")"

# Определяем целевую директорию
TARGET_DIR="$HOME/.local/share/gnome-shell/extensions/menu-extension@example.com"

# Удаляем существующее расширение, если оно есть
rm -rf "$TARGET_DIR"

# Создаем директорию
mkdir -p "$TARGET_DIR"

# Проверяем, существует ли исходная директория
if [ ! -d "menu-extension@example.com" ]; then
  echo "Ошибка: директория menu-extension@example.com не найдена!"
  exit 1
fi

# Копируем файлы
cp -r menu-extension@example.com/* "$TARGET_DIR/"

# Компилируем схему
if [ -d "$TARGET_DIR/schemas" ]; then
  cd "$TARGET_DIR/schemas"
  chmod +x compile.sh
  ./compile.sh
else
  echo "Ошибка: директория с схемами не найдена!"
  exit 1
fi

echo ""
echo "Расширение установлено в $TARGET_DIR"
echo ""
echo "ВАЖНО: В Wayland необходимо перезапустить сессию для обнаружения расширения!"
echo "1. Выйдите из системы"
echo "2. Войдите снова"
echo "3. Активируйте расширение командой: gnome-extensions enable menu-extension@example.com"
echo "   или через приложение 'Расширения'"