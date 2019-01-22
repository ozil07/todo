// Task constructor
function Task(textTask, date, desc) {
	this.text = textTask;
	this.date = date;
	this.descriptionTask = desc;
	this.taskID = Task.prototype.myStorage.taskID;
	this.state = 2;
	this.delete = false;

	Task.prototype.myStorage.taskID++;
}

Task.prototype = Object.create(null);
Task.prototype.constructor = Task;
Task.prototype.myStorage = localStorage;
Task.prototype.myStorage.taskID = 1;
if (!Task.prototype.myStorage.taskID) Task.prototype.myStorage.taskID = 1;





// Todo constructor

function Todo() { }

Todo.prototype = Object.create(Task.prototype);
Todo.prototype.constructor = Todo;
Todo.prototype.myStorage = localStorage;
if (!Todo.prototype.myStorage.tasks) Todo.prototype.myStorage.tasks = '';


// Функция добавления задач
Todo.prototype.addTask = function addTask() {

	// Получаем данные от пользователя
	let textTask = prompt('Что нужно выполнить?', ''),
		date = prompt('Крайний срок выполнения \nВведите дату в формате 31.12.2019', ''),
		descriptionTask = prompt('Пояснение к задаче', '');


	// Если пользователь не ввел данные, сообщаем ему об этом
	if (!textTask) {
		let danger = confirm('Вы не заполнили поле с текстом задачи');

		if (danger) {
			addTask();
		}

		return;
	}

	// Создаем задачу
	let task = new Task(textTask, date, descriptionTask);

	// Проверяем  есть ли данные по задачам, если нет создаем иначе прибавляем к уже имеющимся

	Todo.prototype.myStorage.tasks ? Todo.prototype.myStorage.tasks += ',' + JSON.stringify(task) : Todo.prototype.myStorage.tasks = JSON.stringify(task);



	let tasks = JSON.parse(`[${Todo.prototype.myStorage.tasks}]`).reverse();

	Todo.prototype.changeStorage(tasks);
	Todo.prototype.outputNewTask(task);

}
// Удаляет задачу
Todo.prototype.deleteTask = function (e) {

	if (e.target.tagName != 'I' || e.target.classList.contains('edit')) return;

	let taskID = e.target.getAttribute('data-task-id'),
		tasks = JSON.parse(`[${Todo.prototype.myStorage.tasks}]`).reverse(),
		taskItemDelete = document.querySelector(`[data-task-id="${taskID}"]`);

	for (let i = 0; i < tasks.length; i++) {
		if (tasks[i].taskID == taskID) {
			tasks[i]['delete'] = true;

			tasks.splice(i, 1);

			break;
		}
	}


	taskItemDelete.style.marginBottom = 0;
	taskItemDelete.style.height = '0px';
	taskItemDelete.style.minHeight = '0px';

	setTimeout(() => {
		taskItemDelete.remove();
	}, 2000);


	Todo.prototype.changeStorage(tasks);
}

// Редактирует задачу
Todo.prototype.editTask = function (e) {

	if (e.target.tagName != 'I' || e.target.classList.contains('bin')) return;

	let taskID = e.target.getAttribute('data-task-id'),
		tasks = JSON.parse(`[${Todo.prototype.myStorage.tasks}]`).reverse(),
		taskItemEdit = document.querySelector(`[data-task-id="${taskID}"]`);

	for (let i = 0; i < tasks.length; i++) {

		if (tasks[i].taskID == taskID) {

			let tasksText = prompt('Заголовок задачи', tasks[i].text),
				taskDate = prompt('Крайний срок выполнения задачи', tasks[i].date),
				taskDesc = prompt('Пояснения к задаче', tasks[i].descriptionTask);

			tasks[i].text = tasksText;
			tasks[i].date = taskDate;
			tasks[i].descriptionTask = taskDesc;

			taskItemEdit.querySelector('p').textContent = tasksText;
			taskItemEdit.querySelector('.task__create__date').textContent = taskDate;

		}
	}


	Todo.prototype.changeStorage(tasks);
}

