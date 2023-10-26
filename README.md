## Food flow

2200692 Pang Zi Jian Adrian <br>
2200959 Peter Febrianto Afandy <br>
2201014 Tng Jian Rong <br>
2200936 Muhammad Nur Dinie Bin Aziz <br>
2201132 Lionel Sim Wei Xian <br>
2201159 Ryan Lai Wei Shao <br>

# Usage

1. Change your directory to the `docker-composer` folder:

```
cd docker-composer
```

2. Run the script `deploy.sh` to start *kubernetes*

```
./deploy.sh
```

## ARCHIVE
### UI setup

---

#### Prerequisites

- [npm/npx](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

#### React Setup

1. Change your current directory to the `react/` folder:

```
cd react
```

2. Install dependencies

```
npm install --save-dev @babel/plugin-proposal-private-property-in-object
```

3. Start React App

```
npm start
```

---

#### Auth microservice Setup

1. Change your current directory to the `auth/` folder:

```
cd auth
```

2. Install dependencies

```
npm install
```

3. Start Auth microservice

```
npm run start:dev
```

---

#### Django Setup

1. Change your current directory to the `django/` folder:

```
cd django
```

2. Setup virtual environment

```
virtualenv env
```

3. Activate virtual environment

| For Mac                      | For Windows                 |
| ---------------------------- | --------------------------- |
| ```source env/bin/activate```| ```.\env\Scripts\activate```|

4. Install dependencies

```
pip3 install -r requirements.txt
```

5. Setup database

```
python manage.py makemigrations
python manage.py migrate
```

6. Start Django App

```
python manage.py runserver
```

