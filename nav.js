 // ================= НАВИГАЦИЯ =================
(function () {
    'use strict';

    function navInit() {
        const nav = document.querySelector('header nav');
        if (!nav) return;

        const ul = nav.querySelector('ul');
        if (!ul) return;

        let indicator = ul.querySelector('.nav-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'nav-indicator';
            ul.appendChild(indicator);
        }

        const links = Array.from(ul.querySelectorAll('a'));
        const active = findActiveLink(links);

        links.forEach(l => l.classList.remove('active'));
        if (active) active.classList.add('active');

        updateIndicator(active, indicator);

        links.forEach(l => {
            l.addEventListener('mouseenter', () => updateIndicator(l, indicator));
            l.addEventListener('mouseleave', () => updateIndicator(findActiveLink(links), indicator));
        });

        window.addEventListener('resize', () =>
            updateIndicator(findActiveLink(links), indicator)
        );
    }

    function findActiveLink(links) {
        const current = location.pathname;

        return links.find(a =>
            current.includes(a.getAttribute('href'))
        ) || links[0] || null;
    }


    function updateIndicator(link, indicator) {
        if (!indicator || !link) {
            if (indicator) indicator.style.width = '0px';
            return;
        }

        const rect = link.getBoundingClientRect();
        const ulRect = link.closest('ul').getBoundingClientRect();

        const left = rect.left - ulRect.left + (rect.width - Math.min(80, rect.width)) / 2;

        indicator.style.left = left + 'px';
        indicator.style.width = Math.min(80, rect.width) + 'px';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', navInit);
    } else {
        navInit();
    }

})();


