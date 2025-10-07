# Task Manager - FastAPI + React SPA

Приложение для управления задачами с автоматической загрузкой файлов из папки.

## Структура проекта

```
swift-standalone/
├── backend/           # FastAPI сервер
│   ├── main.py       # API endpoints
│   ├── models.py     # SQLAlchemy модели
│   ├── schemas.py    # Pydantic схемы
│   ├── database.py   # Настройка БД
│   └── requirements.txt
├── frontend/         # React приложение
│   ├── src/
│   │   ├── components/  # React компоненты
│   │   ├── api/        # API клиент
│   │   └── types/      # Типы данных
│   └── package.json
└── data/
    ├── folder_in/    # Входные файлы
    └── folder_out/   # Выходные файлы
```

## Функциональность

### Задачи (Tasks)
- **Статусы**: pending, processing, completed, error
- **Поля**: ID, дата создания, пользователь, folder_in, folder_out
- При создании задачи автоматически загружаются все файлы из folder_in

### Файлы (Files)
- **Статусы**: init, active, success, error
- **Поля**: ID, имя файла, путь, статус, дата создания
- Каждый файл связан с задачей
- По умолчанию создаются в статусе "init"

### Интерфейс
- **Toolbar**: кнопки "Добавить", "Просмотр", "Список файлов"
- **Список задач**: таблица со всеми задачами
- **Форма создания**: ввод путей folder_in и folder_out
- **Список файлов**: просмотр файлов конкретной задачи

## Установка и запуск

### Backend (FastAPI)

```bash
# Переход в папку backend
cd backend

# Создание виртуального окружения
python -m venv venv

# Активация виртуального окружения
# macOS/Linux:
source venv/bin/activate
# Windows:
# venv\Scripts\activate

# Установка зависимостей
pip install -r requirements.txt

# Запуск сервера
python main.py
```

Сервер будет доступен на http://localhost:8000

### Frontend (React)

```bash
# Переход в папку frontend (в новом терминале)
cd frontend

# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev
```

Приложение будет доступно на http://localhost:3000

## Использование

1. Создайте тестовые файлы в папке `data/folder_in/`:
   ```bash
   echo "test 1" > data/folder_in/file1.txt
   echo "test 2" > data/folder_in/file2.txt
   ```

2. Откройте приложение в браузере: http://localhost:3000

3. Нажмите "Добавить" и введите пути:
   - Folder In: `data/folder_in`
   - Folder Out: `data/folder_out`

4. После создания задачи файлы автоматически загрузятся из folder_in

5. Выберите задачу в списке и нажмите "Список файлов" для просмотра

## API Endpoints

- `GET /api/tasks` - Получить все задачи
- `GET /api/tasks/{task_id}` - Получить задачу по ID
- `POST /api/tasks` - Создать новую задачу
- `GET /api/tasks/{task_id}/files` - Получить файлы задачи
- `PATCH /api/files/{file_id}/status` - Обновить статус файла

## База данных

SQLite база данных `tasks.db` создается автоматически при первом запуске.

Таблицы:
- `tasks` - задачи
- `task_files` - файлы задач (связь один-ко-многим)
