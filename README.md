# Fridge API

Fridge API is a service that allows users to maintain the contents of their
“fridges,” a personal list of food items that can be added to, deleted from, or updated 
in some way. Users can also keep a record of "core ingredients," food items that they want to always have a certain quantity of in their fridge.
If what they have listed in the core list is not met by what is currently in their fridge, a list of items that have been under-purchased can be generated. 
Users and their respective fridges can be added to and deleted at any time.

## Build

Clone this github repo into an accessible location in your file system and open up the JAYA folder in your favorite IDE (we recommend IntelliJ or VS Code). 

```bash
git clone https://github.com/ambermildenhall/JAYA.git
```

Build all files in the JAYA/Fridge. If you're are using IntelliJ, create a connection to a PostgreSQL data source.

Download most recent version of PostgreSQL [here](https://www.postgresql.org/download/).

## Run

Using your preferred IDE, run FridgeApplication.java. In your home terminal enter the following command:

```bash
psql -h 35.226.5.196 -U jaya_team jaya
```
From here, when prompted "Password for user jaya_team:", provide the same password as given in application.properties 
by spring.datasource.password

From your terminal, view the list of relations with the following command:

```bash
\d
```

To view the contents of the food table, enter the following command into your terminal:
```bash
SELECT * FROM food;
```
To view the contents of the users table, enter the following command into your terminal:
```bash
SELECT * FROM users;
```

## Test
Install the Postman app or access Postman through your web browser [here](https://www.postman.com/downloads/).

### getFridge
To get a specific user's fridge, create a GET request in Postman with the following request url:
```bash
localhost:8080/api/v1/fridge/get-fridge
```
Add a number to represent the userId of the desired user in raw JSON format under the Body and send the request. An example is shown below:
```bash
10
```
This request will return a list of all the specified user's items that are stored in their fridge.

### getFridgeAll
To get every user’s fridge, create a GET request in Postman with the following request url:
```bash
localhost:8080/api/v1/fridge/get-all
```

### missingCore
To get a list of foods that are below their core quantity amount for a specific user, create a GET request in Postman with the following request url:
```bash
localhost:8080/api/v1/fridge/missing-core
```
Add a number to represent the userId of the desired user in raw JSON format under the Body and send the request. An example is shown below:
```bash
10
```

### deleteItem
To completely delete a specific food from a specified user’s fridge, create a DELETE request in Postman with the following request url:
```bash
localhost:8080/api/v1/fridge/user/{userId}/food/{foodName}/delete
```
{userId} can be replaced with a specific user ID and {foodName} can be replaced with any food currently in the fridge of the specified user. An example is shown below:
```bash
localhost:8080/api/v1/fridge/user/10/food/carrot
```

### addUser
To add a user to the users table, create a POST request in Postman with the following request url:
```bash
localhost:8080/api/v1/fridge/add-user
```
A User object that represents the desired user to be added must be given in raw JSON format under Body. An example is provided below:
```bash
{
    "userId": 12,
    "email": "alanturing@columbia.edu",
    "name": "Alan Turing"
}
```

### deleteUser
To delete a user from the users table and remove all their fridge items from food, create a DELETE request in Postman with the following request url:
```bash
localhost:8080/api/v1/fridge/delete-user
```
Add a number to represent the userId of the desired user in raw JSON format under the Body and send the request. An example is shown below:
```bash
10
```

### updateFood
To update the quantity of a specific user's food or generate a new food if it doesn’t exist in that user’s fridge, create a POST request in Postman with the following request url:
```bash
localhost:8080/api/v1/fridge/user/{userId}/food/{foodName}/update
```
{userId} can be replaced with a specified user ID and {foodName} can be replaced with any food currently in the fridge of the specified user. An example is shown below:
```bash
localhost:8080/api/v1/fridge/user/40/food/apple/update
```
An UpdateQuantity object that represents the desired quantity change must be given in raw JSON format under Body. An example is provided below:
```bash
{
    "deltaFoodQuantity": -8,
    "newCoreQuantity": 0
}
```
This will end up deleting 8 apples from user 40’s fridge, and update the core quantity of the apple food to 0.

# API Documentation

## Get a specified user's fridge
To request the content of a specific user’s fridge, use the following endpoint.
### GET /api/v1/fridge/get-fridge
#### Arguments:
Long userId: A Long representing the unique ID of the user of the fridge to be returned sent in the request body
### Return:
This request will return a list of the specified user's items.

## Get all users’ fridges
To request the content of all users’ fridges, use the following endpoint.
### GET /api/v1/fridge/get-all
#### Arguments:
None
### Return:
This request will return a list of all user's fridges.
## Get a list of food items with quantities fewer than their core quantities
To request the food items of a specific user’s fridge where the quantities of the food items are less than their core quantities, use the following endpoint.
### GET /api/v1/fridge/missing-core
#### Arguments:
Long userId: A Long representing the unique ID of the user whose food quantities need to be examined
### Return:
This request will return a list of food items with quantities less than their core quantities.

## Delete a specific user’s food item
To request to delete a specific item in a specific user’s fridge, use the following endpoint.
### DELETE /api/v1/fridge/user/{userId}/food/{foodName}/delete
#### Arguments:
Long userID: A Long representing the unique ID of the user whose food is to be deleted sent as a path variable

String foodName: A string representing the name of the food item to be deleted sent as a path variable
### Return:
None

## Add a user to the database
To add a user and their corresponding user ID, name, and email to the table of users within the database, use the following endpoint.
### POST /api/v1/fridge/add-user
#### Arguments:
User user: An object of type User containing Long userId, String name, and String email to be sent in the request body
### Return:
None

## Delete a user and all their records
To delete a user from the users table and all of their corresponding food records from the food table of the database, use the following endpoint.
### DELETE /api/v1/fridge/delete-user
#### Arguments:
Long userId: The Long representing the ID of the user to be deleted sent in the request body
### Return:
None

## Update the quantity of a specific user’s food item
To either generate a new food object (if it doesn’t exist) for a specific user, or update the food/core quantity by a certain amount, use the following endpoint. If a value is inputted for food quantity (and the food exists in the user’s fridge), the original food quantity will be adjusted by the value given. If a value for core is inputted, the original core value will be replaced with the new one. 
### POST /api/v1/fridge/user/{userId}/food/{foodName}/update
#### Arguments:
UpdateQuantity delta: An object of type UpdateQuantity containing Long deltaFoodQuantity and Long newCoreQuantity to be sent in the request body. Long deltaFoodQuantity represents the amount for the food quantity to change and Long newCoreQuantity represents the quantity core may be updated to.

Long userId: The Long representing the ID of the user to be deleted sent as a path variable

String foodName: The string representing the food name with the quantity to be updated.
### Return:
None
