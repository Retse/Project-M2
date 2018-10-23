# Hiker


## Description

Community based App that joins hiking enthusiasts for trekking trips around the world. You can be a guide and create a trip event or join one. You can meet amazing people and incredible places!
 
## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault 
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **homepage** - As a user I want to be able to access the homepage so that I see what the app is about and login and signup
- **sign up** - As a user I want to sign up on the webpage so that I can see all the events that I could attend
- **login** - As a user I want to be able to log in on the webpage so that I can get back to my account
- **logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account
- **create a profile** - As a user I want to cerate my profile so that I can to join to the diferents activities
- **events list** - As a user I want to see all the events available so that I can choose which ones I want to attend
- **events find** - As a user I want to find the events acording to my search preferences so that I can see events that are relevant for me
- **events create** - As a user I want to create an event so that I can invite others to attend
- **events detail** - As a user I want to see the event details and attendee list of one event so that I can decide if I want to attend 
- **events attend** - As a user I want to be able to attend to event so that the organizers can count me in
- **events unattend** - As a user I want to be able to cancel my participation in an event so that other users know if I am going to attend or not
- **events edit** -  As a guide (user) I want to edit an event I created so that it can adjust to a flexible schedule, change participants, etc 

## Backlog

List of other features outside of the MVPs scope

Homepage:
- Showing a list of events

User profile:
- see our profile
- edit profile
- delete profile 
- see other users profile
- follow other users
- list of events created by the user
- list events the user is attending

Events
- when creating an event the form displays the options regarding place and routes
- delete events from the event detail
- send an email to participants if the event is cancelled
- send a remainder to participants of incoming events
- cancel a user participation on an event
- delete an event so that other users know that it is not taking place

Geo Location:
- add geolocation to events when creating
- show event in a map in event detail page

Main
- shows feed from other users and events that you are following or that are taking place near you

API
- Integrate an API that seeds our database with real hiking routes

Responsive
- make our App responsive

## ROUTES:

- GET / 
  - renders the homepage
  - add a togle buttom that renders the signup form (with flash msg)

- POST /auth/signup
  - redirects to /index if user logged in
  - body:
    - username
    - email
    - password
    - date of birth
    - gender

- POST /auth/login
  - redirects to /index if user logged in
  - body:
    - username or email
    - password

- POST auth/logout if user is logged in 
  - closes the session
  - redirect to homepage


- GET / if user is logged in
  - bring users data from database
  - render index with user data + event list + create form (ocult-toggle) + find form (ocult-toggle)

- GET /event?q= if user is logged in
  - find in database events with filtering options
  - redirect a event/list (filtered data)

- GET user/profile  if user is logged in
  - render user/profile

- GET /event/create if user is logged in 
  - render event/create.ejs

- POST /event/create if user is logged in 
  - redirects to event/list (all data)
  - body: 
    - name
    - guide
    - date
    - location
      - city
      - region
      - country
    - starting-point
    - description
    - participants
    - dificulty level
    - duration

- GET /events/:id if user is logged in
  - renders the event detail page
  - includes the list of attendees
  - attend button if user is or not attending yet  

- POST /events/:id if user is logged in
  - unattend/attend an event action 
  - redirects to /events/:id
  - adds participant to event participant array
  - adds flash notification that the user has been added
  - body: (empty - the user is already stored in the session)

## Models

User model
 
```
username: String /unique
password: String
email: String /unique
Date of birth: Date
```

Event model

```
title: String
image: String
guide: ObjectID
date: Date
location
  - city: String
  - region: String
  - country: String
starting-point: String
description: String
participants: [ObjectID]
dificulty level: String, enum [easy, medium, hard]
duration: String

``` 

## Links

### Trello

[Link to your trello board](https://trello.com) or picture of your physical board

### Git

The url to your repository and to your deployed project

[Repository Link](http://github.com)

[Deploy Link](http://heroku.com)

### Slides

The url to your presentation slides

[Slides Link](http://slides.com)