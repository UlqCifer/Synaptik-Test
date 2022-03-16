Для запуска необходимо создать .env файл с настройками подключения к PostgreSQL и настройками бронирования автомобиля:

POSTGRES_HOST= Адрес сервера
POSTGRES_PORT= Порт
POSTGRES_USER= Пользователь БД
POSTGRES_PASSWORD= Пароль пользователя БД
POSTGRES_DB= Имя БД

RENT_BLOCK_DAYS= Количество дней блокировки между бронированиями
RENT_DEFAULT_PRICE= Базовая цена
RENT_MAX_DAYS= Максимальная длительность бронирования

Для запуска требуется NestJs версии 8.0.0^
nest start