// Выводит список задач
Todo.prototype.render = function () {


	// Посчтитать количество задач
	this.countTask();

	// Получаем список задач
	let tasks = JSON.parse(`[${Todo.prototype.myStorage.tasks}]`).reverse(),
		taskContiner = document.querySelector('.tasks'),
		fragment = document.createDocumentFragment();


	// Проходимся по массиву со всеми задачами
	for (let i = 0; i < tasks.length; i++) {

		let taskItem = document.createElement('div'), // Блок задачи
			labelContainer = document.createElement('div'), // Контейнер для чекбокса
			сontextualLinks = document.createElement('div'), // Контейнер для чекбокса
			taskContentContainer = document.createElement('div'), // Контейнер для чекбокса
			taskText = document.createElement('p'), // Текст задачи
			taskCheck = document.createElement('input'),
			taskLabel = document.createElement('label'),
			taskDate = document.createElement('span'),
			deleteBtnTask = document.createElement('i'),
			editBtnTask = document.createElement('i');


		// Контейнер для задачи 
		taskItem.classList.add('task');
		taskItem.setAttribute('data-task-state', tasks[i].state);
		taskItem.setAttribute('data-task-id', tasks[i].taskID);


		// Edit btn task
		editBtnTask.className = 'icon edit';
		editBtnTask.title = 'Редактировать задачу';
		editBtnTask.setAttribute('data-task-id', tasks[i].taskID);

		// Delete btn task
		deleteBtnTask.className = 'icon bin';
		deleteBtnTask.title = 'Удалить задачу';
		deleteBtnTask.setAttribute('data-task-id', tasks[i].taskID);

		// Block Contextual Links
		сontextualLinks.className = 'сontextual__links';
		сontextualLinks.append(deleteBtnTask, editBtnTask);


		// Изменяем чекбокс
		taskCheck.type = 'checkbox';
		taskCheck.id = tasks[i].taskID;
		taskCheck.classList.add('task__ckeckbox');

		if (tasks[i].state == 1) taskCheck.checked = true;

		// Изменяем label
		labelContainer.classList.add('label__container');
		taskLabel.htmlFor = tasks[i].taskID;
		labelContainer.append(taskLabel);

		// Добавялем заголовок задачи
		taskText.innerHTML = tasks[i].text;

		// Блок с датой создания задачи
		taskDate.classList.add('task__create__date');
		taskDate.innerHTML = tasks[i].date;


		// Содержимое задачи
		taskContentContainer.className = 'task__content';
		taskContentContainer.append(taskText, taskDate);


		taskItem.append(taskCheck, labelContainer, taskContentContainer, сontextualLinks);


		fragment.append(taskItem);
	}


	taskContiner.innerHTML = '';
	taskContiner.append(fragment);


	// Сохраним массив с объектами в прототип
	Todo.prototype.tasks = tasks.slice();

}

// Задача выполнена
Todo.prototype.taskDone = function (e) {

	let tasks = document.querySelector('.tasks');

	if (e.target.tagName != 'LABEL') return;

	let checkbox = e.target.parentElement.previousElementSibling;


	Todo.prototype.changeState(checkbox);
	setTimeout(() => {
		Todo.prototype.countTask();
	}, 250);
}

// Изменяет состояние задачи по клику на чекбокс
Todo.prototype.changeState = function (element) {

	let taskState = element.parentElement.dataset.taskState,
		taskId = element.parentElement.dataset.taskId,
		tasks = Todo.prototype.tasks;


	if (!element.checked) {
		setTimeout(() => {
			element.parentElement.dataset.taskState = 1;
		}, 250);

	} else {
		setTimeout(() => {
			element.parentElement.dataset.taskState = 2;
		}, 250);
	}


	setTimeout(() => {
		for (let i = 0; i < tasks.length; i++) {
			if (tasks[i].taskID == taskId) tasks[i].state = element.parentElement.dataset.taskState;
		}

		// Обновить хранилище с задачами
		Todo.prototype.changeStorage(tasks);
	}, 250);
}

// Считает количество задач
Todo.prototype.countTask = function () {
	let all = document.querySelector('.tasks__all'),
		progress = document.querySelector('.tasks__in__progress'),
		complete = document.querySelector('.tasks__complete'),
		failed = document.querySelector('.tasks__failed'),
		tasks = JSON.parse(`[${Todo.prototype.myStorage.tasks}]`),
		allCount = 0,
		progressCount = 0,
		completeCount = 0,
		failedCount = 0;


	for (let i = 0; i < tasks.length; i++) {
		if (tasks[i].state == 1) completeCount++;
		if (tasks[i].state == 2) progressCount++;
		if (tasks[i].state == 0) failedCount++;

		allCount++;
	}

	all.innerHTML = `Всего (${allCount})`;
	progress.innerHTML = `В процессе (${progressCount})`;
	complete.innerHTML = `Выполнено (${completeCount})`;
	failed.innerHTML = `Просроченно (${failedCount})`;


	return this;
}

// Изменяет состояние у просроченной задачи
Todo.prototype.taskFailed = function () {

	// Получаем список задач
	let tasks = JSON.parse(`[${Todo.prototype.myStorage.tasks}]`).reverse();

	// Проходим по списку
	for (let i = 0; i < tasks.length; i++) {
		// Узнаем дату создания задачи
		let dateCreateTask = tasks[i].date.split('.').reverse(),
			currentDate = new Date(), // Узнаем текущую дату
			taskFinishDate = new Date(dateCreateTask[0], dateCreateTask[1] - 1, dateCreateTask[2]);


		// Сравниваем дату создания задачи с текущей датой и проверяем прошло ли ее время
		if (Array.isArray(dateCreateTask) && taskFinishDate.getFullYear) {
			if ((taskFinishDate - currentDate) <= 0) {
				tasks[i].state = 0;
			}
		}
	}

	// Обновить хранилище
	Todo.prototype.changeStorage(tasks);
}

