// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector(".fruits__list"); // список карточек
const shuffleButton = document.querySelector(".shuffle__btn"); // кнопка перемешивания
const filterButton = document.querySelector(".filter__btn"); // кнопка фильтрации
const sortKindLabel = document.querySelector(".sort__kind"); // поле с названием сортировки
const sortTimeLabel = document.querySelector(".sort__time"); // поле с временем сортировки
const sortChangeButton = document.querySelector(".sort__change__btn"); // кнопка смены сортировки
const sortActionButton = document.querySelector(".sort__action__btn"); // кнопка сортировки
const kindInput = document.querySelector(".kind__input"); // поле с названием вида
const colorInput = document.querySelector(".color__input"); // поле с названием цвета
const minWeightInput = document.querySelector(".minweight__input"); // поле с минимальным весом
const maxWeightInput = document.querySelector(".maxweight__input"); // поле с максимальным весом
const addActionButton = document.querySelector(".add__action__btn"); // кнопка добавления
const weightInput = document.querySelector(".weight__input"); // поле с весом

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// объект маппинга цвет: класс
const colorMapping = {
  "фиолетовый": "fruit__item--violet",
  "зеленый": "fruit__item--green",
  "розово-красный": "fruit__item--carmazin",
  "желтый": "fruit__item--yellow",
  "светло-коричневый": "fruit__item--lightbrown",
  "красный": "fruit__item--red",
  "оранжевый": "fruit__item--orange",
};

const priority = ["красный", "розово-красный", "оранжевый", "желтый", "зеленый", "фиолетовый", "светло-коричневый"];
// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// Создание li элемента для каждого фрукта
const fruitItemGenerator = (container = fruitsList, fruitOBJ, colorMapping) => {
  const fruitItem = document.createElement("li");
  fruitItem.className = `fruit__item ${colorMapping[fruitOBJ.color]}`;

  const fruitInfo = document.createElement("div");
  fruitInfo.className = "fruit__info";

  const fruitIndex = document.createElement("div");
  fruitIndex.textContent = `index: ${fruitOBJ.index}`;

  const fruitKind = document.createElement("div");
  fruitKind.textContent = `kind: ${fruitOBJ.kind}`;

  const fruitColor = document.createElement("div");
  fruitColor.textContent = `color: ${fruitOBJ.color}`;

  const fruitWeight = document.createElement("div");
  fruitWeight.textContent = `weight (кг): ${fruitOBJ.weight}`;

  fruitInfo.appendChild(fruitIndex);
  fruitInfo.appendChild(fruitKind);
  fruitInfo.appendChild(fruitColor);
  fruitInfo.appendChild(fruitWeight);

  fruitItem.appendChild(fruitInfo);

  container.appendChild(fruitItem);
};

// Функция - генератор для выдачи объекта - фрукта по одному
function* fruitGenerator(fruits = fruits) {
  for (let i = 0; i < fruits.length; i++) {
    yield { index: i, ...fruits[i] };
  }
}

// отрисовка карточек
const display = (
  fruits = fruits,
  container = fruitsList,
  colorMapping = colorMapping,
  callback = fruitItemGenerator,
) => {
  container.innerHTML = "";
  const fruitGen = fruitGenerator(fruits);
  let genResult = fruitGen.next();
  while (!genResult.done) {
    callback(container, genResult.value, colorMapping);
    genResult = fruitGen.next();
  }
};

// первая отрисовка карточек
display(fruits, fruitsList, colorMapping, fruitItemGenerator);

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = (arr) => {
  let result = [];
  let fruits = [...arr];
  if (fruits.length <= 1) {
    alert("Массив пуст или слишком мал");
    return;
  }

  while (fruits.length > 0) {
    const randomIndex = getRandomInt(0, fruits.length - 1);
    result.push(fruits.splice(randomIndex, 1)[0]);
  }

  if (JSON.stringify(arr) !== JSON.stringify(result)) {
    return result;
  }
  alert("Порядок не изменился!");
  return arr;
};

shuffleButton.addEventListener("click", () => {
  fruits = shuffleFruits(fruits);
  display(fruits, fruitsList, colorMapping, fruitItemGenerator);
});

/*** ВАЛИДАЦИЯ ПОЛЕЙ ***/

// Объект с сообщениями для валидации полей
const fieldMessages = {
  required: (name) => `Поле "${name}" обязательно для заполнения`,
  isNumber: (name) => `Поле "${name}" должно быть числом`,
  validWeightRange: () =>
    `Минимальный вес должен быть меньше или равен максимальному`,
  validWeightValues: () => `Вес не может быть отрицательным`,
};

// Правила валидации для всех полей
const rulesCommon = {
  required: (value) => value.trim() !== "",
  isNumber: (value) => !isNaN(Number(value)),
};

// Правила валидации для веса max min
const weightRules = {
  validWeightRange: (minWeight, maxWeight) =>
    Number(minWeight) <= Number(maxWeight),
  validWeightValues: (minWeight, maxWeight) =>
    Number(minWeight) >= 0 && Number(maxWeight) >= 0,
};

