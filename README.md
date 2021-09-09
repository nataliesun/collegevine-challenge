# Collegevine Challenge

The attached CSV contains a list of ~650 schools and their latitude+longitude. Your task is to build a web application that allows users to search for schools within X miles of their location, or any other lat+longitude. Your application should render the results sorted by distances from the user's current location, with an indication of how many miles away they are from the school. Feel free to use any off-the-shelf components you like. We'd like you to solve this problem like you would during an ordinary work day. Its most important that your solution works, but we appreciate a nice UI/UX as well.

---

## Getting started

1. Install node modules in each `collegevine-app` and `collegevine-api` using `yarn`
2. cd `collegevine-app` && `yarn`
3. open a second terminal cd `collegevine-api` && `yarn`
4. in first terminal `yarn start` to start react application
5. in second terminal `yarn start` to start api server

## What it does

- On the react application landing page you'll be prompted to allow the browser to get your location
- Otherwise you can input custom coordinates
- Hitting submit will give you a sorted list of colleges with distance in miles away from the input location
