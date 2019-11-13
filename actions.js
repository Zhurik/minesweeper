// TODO Отображение неверных флагов по окончанию игры
// TODO Разноцветные числа, как в оригинальном сапере
// TODO Пофиксить баг с неправильной таблицей
"use strict";

var BOMB_PROB = 0.07;
var field = null;

var rows = 0;
var cols = 0;
var bombs = 0;
var flags = 0;

// Функция для очистки поля от 0 значений
// она кривая, но работает
// TODO Реализовать открытие диагональных клеток
function clear_empty(row, col, rows, cols) {
    var screen = document.getElementsByTagName('table')[0].childNodes;

    screen[row].childNodes[col].className = 'empty';
    field[row][col] = 'C';

    if (screen[row].childNodes[col].innerHTML == '') {
        

        if (row - 1 >= 0) {
            if (screen[row - 1].childNodes[col].className != 'empty') {
                clear_empty(row - 1, col, rows, cols);
            }
        }

        if (col - 1 >= 0) {
            if (screen[row].childNodes[col - 1].className != 'empty') {
                clear_empty(row, col - 1, rows, cols);
            }
        }

        if (row + 1 < rows) {
            if (screen[row + 1].childNodes[col].className != 'empty') {
                clear_empty(row + 1, col, rows, cols);
            }
        }

        if (col + 1 < cols) {
            if (screen[row].childNodes[col + 1].className != 'empty') {
                clear_empty(row, col + 1, rows, cols);
            }
        }

        // Зачищаем диагонали клетки
        if (row - 1 >= 0 && col - 1 >= 0) {
            if (screen[row - 1].childNodes[col - 1].className != 'empty') {
                screen[row - 1].childNodes[col - 1].className = 'empty';
                field[row - 1][col - 1] = 'C';
            }
        }

        if (row - 1 >= 0 && col + 1 < cols) {
            if (screen[row - 1].childNodes[col + 1].className != 'empty') {
                screen[row - 1].childNodes[col + 1].className = 'empty';
                field[row - 1][col + 1] = 'C';
            }
        }

        if (row + 1 < rows && col - 1 >= 0) {
            if (screen[row + 1].childNodes[col - 1].className != 'empty') {
                screen[row + 1].childNodes[col - 1].className = 'empty';
                field[row + 1][col - 1] = 'C';
            }
        }

        if (row + 1 < rows && col + 1 < cols) {
            if (screen[row + 1].childNodes[col + 1].className != 'empty') {
                screen[row + 1].childNodes[col + 1].className = 'empty';
                field[row + 1][col + 1] = 'C';
            }
        }
        // Закончили зачистку диагоналей

    } else {
        return;
    }
}

// Функция проверки конца игры
function check_game_over() {
    for (var i = 0; i < field.length; i++) {
        for (var j = 0; j < field[i].length; j++) {
            if (!(field[i][j] == 'B' || field[i][j] == 'C')) {
                return false;
            }
        }
    }

    return true;
}

// Функция для показа бомб в случае поражения
function draw_bombs() {
    var field = document.getElementsByTagName('table')[0].childNodes;

    for (var i = 0; i < field.length; i++) {
        for (var j = 0; j < field[i].childNodes.length; j++) {
            if (field[i].childNodes[j].innerHTML == 'B') {
                field[i].childNodes[j].className = 'bomb';
            }
        }
    }
}

// Функция, отключающая поле после окончания игры
function turn_field_off() {
    var field = document.getElementsByTagName('table')[0].childNodes;

    for (var i = 0; i < field.length; i++) {
        for (var j = 0; j < field[i].childNodes.length; j++) {
            field[i].childNodes[j].removeEventListener('click', check_cell, false);
        }
    }
}