// ================= ИГРА =================
(function () {
    'use strict';

    function rand(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // ===== КАРТОЧКИ (ПОЛНАЯ ВЕРСИЯ) =====
    const cards = {
        profession: [
            "Врач", "Инженер", "Программист", "Учитель", "Повар",
            "Военный", "Психолог", "Строитель", "Фермер", "Химик",
            "Биолог", "Пилот", "Полицейский", "Актёр", "Музыкант",
            "Журналист", "Механик", "Электрик", "Дизайнер", "Спасатель"
        ],

        health: [
            "Полностью здоров", "Астма", "Диабет", "Сломанная рука",
            "Аллергия", "Плохое зрение", "Глухота", "Выносливый",
            "Слабый иммунитет", "Проблемы с сердцем",
            "Отличная форма", "Усталость", "Ожирение", "Недовес",
            "Быстрое восстановление", "Бессонница", "Панические атаки",
            "Плохая координация", "Регенерация", "Сильный организм"
        ],

        phobia: [
            "Нет", "Темнота", "Клаустрофобия", "Пауки", "Высота",
            "Социофобия", "Вода", "Огонь", "Кровь", "Шум",
            "Одиночество", "Болезни", "Животные", "Замкнутое пространство",
            "Смерть", "Люди", "Холод", "Жара", "Темные места", "Нет страха"
        ],

        biology: [
            "18 лет", "25 лет", "30 лет", "35 лет", "40 лет",
            "45 лет", "50 лет", "55 лет", "60 лет", "65 лет",
            "70 лет", "Подросток", "Пожилой", "В отличной форме",
            "Слабый организм", "Способен к размножению",
            "Не способен", "Спортсмен", "Курящий", "Не курит"
        ],

        baggage: [
            "Аптечка", "Пистолет", "Нож", "Рация", "Фонарик",
            "Еда", "Вода", "Инструменты", "Верёвка", "Одеяло",
            "Карта", "Компас", "Солнечная панель", "Ноутбук",
            "Книга", "Семена", "Медикаменты", "Костюм", "Рюкзак", "Набор ремонта"
        ],

            mentalHealth: [
                "Стабильная психика", "Агрессия", "Депрессия", "Панические атаки",
                "Шизофрения", "Паранойя", "Стрессоустойчивый", "Социопат",
                "Тревожный", "Хладнокровный", "Импульсивный", "Нестабильный",
                "Оптимист", "Пессимист", "Уравновешенный", "Раздражительный",
                "Замкнутый", "Общительный", "Усталость", "Нервный"
            ]
    };

    // ===== СПОСОБНОСТИ (ПОЛНЫЕ) =====
    const abilities = {
        "Врач": ["Лечение", "Операции"],
        "Инженер": ["Ремонт", "Конструирование"],
        "Программист": ["Логика", "Взлом"],
        "Учитель": ["Обучение", "Коммуникация"],
        "Повар": ["Готовка", "Рацион"],
        "Военный": ["Тактика", "Бой"],
        "Психолог": ["Успокоение", "Манипуляция"],
        "Строитель": ["Строительство", "Укрепление"],
        "Фермер": ["Выращивание", "Растения"],
        "Химик": ["Химия", "Анализ"],
        "Биолог": ["Исследование", "Лекарства"],
        "Пилот": ["Навигация", "Управление"],
        "Полицейский": ["Контроль", "Допрос"],
        "Актёр": ["Имитация", "Обман"],
        "Музыкант": ["Мораль", "Концентрация"],
        "Журналист": ["Информация", "Анализ"],
        "Механик": ["Ремонт", "Сборка"],
        "Электрик": ["Электрика", "Сети"],
        "Дизайнер": ["Проектирование", "Оптимизация"],
        "Спасатель": ["Спасение", "Первая помощь"]
    };

    const catastrophe = [
        "Ядерная война", "Зомби вирус", "Радиация", "Астероид", "ИИ захватил мир"
    ];

    const bunker = {
        size: ["50 м²", "100 м²", "200 м²", "500 м²"],
        food: ["Нет еды", "Мало еды", "Средний запас", "Много еды"],
        water: ["Нет воды", "Мало воды", "Средний запас", "Много воды"]
    };

    const gameState = {
        catastrophe: rand(catastrophe),
        bunker: {
            size: rand(bunker.size),
            food: rand(bunker.food),
            water: rand(bunker.water)
        }
    };

    const endings = Array.from({ length: 80 }, (_, i) => ({
        text: `Исход ${i + 1}`,
        type: i < 20 ? "bad" : i < 50 ? "medium" : "good"
    }));

    function generateCharacter() {
        const profession = rand(cards.profession);
        return {
            profession,
            health: rand(cards.health),
            phobia: rand(cards.phobia),
            biology: rand(cards.biology),
            baggage: rand(cards.baggage),
            mentalHealth: rand(cards.mentalHealth),
            abilities: abilities[profession]
        };
    }

    const players = [];

    function addPlayer(name) {
        const p = {
            name: String(name || "Игрок"),
            cards: generateCharacter(),
            alive: true
        };
        players.push(p);
        return p;
    }

    function calculateEnding() {
        const alive = players.filter(p => p.alive);
        if (!alive.length) return "Все погибли";

        let score = 0;

        for (let p of alive) {
            score += p.cards.health.includes("здоров") ? 2 : -1;

            if (p.cards.mentalHealth.includes("Стабильная"))
                score += 2;
            else
                score += Math.random() < 0.5 ? 1 : -2;

            score += p.cards.phobia === "Нет" ? 1 : -1;
            score += p.cards.biology.includes("Спортсмен") ? 1 : -1;

            const bag = p.cards.baggage;

            if (bag.includes("Аптечка") || bag.includes("Медикаменты")) score += 2;
            else if (bag.includes("Еда") || bag.includes("Вода")) score += 1;
            else score -= 0.5;

            const ab = p.cards.abilities.join(" ");
            if (ab.includes("Лечение")) score += 2;
            if (ab.includes("Ремонт")) score += 1;
            if (ab.includes("Выращивание")) score += 2;
            if (ab.includes("Тактика")) score += 1;
        }

        const b = gameState.bunker;

        if (b.size.includes("500")) score += 2;
        else if (b.size.includes("50")) score -= 1;

        if (b.food.includes("Много")) score += 2;
        else if (b.food.includes("Нет")) score -= 2;

        if (b.water.includes("Много")) score += 2;
        else if (b.water.includes("Нет")) score -= 2;

        const c = gameState.catastrophe;

        if (c.includes("Ядерная") || c.includes("Радиация")) score -= 1;
        if (c.includes("Зомби") && alive.length < 3) score -= 2;
        if (c.includes("Астероид")) score += 1;

        const type = score >= 8 ? "good" : score >= 2 ? "medium" : "bad";

        return rand(endings.filter(e => e.type === type)).text;
    }

    window.BunkerGame = {
        addPlayer,
        calculateEnding,
        players,
        gameState
    };

})();
// ================= НАВИГАЦИЯ =================
(function () {
    'use strict';

    function navInit() {
        const nav = document.querySelector('header nav');
        if (!nav) return;

        const ul = nav.querySelector('ul');
        if (!ul) return;

        let indicator = ul.querySelector('.nav-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'nav-indicator';
            ul.appendChild(indicator);
        }

        const links = Array.from(ul.querySelectorAll('a'));
        const active = findActiveLink(links);

        links.forEach(l => l.classList.remove('active'));
        if (active) active.classList.add('active');

        updateIndicator(active, indicator);

        links.forEach(l => {
            l.addEventListener('mouseenter', () => updateIndicator(l, indicator));
            l.addEventListener('mouseleave', () => updateIndicator(findActiveLink(links), indicator));
        });

        window.addEventListener('resize', () =>
            updateIndicator(findActiveLink(links), indicator)
        );
    }

    function findActiveLink(links) {
        const current = location.pathname;

        return links.find(a =>
            current.includes(a.getAttribute('href'))
        ) || links[0] || null;
    }


    function updateIndicator(link, indicator) {
        if (!indicator || !link) {
            if (indicator) indicator.style.width = '0px';
            return;
        }

        const rect = link.getBoundingClientRect();
        const ulRect = link.closest('ul').getBoundingClientRect();

        const left = rect.left - ulRect.left + (rect.width - Math.min(80, rect.width)) / 2;

        indicator.style.left = left + 'px';
        indicator.style.width = Math.min(80, rect.width) + 'px';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', navInit);
    } else {
        navInit();
    }

})();


// ================= ИГРА =================
(function () {
    'use strict';

    function rand(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // ===== КАРТОЧКИ (ПОЛНАЯ ВЕРСИЯ) =====
    const cards = {
        profession: [
            "Врач", "Инженер", "Программист", "Учитель", "Повар",
            "Военный", "Психолог", "Строитель", "Фермер", "Химик",
            "Биолог", "Пилот", "Полицейский", "Актёр", "Музыкант",
            "Журналист", "Механик", "Электрик", "Дизайнер", "Спасатель"
        ],

        health: [
            "Полностью здоров", "Астма", "Диабет", "Сломанная рука",
            "Аллергия", "Плохое зрение", "Глухота", "Выносливый",
            "Слабый иммунитет", "Проблемы с сердцем",
            "Отличная форма", "Усталость", "Ожирение", "Недовес",
            "Быстрое восстановление", "Бессонница", "Панические атаки",
            "Плохая координация", "Регенерация", "Сильный организм"
        ],

        phobia: [
            "Нет", "Темнота", "Клаустрофобия", "Пауки", "Высота",
            "Социофобия", "Вода", "Огонь", "Кровь", "Шум",
            "Одиночество", "Болезни", "Животные", "Замкнутое пространство",
            "Смерть", "Люди", "Холод", "Жара", "Темные места", "Нет страха"
        ],

        biology: [
            "18 лет", "25 лет", "30 лет", "35 лет", "40 лет",
            "45 лет", "50 лет", "55 лет", "60 лет", "65 лет",
            "70 лет", "Подросток", "Пожилой", "В отличной форме",
            "Слабый организм", "Способен к размножению",
            "Не способен", "Спортсмен", "Курящий", "Не курит"
        ],

        baggage: [
            "Аптечка", "Пистолет", "Нож", "Рация", "Фонарик",
            "Еда", "Вода", "Инструменты", "Верёвка", "Одеяло",
            "Карта", "Компас", "Солнечная панель", "Ноутбук",
            "Книга", "Семена", "Медикаменты", "Костюм", "Рюкзак", "Набор ремонта"
        ],

            mentalHealth: [
                "Стабильная психика", "Агрессия", "Депрессия", "Панические атаки",
                "Шизофрения", "Паранойя", "Стрессоустойчивый", "Социопат",
                "Тревожный", "Хладнокровный", "Импульсивный", "Нестабильный",
                "Оптимист", "Пессимист", "Уравновешенный", "Раздражительный",
                "Замкнутый", "Общительный", "Усталость", "Нервный"
            ]
    };

    // ===== СПОСОБНОСТИ (ПОЛНЫЕ) =====
    const abilities = {
        "Врач": ["Лечение", "Операции"],
        "Инженер": ["Ремонт", "Конструирование"],
        "Программист": ["Логика", "Взлом"],
        "Учитель": ["Обучение", "Коммуникация"],
        "Повар": ["Готовка", "Рацион"],
        "Военный": ["Тактика", "Бой"],
        "Психолог": ["Успокоение", "Манипуляция"],
        "Строитель": ["Строительство", "Укрепление"],
        "Фермер": ["Выращивание", "Растения"],
        "Химик": ["Химия", "Анализ"],
        "Биолог": ["Исследование", "Лекарства"],
        "Пилот": ["Навигация", "Управление"],
        "Полицейский": ["Контроль", "Допрос"],
        "Актёр": ["Имитация", "Обман"],
        "Музыкант": ["Мораль", "Концентрация"],
        "Журналист": ["Информация", "Анализ"],
        "Механик": ["Ремонт", "Сборка"],
        "Электрик": ["Электрика", "Сети"],
        "Дизайнер": ["Проектирование", "Оптимизация"],
        "Спасатель": ["Спасение", "Первая помощь"]
    };

    const catastrophe = [
        "Ядерная война", "Зомби вирус", "Радиация", "Астероид", "ИИ захватил мир"
    ];

    const bunker = {
        size: ["50 м²", "100 м²", "200 м²", "500 м²"],
        food: ["Нет еды", "Мало еды", "Средний запас", "Много еды"],
        water: ["Нет воды", "Мало воды", "Средний запас", "Много воды"]
    };

    const gameState = {
        catastrophe: rand(catastrophe),
        bunker: {
            size: rand(bunker.size),
            food: rand(bunker.food),
            water: rand(bunker.water)
        }
    };

    const endings = Array.from({ length: 80 }, (_, i) => ({
        text: `Исход ${i + 1}`,
        type: i < 20 ? "bad" : i < 50 ? "medium" : "good"
    }));

    function generateCharacter() {
        const profession = rand(cards.profession);
        return {
            profession,
            health: rand(cards.health),
            phobia: rand(cards.phobia),
            biology: rand(cards.biology),
            baggage: rand(cards.baggage),
            mentalHealth: rand(cards.mentalHealth),
            abilities: abilities[profession]
        };
    }

    const players = [];

    function addPlayer(name) {
        const p = {
            name: String(name || "Игрок"),
            cards: generateCharacter(),
            alive: true
        };
        players.push(p);
        return p;
    }

    function calculateEnding() {
        const alive = players.filter(p => p.alive);
        if (!alive.length) return "Все погибли";

        let score = 0;

        for (let p of alive) {
            score += p.cards.health.includes("здоров") ? 2 : -1;

            if (p.cards.mentalHealth.includes("Стабильная"))
                score += 2;
            else
                score += Math.random() < 0.5 ? 1 : -2;

            score += p.cards.phobia === "Нет" ? 1 : -1;
            score += p.cards.biology.includes("Спортсмен") ? 1 : -1;

            const bag = p.cards.baggage;

            if (bag.includes("Аптечка") || bag.includes("Медикаменты")) score += 2;
            else if (bag.includes("Еда") || bag.includes("Вода")) score += 1;
            else score -= 0.5;

            const ab = p.cards.abilities.join(" ");
            if (ab.includes("Лечение")) score += 2;
            if (ab.includes("Ремонт")) score += 1;
            if (ab.includes("Выращивание")) score += 2;
            if (ab.includes("Тактика")) score += 1;
        }

        const b = gameState.bunker;

        if (b.size.includes("500")) score += 2;
        else if (b.size.includes("50")) score -= 1;

        if (b.food.includes("Много")) score += 2;
        else if (b.food.includes("Нет")) score -= 2;

        if (b.water.includes("Много")) score += 2;
        else if (b.water.includes("Нет")) score -= 2;

        const c = gameState.catastrophe;

        if (c.includes("Ядерная") || c.includes("Радиация")) score -= 1;
        if (c.includes("Зомби") && alive.length < 3) score -= 2;
        if (c.includes("Астероид")) score += 1;

        const type = score >= 8 ? "good" : score >= 2 ? "medium" : "bad";

        return rand(endings.filter(e => e.type === type)).text;
    }

    window.BunkerGame = {
        addPlayer,
        calculateEnding,
        players,
        gameState
    };

})();