const fieldRules = {
  kind: [
    {
      check: rulesCommon.required,
      message: fieldMessages.required("kind"),
    },
  ],

  color: [
    {
      check: rulesCommon.required,
      message: fieldMessages.required("color"),
    },
  ],

  weight: [
    {
      check: rulesCommon.required,
      message: fieldMessages.required("weight"),
    },
    {
      check: rulesCommon.isNumber,
      message: fieldMessages.isNumber("weight"),
    },
  ],
};
// Контроллер валидации
const validationController = {
  validate(rules, ...values) {
    for (const rule of rules) {
      if (!rule.check(...values)) {
        alert(rule.message);
        return false;
      }
    }
    return true;
  },
};
// Контроллер фильтрации
const filterContoller = {
  validate(minWeight, maxWeight) {
    const rules = [
      {
        check: (minWeight, maxWeight) =>
          rulesCommon.required(minWeight) && rulesCommon.required(maxWeight),
        message: fieldMessages.required("minWeight или maxWeight"),
      },
      {
        check: (minWeight, maxWeight) =>
          rulesCommon.isNumber(minWeight) && rulesCommon.isNumber(maxWeight),
        message: fieldMessages.isNumber("minWeight или maxWeight"),
      },
      {
        check: (minWeight, maxWeight) =>
          weightRules.validWeightRange(minWeight, maxWeight),
        message: fieldMessages.validWeightRange(),
      },
      {
        check: (minWeight, maxWeight) =>
          weightRules.validWeightValues(minWeight, maxWeight),
        message: fieldMessages.validWeightValues(),
      },
    ];

    return validationController.validate(rules, minWeight, maxWeight);
  },
};

// Контроллер добавления
const addController = {
  validate() {
    const rules = [
      {
        check: () => rulesCommon.required(kindInput.value),
        message: fieldMessages.required("kind"),
      },
      {
        check: () => rulesCommon.required(colorInput.value),
        message: fieldMessages.required("color"),
      },
      {
        check: () => rulesCommon.required(weightInput.value),
        message: fieldMessages.required("weight"),
      },
      {
        check: () => rulesCommon.isNumber(weightInput.value),
        message: fieldMessages.isNumber("weight"),
      },
      {
        check: () =>
          weightRules.validWeightValues(weightInput.value, weightInput.value),
        message: fieldMessages.validWeightValues(),
      },
    ];
    return validationController.validate(rules);
  },
};

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = (fruits = fruits, minWeight, maxWeight) => {
  return fruits.filter(
    (item) =>
      item.weight >= Number(minWeight) && item.weight <= Number(maxWeight),
  );
};

filterButton.addEventListener("click", () => {
  const minWeight = minWeightInput.value;
  const maxWeight = maxWeightInput.value;

  if (!filterContoller.validate(minWeight, maxWeight)) return;

  fruits = filterFruits(fruits, minWeight, maxWeight);
  display(fruits, fruitsList, colorMapping, fruitItemGenerator);
});

/*** СОРТИРОВКА ***/
const comparationColor = (a, b) => priority.indexOf(a.color) - priority.indexOf(b.color);

const sortAPI = {
  sortsArray: [
    {
      name: "bubbleSort",
      sort: (arr, comparation = comparationColor) => {
        let flag = false;
        for (let i = 0, l = arr.length - 1; i < l; i++) {
          flag = false;
          for (let j = 0; j < l - i; j++) {
            if (comparation(arr[j], arr[j + 1]) > 0) {
              [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
              flag = true;
            }
          }
          if (!flag) {
            break;
          }
        }
        return arr;
      },
    },
    {
      name: "quickSort",
      sort: (
        arr,
        comparation = comparationColor,
      ) => {
        function partition(low, high) {
          const pivotIndex = Math.floor(Math.random() * (high - low + 1)) + low;
          // Перемещаем pivot в конец, чтобы не мешался
          [arr[pivotIndex], arr[high]] = [arr[high], arr[pivotIndex]];
          const pivotValue = arr[high];
          let i = low - 1;

          for (let j = low; j < high; j++) {
            if (comparation(arr[j], pivotValue) < 0) {
              i++;
              [arr[i], arr[j]] = [arr[j], arr[i]];
            }
          }
          // Ставим pivot на правильное место (между меньшими и большими)
          [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
          return i + 1;
        }

        function sort(low = 0, high = arr.length - 1) {
          if (low < high) {
            const pivotIndex = partition(low, high);
            sort(low, pivotIndex - 1);
            sort(pivotIndex + 1, high);
          }
        }

        sort();
        return arr;
      },
    },
  ],

  sortTime: "-",

  // выполняет сортировку и производит замер времени
  startSort: function (sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    this.sortTime = `${end - start} ms`;
  },

  currentSortIndex: 0,

  nextSort: function () {
    this.currentSortIndex =
      (this.currentSortIndex + 1) % this.sortsArray.length;
  },
};

//Отрисовка сортировки
function sortDisplay(sortAPI, arr = fruits) {
  const currentSort = sortAPI.sortsArray[sortAPI.currentSortIndex];
  sortKindLabel.textContent = currentSort.name;
}

// Отрисовка времени сортировки и выполнение сортировки
function sortTimeDisplay(sortAPI, arr = fruits, comparation) {
  const currentSort = sortAPI.sortsArray[sortAPI.currentSortIndex];
  sortAPI.startSort(currentSort.sort, arr, comparation);
  sortTimeLabel.textContent = sortAPI.sortTime;
}

// инициализация полей
sortKindLabel.textContent = sortAPI.sortsArray[sortAPI.currentSortIndex].name;
sortTimeLabel.textContent = sortAPI.sortTime;

// Обработчик смены сортировки
sortChangeButton.addEventListener("click", () => {
  sortAPI.nextSort();
  sortDisplay(sortAPI, fruits);
});

// Обработчик сортировки
sortActionButton.addEventListener("click", () => {
  sortTimeDisplay(sortAPI, fruits);
  display(fruits, fruitsList, colorMapping, fruitItemGenerator);
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener("click", () => {
  if (!addController.validate()) return;
  const newFruit = {
    kind: kindInput.value,
    color: colorInput.value,
    weight: Number(weightInput.value),
  };
  fruits.push(newFruit);
  display(fruits, fruitsList, colorMapping, fruitItemGenerator);
});