// Функция для обработки клика по клетке поля
function check_cell() {
    // Получаем координаты текущей ячейки
    var cell_data = this.id.split('_');

    var row = parseInt(cell_data[0]);
    var col = parseInt(cell_data[1]);
    var rows = parseInt(cell_data[2]);
    var cols = parseInt(cell_data[3]);

    // Заполняем поле в зависимости от первого клика
    if (field == null) {
        create_field(
            rows,
            cols,
            bombs,
            row,
            col
        );
    }

    // Игнорируем клетку, если на ней стоит флаг
    if (this.innerHTML == 'F') {
        return;
    }

    // Если напоролись на бомбу, то игра окончена
    if (this.innerHTML == 'B') {
        draw_bombs();
        turn_field_off();
       // window.alert('Игра окончена!');
        window.alert('!!!САНЯ - ПРИЁМНЫЙ!!!');
        window.alert('Страница будет перезагружена через 5 секунд');
        window.setTimeout(function() {location.reload();}, 5000);
    }

    // Открывааем клетку
    this.className = "empty";
    field[row][col] = 'C';

    // Очищаем поле, если наткнулись на клетку без бомб
    if (this.innerHTML == '') {
        clear_empty(row, col, rows, cols);

        // Дополнительно очищаем от косяков
        var times = 3;  // Кол-во раз, для очистки
        while (times > 0) {
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {
                    if (document.getElementsByTagName('table')[0].childNodes[i].childNodes[j].className == 'empty') {
                        clear_empty(i, j, rows, cols);
                    }
                }
            }
            times--;
        }
    }

    // Проверяем, что игра закончена
    if (check_game_over()) {
        turn_field_off();
       // window.alert('Вы победили :3');
        window.alert('!!!САНЯ - ПИДР!!!');
        window.alert('Обновите страницу для новой игры');
    }
}

// Функция для заполнения поля
function create_field(rows, cols, bombs, row, col) {
    // Создаем массив поля
    field = new Array(rows);

    // Создаем строки
    for (var i = 0; i < rows; i++) {
        field[i] = new Array(cols);
    }

    // Ставим бомбы
    while (bombs > 0) {
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                // TODO Придумать формулу для вывода вероятности постановки бомб
                if (field[i][j] != 'B' && !(i == row && j == col)) {
                    var prob = Math.random();

                    if (prob <= BOMB_PROB) {
                        field[i][j] = 'B';
                        bombs--;

                        if (bombs == 0) {
                            break;
                        }
                    }
                }
            }

            if (bombs == 0) {
                break;
            }
        }
    }

    // Ставим цифры
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            if (field[i][j] != 'B') {
                var num = 0;

                // Проверяем строку над ячейкой
                if (i - 1 >= 0) {
                    if (j - 1 >= 0) {
                        if (field[i - 1][j - 1] == 'B') {
                            num++;
                        }
                    }

                    if (field[i - 1][j] == 'B') {
                        num++;
                    }

                    if (j + 1 < cols) {
                        if (field[i - 1][j + 1] == 'B') {
                            num++;
                        }
                    }
                }

                // Проверяем строку текущей ячейки
                if (j - 1 >= 0) {
                    if (field[i][j - 1] == 'B') {
                        num++;
                    }
                }

                if (j + 1 < cols) {
                    if (field[i][j + 1] == 'B') {
                        num++;
                    }
                }

                // Проверяем строку под текущей ячейкой
                if (i + 1 < rows) {
                    if (j - 1 >= 0) {
                        if (field[i + 1][j - 1] == 'B') {
                            num++;
                        }
                    }

                    if (field[i + 1][j] == 'B') {
                        num++;
                    }

                    if (j + 1 < cols) {
                        if (field[i + 1][j + 1] == 'B') {
                            num++;
                        }
                    }
                }

                // Записываем текущее значение
                field[i][j] = num;
            }
        }
    }

    // Получаем таблицу с экрана
    var screen = document.getElementsByTagName('table')[0].childNodes;

    // Заполняем таблицу данными
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            if (field[i][j] != 0) {
                screen[i].childNodes[j].innerHTML = field[i][j];
            }
        }
    }
}

