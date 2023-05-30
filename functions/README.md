# Functions
**API Endpoints for Todo and User**

## Todo Endpoints
#### getAllTodos
```http
URL: http://localhost:5000/todoapp-<app-id>/<region-name>/api/todos
METHOD: GET
```
#### getOneTodo
```http
URL: http://localhost:5000/todoapp-<app-id>/<region-name>/api/todo/<todoId>
METHOD: GET
```
#### postOneTodo
```http
URL: http://localhost:5000/todoapp-<app-id>/<region-name>/api/todo
METHOD: POST
BODY: {
  "title": "Homework",
  "body": "Do math homework"
}
```
#### deleteTodo
```http
URL: http://localhost:5000/todoapp-<app-id>/<region-name>/api/todo/<todoId>
METHOD: DELETE
```
#### editTodo
```http
URL: http://localhost:5000/todoapp-<app-id>/<region-name>/api/todo/<todoId>
METHOD: PUT
BODY: {
  "title": "Homework 2",
  "body": "Do science homework"
}
```

## Users
#### loginUser
```http
URL: http://localhost:5000/todoapp-<app-id>/<region-name>/api/login
METHOD: POST
BODY: {
  "email": "username@email.com",
  "password": "password1"
}
```
#### signUpUser
```http
URL: http://localhost:5000/todoapp-<app-id>/<region-name>/api/signup
METHOD: POST
BODY: {
  "firstName": "first name here",
  "lastName": "last name here",
  "email" "email here",
  "phoneNumber": "phone number here",
  "country": "country here",
  "password" "password here",
  "confirmPassword": "same password here",
  "username": "username here"
}
```
#### uploadProfilePicture
```http
URL: http://localhost:5000/todoapp-<app-id>/<region-name>/api/user/image
METHOD: POST
BODY: {
  "content-type": "form-data",
  "image": "profile.png"
}
```
#### updateUserDetails
```http
URL: http://localhost:5000/todoapp-<app-id>/<region-name>/api/user
METHOD: POST
BODY: {
  "firstName": "name",
  "lastName": "name2",
  "country": "country1"
}
```
#### getUserDetails
```http
URL: http://localhost:5000/todoapp-<app-id>/<region-name>/api/user
METHOD: GET
```
