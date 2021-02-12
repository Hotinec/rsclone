# Игра ZombieLand (Crimsoland clone)

Демо: https://rs-zombieland.herokuapp.com/

Игра запустится локально, для хранения данных используется удаленный сервер.

Для запуска игры склонируйте репозиторий к себе, запустите команду `$ npm install` в папке client затем запустите в рабочем катологе:

`$ npm install`

`$ npm run dev`

## Технологический стек
Игра была написана на движке **Phaser 3** с которым удобно использовать технологии **Canvas** и **WebGL**, также удобно управлять взаимодействтвием обьектов. Движок в нашем случае использует встроенную модель физики **Arcade.js**.

В качестве основного языка был использован **Typescript**, строго типизированный язык который позволяет избежать некоторых ошибок еще на этапе написания кода. В качестве backend использоволась связка **NodeJS (Express), MongoDB** и **Mongoose**.В качестве транспайлера использвался **Babel** для поддержзки кода под стандарт ES5.

Для обработки ошибок единообразия кода использовался **ESLint** с конфигурацией *airbnb-typescript/base* для работы с Typescript.

Клиентская часть игры реализована с помощью сборщика **Webpack** для удобного использования модульности проекта.