// Функция для проверки вводимых значений
function get_values() {
    var data = document.forms.settings;

    switch(data.diff.value) {
        case "easy":
            rows = 9;
            cols = 9;
            bombs = 10;
        break;

        case "norm":
            rows = 16;
            cols = 16;
            bombs = 40;
        break;

        case "hard":
            rows = 16;
            cols = 30;
            bombs = 99;
        break;

        case "custom":
            rows = parseInt(document.getElementById('rows').value);
            cols = parseInt(document.getElementById('cols').value);
            bombs = parseInt(document.getElementById('bombs').value);
        break;
    }

    flags = bombs;

    // Проверяем текстовые значения
    if (isNaN(rows) || isNaN(cols) || isNaN(bombs)) {
        window.alert('Допустим ввод только числовых значений!');
        return false;
    }

    // Проверяем отрицательные значения
    if (rows < 2 || cols < 2 || bombs < 1) {
        window.alert('Допустим ввод только положительных значений!');
        return false;
    }

    // Проверяем слишком большие значения
    if (rows > 40 || cols > 40) {
        window.alert('Ширина и высота поля не могут быть больше 40!');
        return false;
    }

    // Проверяем кол-во бомб < столбцов * строки
    if (bombs >= rows * cols) {
        window.alert('Бомб не может быть больше, чем клеток на поле!');
        return false;
    }

    return true;
}

// Функция для деактивации ненужных на странице элементов
function deactivate() {
    // Делаем элементы формы неактивными
    document.getElementById('rows').disabled = true;
    document.getElementById('cols').disabled = true;
    document.getElementById('bombs').disabled = true;
    document.getElementById('start').disabled = true;

    var radios = document.getElementsByName('diff');
    for (var i = 0; i < radios.length; i++) {
        radios[i].disabled = true;
    }
}

// Функция для установки флага на ячейке
function place_flag(cell) {
    if (field != null) {
        // Получаем координаты текущей ячейки
        var cell_data = cell.id.split('_');

        var row = parseInt(cell_data[0]);
        var col = parseInt(cell_data[1]);

        if ((cell.className != 'empty' && cell.className != 'flag') && flags > 0) {
            cell.className = 'flag';
            cell.innerHTML = "F";
            flags--;
        }
        else if (cell.className == 'flag') {
            cell.className = '';
            if (field[row][col] == 0) {
                cell.innerHTML = '';
            }
            else {
                cell.innerHTML = field[row][col];
            }

            flags++;
        }

        document.getElementById('flags').innerHTML = flags;
    }
}

// Функция для начала игры
function start_game() {
    // Получаем размеры поля
    if (!get_values()) {
        return false;
    }

    // Выключаем лишние элементы
    deactivate();

    // Создаем таблицу согласно введенным значениям
    var table_new = document.getElementById('new-table').appendChild(document.createElement('table'));

    for (var i = 0; i < rows; i++) {
        // Создаем очередную строку таблицы
        var current_row = table_new.appendChild(document.createElement('tr'));

        for (var j = 0; j < cols; j++) {
            // Создаем очередную ячейку таблицы
            var current_cell = current_row.appendChild(document.createElement('td'));

            // Добавляем ячейке обработчик левого клика
            current_cell.addEventListener('click', check_cell, false);

            // Добавляем таблице обработчик правого клика
            current_cell.oncontextmenu = function() {place_flag(this); return false;};

            // Добавляем ячейке координаты
            current_cell.id = i + '_' + j + '_' + rows + '_' + cols;
        }
    }

    document.getElementById('flags').innerHTML = flags;
}

// Функция для вывода сообщения для пользователей IE
function check_browser() {
    /*@cc_on
        @if (@_jscript)
            // Этот блок кода находится внутри условного комментария, 
            // который также является обычным JavaScriptt-комментарием. В IE этот блок
            // будет выполнен, а в других броузерах нет.
            alert('Вы пользуетесь Internet Explorer');
            alert('Используйте, пожалуйста, другой браузер, поскольку работа в IE не гарантируется');
        @else*/
        /*@end
    @*/
}

// Функция для получения текущих настроек поля
function change_settings() {
    var form_data = document.forms.settings;

    // Проверяем, который из пунктов выбран
    if (form_data.diff.value == "custom") {
        // Делаем соответствующие поля активными
        document.getElementById('rows').disabled = false;
        document.getElementById('cols').disabled = false;
        document.getElementById('bombs').disabled = false;
    }
    else {
        // Делаем соответствующие поля неактивными
        document.getElementById('rows').disabled = true;
        document.getElementById('cols').disabled = true;
        document.getElementById('bombs').disabled = true;
    }
}
