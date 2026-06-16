// Стандартные списки слов для генератора карточек.
// Формат строки: 1–3 эмодзи, пробел, затем подпись (см. parseLine в app.js).
// RU — реалии постсоветских/европейских дорог. EN — реалии США/UK road trip.
const WORDS = {
  ru: `🚙🌍 Авто с иностранными номерами
🚌 Автобус (рейсовый/городской)
🚏 Автобусная остановка
🚗🔗 Авто с прицепом
🐦 Аист
🏗️ Башенный кран
🛢️🚛 Бензовоз
⚪🌳 Берёза
🌳 Большое одинокое дерево
🚲 Велосипед
🌬️🌀 Ветряная мельница
🚰🗼 Водонапорная башня
🪺🐦 Гнездо аиста на столбе
🏘️ Деревня
🧱🏠 Дом из красного кирпича
🏡 Дом с черепичной крышей
🚂🛤️ Ж/д переезд
⛽ Заправка
🎨🧱 Граффити
⛺🪑 Знак «место привала»
🛑 Знак «стоп»
⏲️🚗 Ограничение скорости <60
📷 Камера (видеофиксация)
🕳️ Канава
🪦 Кладбище
🌽🚜 Комбайн
🐄 Корова
🛖🐄 Коровник
🐈 Кот
🌲🌲 Лес
🐎 Лошадь
🏪 Магазин
🚓 Машина ГАИ
🚗🧽 Мойка
🥛🚛 Молоковоз
🌉 Мост
🏍️ Мотоцикл
🗑️ Мусорный контейнер
🐑🐐 Овца или коза
🏞️💧 Водоём (озеро/пруд)
⚡🗼 Опора ЛЭП
🗿 Памятник / скульптура
🌾 Поле
🛣️🔵 Синий указатель с километражом
🪵 Сложенные брёвна
🐕 Собака
📡🗼 Сотовая вышка
🐄🐄 Стадо коров
🚧 Стройка
🪧🌊 Табличка с названием реки
🚜 Трактор
🚍🧳 Туристический автобус
🔚🏘️ Конец населённого пункта
🎀 Украшение на столбе
🦆 Утки
🇧🇾 Флаг страны
🚛 Фура с логотипом
⛰️ Холм
☦️⛪ Православная церковь
⛪✝️ Католический костёл
✝️ Крест
🛩️ Летательный объект (самолёт/шар/дрон)
🔄 Круговая развязка
🚚🌀 Бетономешалка
🚛🪵 Лесовоз
🚗🚫 Знак «обгон запрещён»
⚠️🦌 Знак «осторожно, дикие животные»
☀️🔋 Солнечная панель
🔌🚗 Электромобиль
💗 Что-то в форме сердечка
🏎️ Яркая машина`,

  en: `🚙🌍 Out-of-state license plate
🚌 Bus
🚏 Bus stop
🚗🔗 Car towing a trailer
🦅 Hawk or large bird
🏗️ Tower crane
🛢️🚛 Fuel tanker
🌳 Big lone tree
🚲 Bicycle
🌬️🌀 Wind turbine
🚰🗼 Water tower
🏘️ Small town
🧱🏠 Red brick house
🏡 House with a porch
🚂🛤️ Railroad crossing
⛽ Gas station
🎨🧱 Graffiti
⛺🪑 Rest area sign
🛑 Stop sign
⏲️🚗 Speed limit sign
📷 Speed camera
🪦 Cemetery
🌽🚜 Combine harvester
🐄 Cow
🐈 Cat
🌲🌲 Forest
🐎 Horse
🏪 Store
🚓 Police car
🚗🧽 Car wash
🌉 Bridge
🏍️ Motorcycle
🗑️ Dumpster
🐑🐐 Sheep or goat
🏞️💧 Lake or pond
⚡🗼 Power line tower
🗿 Statue or monument
🌾 Field
🛣️🔵 Mile marker
🪵 Stacked logs
🐕 Dog
📡🗼 Cell tower
🐄🐄 Herd of cows
🚧 Roadwork
🚜 Tractor
🚍🧳 Tour bus
🔚🏘️ Town limit sign
🎀 Ribbon on a post
🦆 Ducks
🇺🇸 A flag
🚛 Truck with a logo
⛰️ Hill
⛪ Church
✝️ Roadside cross
🛩️ Plane, balloon or drone
🔄 Roundabout
🚚🌀 Cement mixer
🚛🪵 Logging truck
🚗🚫 No-passing sign
⚠️🦌 Deer crossing sign
☀️🔋 Solar panel
🔌🚗 Electric car
💗 Something heart-shaped
🏎️ Brightly colored car
🚐 RV or camper van
🛻 Pickup truck
📮 Mailbox
🚦 Traffic light
🪧🛣️ Billboard
🌽 Cornfield
🏟️ Stadium or arena`,
};