// Обновляет хранилище
Todo.prototype.changeStorage = function (tasks) {

	tasks.reverse();

	let data = JSON.stringify(tasks).slice(1, -1);
	Todo.prototype.myStorage.tasks = data;


	this.countTask();

	return this;
}

// Вывод новой задачи 
Todo.prototype.outputNewTask = function (task) {

	let tasksContainer = document.querySelector('.tasks'), // Get container in tasks
		taskItem = document.createElement('div'), // Блок задачи
		labelContainer = document.createElement('div'), // Контейнер для чекбокса
		сontextualLinks = document.createElement('div'), // Контейнер для чекбокса
		taskContentContainer = document.createElement('div'), // Контейнер для чекбокса
		taskText = document.createElement('p'), // Текст задачи
		taskCheck = document.createElement('input'),
		taskLabel = document.createElement('label'),
		taskDate = document.createElement('span'),
		deleteBtnTask = document.createElement('i'),
		editBtnTask = document.createElement('i');


	// Контейнер для задачи 
	taskItem.classList.add('task');
	taskItem.setAttribute('data-task-state', task.state);
	taskItem.setAttribute('data-task-id', task.taskID);


	// Edit btn task
	editBtnTask.className = 'icon edit';
	editBtnTask.title = 'Редактировать задачу';
	editBtnTask.setAttribute('data-task-id', task.taskID);

	// Delete btn task
	deleteBtnTask.className = 'icon bin';
	deleteBtnTask.title = 'Удалить задачу';
	deleteBtnTask.setAttribute('data-task-id', task.taskID);

	// Block Contextual Links
	сontextualLinks.className = 'сontextual__links';
	сontextualLinks.append(deleteBtnTask, editBtnTask);


	// Изменяем чекбокс
	taskCheck.type = 'checkbox';
	taskCheck.id = task.taskID;
	taskCheck.classList.add('task__ckeckbox');

	if (task.state == 1) taskCheck.checked = true;

	// Изменяем label
	labelContainer.classList.add('label__container');
	taskLabel.htmlFor = task.taskID;
	labelContainer.append(taskLabel);

	// Добавялем заголовок задачи
	taskText.innerHTML = task.text;

	// Блок с датой создания задачи
	taskDate.classList.add('task__create__date');
	taskDate.innerHTML = task.date;


	// Содержимое задачи
	taskContentContainer.className = 'task__content';
	taskContentContainer.append(taskText, taskDate);


	taskItem.append(taskCheck, labelContainer, taskContentContainer, сontextualLinks);


	tasksContainer.prepend(taskItem);

	return task;
}

// Устанавливает оброботчики событий
Todo.prototype.setHandler = function () {

	let tasksContainer = document.querySelector('.tasks'),
		addBtn = document.querySelector('.tasks__footer .btn__add');

	tasksContainer.addEventListener('click', this.taskDone);
	tasksContainer.addEventListener('click', this.deleteTask);
	tasksContainer.addEventListener('click', this.editTask);
	addBtn.addEventListener('click', this.addTask);
}

// Запускаем приложение
Todo.prototype.run = function () {

	if (Todo.prototype.myStorage.tasks || Todo.prototype.myStorage.takskComplete || Todo.prototype.myStorage.tasksFailed) this.render();

	// Раз в 12 часов проверять задачи на предмет выполнения их в срок
	setInterval(() => {
		this.taskFailed();
		this.render();
	}, 12 * 60 * 1000);


	this.setHandler();
	this.taskFailed();
	this.render();
}




let todo = new Todo();




// document.querySelector('.clear__btn').onclick = function () {
// 	if (Todo.prototype.myStorage.tasks) Todo.prototype.myStorage.removeItem('tasks');
// 	window.location.reload();
// }



function testTodoList() {
	for (let i = 1; i < 11; i++) {
		let year = 2000 + Math.round(Math.random() * 100),
			month = Math.round(Math.random() * 12),
			day = Math.round(Math.random() * 31);

		let date = `${day}.${month}.${year}`;
		let taskTitle = `Тестовая задача ${Math.round(Math.random() * 100000)}`;
		let desc = `Описание к задаче`;

		let task = new Task(taskTitle, date, desc);


		Todo.prototype.myStorage.tasks ? Todo.prototype.myStorage.tasks += ',' + JSON.stringify(task) : Todo.prototype.myStorage.tasks = JSON.stringify(task);
	}

	Todo.prototype.render();
}


todo.run();