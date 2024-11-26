# Ecommerce

Create using Django backend with React frontend

### Setting up

1. Ensure you have all the requirements below installed

- Python 3.10 +
- Django 5.0 +
- Node 18 +
- PostgreSQL

2. In the main folder, run the following commands:

`pip install -r requirements.txt`

In the frontend folder, run the following commands:

`npm install -f`
'-f' because sometimes the error in version but no need to worry about it.

After that, run the following command:
In the main folder, run the following command:

`python manage.py makemigrations`

If u get an error, try deleting other files than `__init__.py` in migrations folder in accounts and store folder.

Then run the following command:

`python manage.py migrate`

In this project I use PostgreSQL. You can change the database in `settings.py` in `/Ecommerce`. If you want to use PostgreSQL, you can make the user as default(postgre), password `123` and a database `New` to incorporate to the project, or you can change it in the `settings.py` to your preference.

### Running the project

In the main folder, run the following command:

`python manage.py runserver`
The backend will be running on port 8000, we can access the admin panel on port 8000/admin.

In the frontend folder, run the following command:

`npm run dev`
The frontend will be running on port 4153 or other port, refer to the terminal.

### Additional Information

To create a superuser, run the following command:

`python manage.py createsuperuser`
